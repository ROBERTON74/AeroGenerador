import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// The original Blender vertex deltas, also used by the three platform viewers.
const half = new Float32Array(65536);
for (let i = 0; i < half.length; i++) {
  const sign = i & 32768 ? -1 : 1, exponent = (i >> 10) & 31, mantissa = i & 1023;
  half[i] = sign * (exponent === 0 ? 2 ** -14 * mantissa / 1024 : exponent === 31 ? (mantissa ? NaN : Infinity) : 2 ** (exponent - 15) * (1 + mantissa / 1024));
}

function distantGeometry(source) {
  const uv = source.attributes.uv;
  const us = [...new Set(Array.from({ length: uv.count }, (_, i) => uv.getX(i)))].sort((a, b) => a - b);
  const vs = [...new Set(Array.from({ length: uv.count }, (_, i) => uv.getY(i)))].sort((a, b) => a - b);
  const lookup = new Map();
  for (let i = 0; i < uv.count; i++) lookup.set(uv.getX(i) + ':' + uv.getY(i), i);
  const sample = values => values.filter((_, i) => i % 8 === 0 || i === values.length - 1);
  const u = sample(us), v = sample(vs), mapping = [], points = [], coords = [], indices = [];
  for (const y of v) for (const x of u) {
    const index = lookup.get(x + ':' + y);
    if (index === undefined) throw Error('Cuadrícula del mar incompleta.');
    mapping.push(index);
    const p = source.attributes.position;
    points.push(p.getX(index), p.getY(index), p.getZ(index));coords.push(x, y);
  }
  // Derive connectivity from the native triangles, rather than filling a UV
  // rectangle. Preserve every native boundary vertex, including UV islands.
  const nativeIndex = source.index?.array ?? Array.from({ length: uv.count }, (_, i) => i);
  const edges = new Map();
  for (let i = 0; i < nativeIndex.length; i += 3) {
    const triangle = [nativeIndex[i], nativeIndex[i + 1], nativeIndex[i + 2]];
    for (let j = 0; j < 3; j++) {
      const a = triangle[j], b = triangle[(j + 1) % 3], key = Math.min(a, b) + ':' + Math.max(a, b);
      edges.set(key, (edges.get(key) || 0) + 1);
    }
  }
  const boundary = new Set();
  for (const [edge, count] of edges) if (count === 1) for (const vertex of edge.split(':')) boundary.add(Number(vertex));
  const coarseLookup = new Map(mapping.map((native, i) => [native, i]));
  const nearest = (values, samples) => new Map(values.map(value => [value, samples.reduce((a, b) => Math.abs(a - value) <= Math.abs(b - value) ? a : b)]));
  const snapU = nearest(us, u), snapV = nearest(vs, v), remap = new Uint32Array(uv.count);
  for (let i = 0; i < uv.count; i++) {
    const native = boundary.has(i) ? i : lookup.get(snapU.get(uv.getX(i)) + ':' + snapV.get(uv.getY(i)));
    if (!coarseLookup.has(native)) {
      coarseLookup.set(native, mapping.length);mapping.push(native);
      const p = source.attributes.position;
      points.push(p.getX(native), p.getY(native), p.getZ(native));coords.push(uv.getX(native), uv.getY(native));
    }
    remap[i] = coarseLookup.get(native);
  }
  const triangles = new Set();
  for (let i = 0; i < nativeIndex.length; i += 3) {
    const a = remap[nativeIndex[i]], b = remap[nativeIndex[i + 1]], c = remap[nativeIndex[i + 2]];
    if (a === b || b === c || a === c) continue;
    const key = [a, b, c].sort((x, y) => x - y).join(':');
    if (!triangles.has(key)) { triangles.add(key);indices.push(a, b, c); }
  }
  const geometry = new THREE.BufferGeometry();geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(coords, 2));geometry.computeVertexNormals();
  // Preserve the original fine wave normals in the distant geometry as well.
  // Otherwise coarse interpolation creates a visible square around the detailed tiles.
  const normalMapping = [];
  for (const y of vs) for (const x of us) {
    const index = lookup.get(x + ':' + y);
    if (index === undefined) throw Error('Mapa de normales del mar incompleto.');
    normalMapping.push(index);
  }
  const pixels = new Uint8Array(us.length * vs.length * 4);
  const normalMap = new THREE.DataTexture(pixels, us.length, vs.length, THREE.RGBAFormat);
  normalMap.minFilter = THREE.LinearFilter;normalMap.magFilter = THREE.LinearFilter;
  normalMap.repeat.set((us.length - 1) / us.length / (us.at(-1) - us[0]), (vs.length - 1) / vs.length / (vs.at(-1) - vs[0]));
  normalMap.offset.set(.5 / us.length - us[0] * normalMap.repeat.x, .5 / vs.length - vs[0] * normalMap.repeat.y);
  return { geometry, mapping, normalMapping, normalMap, pixels };
}

export async function loadBlenderSea({ baseUrl = '/models/mar-blender/', scale, height = -.08, signal } = {}) {
  const group = new THREE.Group();group.name = 'MAR_BLENDER_PRINCIPAL_075';group.position.y = height;group.scale.setScalar(scale);
  const state = group.userData = { source: 'Blender', speed: .75, seaTime: 0, fullDetailModules: 0, modules: 169, animals: 0 };
  const motions = [], cache = new Map(), originalMaterials = new Set();let water, sample = -1, lodKey = '';
  const get = async name => {
    const response = await fetch(baseUrl + name, { signal });
    if (!response.ok) throw Error('No se pudo cargar el mar: ' + name);
    return response;
  };
  const motionFile = async name => {
    const bytes = await (await get(name)).arrayBuffer();
    const header = new Uint8Array(bytes, 0, Math.min(bytes.byteLength, 2));
    // Vite may already have decoded Content-Encoding:gzip.
    if (header[0] !== 0x1f || header[1] !== 0x8b) return new Uint16Array(bytes);
    return new Uint16Array(await new Response(new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
  };
  group.dispose = () => {
    const geometries = new Set(), materials = new Set(originalMaterials), textures = new Set();
    for (const root of [group, water?.scene]) root?.traverse(o => {
      if (!o.isMesh) return;
      geometries.add(o.geometry);
      for (const material of [o.material].flat()) {
        materials.add(material);
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
      }
    });
    for (const item of [...geometries, ...materials, ...textures]) item.dispose();
    for (const m of motions) { m.close.dispose();m.far.dispose(); }
    motions.length = 0;cache.clear();group.clear();
  };
  try {
    const meta = await (await get('mar_animacion.json')).json();
    const bytes = await (await get(meta.static)).arrayBuffer();
    water = await new GLTFLoader().parseAsync(bytes, baseUrl);
    water.scene.updateMatrixWorld(true);
    for (const row of meta.meshes) {
      const mesh = water.scene.getObjectByName(row.name);
      if (!mesh?.isMesh) throw Error('Falta una malla del mar: ' + row.name);
      if (!cache.has(row.file)) cache.set(row.file, motionFile(row.file));
      const values = await cache.get(row.file);
      if (values.length !== row.targets * row.vertices * 3) throw Error('Datos de oleaje incompletos.');
      const attr = mesh.geometry.attributes.position;attr.setUsage(THREE.DynamicDrawUsage);
      const distant = distantGeometry(mesh.geometry);
      const originalMaterial = mesh.material;
      originalMaterials.add(originalMaterial);
      mesh.material = originalMaterial.clone();
      // Preserve the old sea's depth writing so submerged transparent teaching
      // planes cannot sort in front of the water and draw a rectangular overlay.
      Object.assign(mesh.material, { depthWrite: true, side: THREE.DoubleSide, transparent: true, opacity: .96, roughness: .38, metalness: .08 });
      mesh.material.normalMap = distant.normalMap;mesh.material.normalMapType = THREE.ObjectSpaceNormalMap;
      mesh.material.color.set('#4d8295');
      const close = new THREE.InstancedMesh(mesh.geometry, mesh.material, 10);
      const far = new THREE.InstancedMesh(distant.geometry, mesh.material, 169);
      close.name = 'MAR_DETALLE_' + row.name;far.name = 'MAR_LEJANO_' + row.name;
      close.frustumCulled = false;far.frustumCulled = false;
      close.receiveShadow = true;far.receiveShadow = true;
      motions.push({ row, values, base: attr.array.slice(), attr, geometry: mesh.geometry, distant, close, far, matrix: mesh.matrixWorld.clone(), normalMatrix: new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld) });
      group.add(close, far);
    }
    group.update = (dt, playing, cameraPosition) => {
      const cx = cameraPosition ? THREE.MathUtils.clamp(Math.round(cameraPosition.x / (150 * scale)), -6, 6) : 0;
      const cz = cameraPosition ? THREE.MathUtils.clamp(Math.round(cameraPosition.z / (150 * scale)), -6, 6) : 0;
      const key = cx + ':' + cz;
      if (key !== lodKey) {
        lodKey = key;const translation = new THREE.Matrix4();
        for (const m of motions) {
          let near = 0, far = 0;
          for (let x = -6; x <= 6; x++) for (let z = -6; z <= 6; z++) {
            translation.makeTranslation(x * 150, 0, z * 150);
            const matrix = translation.clone().multiply(m.matrix);
            if ((Math.abs(x) <= 1 && Math.abs(z) <= 1) || (x === cx && z === cz)) m.close.setMatrixAt(near++, matrix);
            else m.far.setMatrixAt(far++, matrix);
          }
          m.close.count = near;m.far.count = far;m.close.instanceMatrix.needsUpdate = true;m.far.instanceMatrix.needsUpdate = true;
          state.fullDetailModules = near;
        }
      }
      if (playing) state.seaTime += dt * .75;
      const nextSample = Math.floor(state.seaTime * 48);
      if (nextSample === sample) return;sample = nextSample;
      for (const m of motions) {
        const { row, values, base, attr, geometry } = m;
        const times = row.times, duration = times.at(-1) - times[0], time = (state.seaTime % duration) + times[0];
        let low = 0, high = times.length - 1;
        while (low + 1 < high) { const mid = (low + high) >> 1;if (times[mid] <= time) low = mid;else high = mid; }
        const mix = (time - times[low]) / (times[high] - times[low]), weights = new Map();
        for (const [i, w] of row.weights[low]) weights.set(i, (weights.get(i) || 0) + w * (1 - mix));
        for (const [i, w] of row.weights[high]) weights.set(i, (weights.get(i) || 0) + w * mix);
        attr.array.set(base);
        for (const [target, weight] of weights) {
          if (Math.abs(weight) < 1e-7) continue;
          const offset = target * base.length;
          for (let i = 0; i < base.length; i++) attr.array[i] += half[values[offset + i]] * weight;
        }
        attr.needsUpdate = true;geometry.computeVertexNormals();
        const distant = m.distant, position = distant.geometry.attributes.position, normal = distant.geometry.attributes.normal;
        for (let i = 0; i < distant.mapping.length; i++) {
          const index = distant.mapping[i], n = geometry.attributes.normal;
          position.setXYZ(i, attr.getX(index), attr.getY(index), attr.getZ(index));normal.setXYZ(i, n.getX(index), n.getY(index), n.getZ(index));
        }
        position.needsUpdate = true;normal.needsUpdate = true;
        // Coarse boundary fans can turn over as the original choppy vertices
        // move horizontally. Keep their facing consistent with the native sea.
        const index = distant.geometry.index;let reoriented = false;
        for (let i = 0; i < index.count; i += 3) {
          const a = index.array[i], b = index.array[i + 1], c = index.array[i + 2];
          const upward = (position.getZ(b) - position.getZ(a)) * (position.getX(c) - position.getX(a)) - (position.getX(b) - position.getX(a)) * (position.getZ(c) - position.getZ(a));
          if (upward < 0) { index.array[i + 1] = c;index.array[i + 2] = b;reoriented = true; }
        }
        if (reoriented) index.needsUpdate = true;
        const nativeNormal = geometry.attributes.normal, vector = new THREE.Vector3();
        for (let i = 0; i < distant.normalMapping.length; i++) {
          const index = distant.normalMapping[i];
          vector.fromBufferAttribute(nativeNormal, index).applyNormalMatrix(m.normalMatrix);
          distant.pixels[i * 4] = Math.round((vector.x * .5 + .5) * 255);
          distant.pixels[i * 4 + 1] = Math.round((vector.y * .5 + .5) * 255);
          distant.pixels[i * 4 + 2] = Math.round((vector.z * .5 + .5) * 255);
          distant.pixels[i * 4 + 3] = 255;
        }
        distant.normalMap.needsUpdate = true;
      }
    };
    group.update(0, false);
    return group;
  } catch (error) { group.dispose();throw error; }
}
