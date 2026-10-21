import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { fatigueZoneForMesh } from './fatigueZones.js';

export const BLENDER_MODEL_URL = '/models/aerogenerador.glb';
export const ROTOR_NAME = 'ROTOR_3_PALAS_ESCALA_PRECISA_EJE_Y';
export const MODEL_SCALE = 5.2 / 102.5;

/** Build an isolated instance. Cached GLTF geometry/materials are never modified. */
export function prepareBlenderTurbine(gltf) {
  const model = gltf.scene.clone(true);
  const ownedGeometries = [];
  const ownedMaterials = new Set();
  const materialCopies = new Map();
  const nacelleMaterials = [];
  const bladeFlexUniform = { value: 0 };
  const fatigueUniform = { value: 0 };
  const inspectionUniform = { value: 0 };
  const inspectionFocus = { value: 0 };
  model.updateMatrixWorld(true);
  const rotor = model.getObjectByName(ROTOR_NAME);
  const tower = model.getObjectByName('TOWER_MONOLITH_continuous_metal_skin');
  const nacelle = model.getObjectByName('SUPER_NACELLE_gondola_aerodinamica_panelada_13m');
  if (!rotor || !tower || !nacelle) throw new Error('El GLB no contiene el rig esperado del aerogenerador.');
  const towerCenter = new THREE.Box3().setFromObject(tower).getCenter(new THREE.Vector3());
  const origin = new THREE.Vector3(towerCenter.x, 0, towerCenter.z);
  const hub = rotor.getWorldPosition(new THREE.Vector3()).sub(origin).multiplyScalar(MODEL_SCALE);
  const nacelleBox = new THREE.Box3().setFromObject(nacelle);
  const nacelleCenter = nacelleBox.getCenter(new THREE.Vector3()).sub(origin).multiplyScalar(MODEL_SCALE);
  const nacelleSize = nacelleBox.getSize(new THREE.Vector3()).multiplyScalar(MODEL_SCALE);
  // Reparent only the upper assembly; the tower and its fittings stay fixed during yaw.
  const yaw = new THREE.Group();
  yaw.name = 'WEB_nacelle_yaw';
  yaw.position.set(origin.x, rotor.position.y, origin.z);
  model.add(yaw);model.updateMatrixWorld(true);
  for (const child of [...model.children]) {
    if (child === yaw) continue;
    const towerPart = /^(TOWER|torre_|brida_|puerta_|maneta_|IB_CORRECT_tower)/.test(child.name);
    const box = new THREE.Box3().setFromObject(child);
    if (child === rotor || (!towerPart && box.getCenter(new THREE.Vector3()).y > 97)) yaw.attach(child);
  }
  model.position.sub(origin);
  model.updateMatrixWorld(true);
  model.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = true; object.receiveShadow = true;
    const shell = /NACELLE|RESTORED_GRILLE|RESTORED_STRIPE|IB_CORRECT_(left|right|logo)/.test(object.name);
    const blade = object.name.startsWith('pala_') || object.parent?.name.startsWith('pala_');
    const fatigueZone = fatigueZoneForMesh(object.name, object.parent?.name);
    const copyMaterial = original => {
      // Keep shell materials separate so analysis transparency cannot affect the blades.
      const key = original.uuid + (shell ? ':shell' : blade ? ':blade' : ':solid') + ':' + fatigueZone;
      if (!materialCopies.has(key)) {
        const material = original.clone();
        material.roughness = Math.max(material.roughness ?? .4, .25);
        material.metalness = Math.min(material.metalness ?? 0, .7);
        materialCopies.set(key, material);ownedMaterials.add(material);
        if (shell) nacelleMaterials.push(material);
        material.userData.fatigueZone = fatigueZone;
        material.onBeforeCompile = shader => {
          shader.uniforms.bladeFlex = bladeFlexUniform;
          shader.uniforms.delEnabled = fatigueUniform;
          shader.uniforms.inspectionEnabled = inspectionUniform;
          shader.uniforms.inspectionFocus = inspectionFocus;
          const category = fatigueZone === 'blade' || fatigueZone === 'root' ? 1 : fatigueZone === 'tower' ? 2 : shell || fatigueZone === 'bearing' || fatigueZone === 'hub' ? 0 : 3;
          const weight = fatigueZone === 'blade' ? '1.0 - smoothstep(5.0, 27.0, length(position))'
            : fatigueZone === 'tower' ? '1.0 - smoothstep(0.3, 1.7, (modelMatrix * vec4(transformed, 1.0)).y)'
            : fatigueZone === 'root' ? '1.0' : fatigueZone === 'bearing' ? '0.92' : fatigueZone === 'hub' ? '0.78' : '0.08';
          const flex = blade ? 'transformed.z += pow(clamp(length(position.xy) / 71.0, 0.0, 1.0), 2.0) * bladeFlex * 71.0;' : '';
          shader.vertexShader = 'uniform float bladeFlex;\nvarying float vDelWeight;\n' + shader.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>\n${flex}\nvDelWeight = ${weight};`);
          shader.fragmentShader = 'uniform float delEnabled;\nuniform float inspectionEnabled;\nuniform float inspectionFocus;\nvarying float vDelWeight;\n' + shader.fragmentShader
            .replace('#include <color_fragment>', `#include <color_fragment>
              if (delEnabled > 0.5) {
                vec3 delCool = vec3(0.36, 0.55, 0.62);
                vec3 delHot = mix(vec3(1.0, 0.33, 0.025), vec3(0.92, 0.008, 0.018), smoothstep(0.35, 0.95, vDelWeight));
                diffuseColor.rgb = mix(delCool, delHot, smoothstep(0.08, 0.45, vDelWeight));
              }
              if (inspectionEnabled > 0.5) {
                float inspectionWeight = (1.0 - step(0.5, abs(inspectionFocus - ${category}.0))) * ${category === 0 ? '0.9' : 'vDelWeight'};
                diffuseColor.rgb = mix(vec3(0.36, 0.55, 0.62), vec3(1.0, 0.48, 0.045), inspectionWeight);
              }`)
            .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += delEnabled * pow(vDelWeight, 2.0) * vec3(0.35, 0.003, 0.004);');
        };
        material.customProgramCacheKey = () => `blender-flex-fatigue-inspection-v3:${blade}:${fatigueZone}:${shell}`;
      }
      return materialCopies.get(key);
    };
    object.material = Array.isArray(object.material) ? object.material.map(copyMaterial) : copyMaterial(object.material);
  });
  const allTracks = gltf.animations.flatMap(clip => clip.tracks);
  const animated = new Set(allTracks.map(track => track.name.slice(0, track.name.lastIndexOf('.'))));
  const batches = new Map();
  model.traverse(object => {
    if (!object.isMesh || object === tower || object === nacelle || object.name.startsWith('ANIMATED_red') || object.children.length || Array.isArray(object.material) || animated.has(object.name)) return;
    const attributes = Object.entries(object.geometry.attributes).sort(([a],[b])=>a.localeCompare(b)).map(([name,attribute])=>`${name}:${attribute.itemSize}:${attribute.array.constructor.name}:${attribute.normalized}`).join('|');
    const key = object.parent.uuid + object.material.uuid + attributes + Boolean(object.geometry.index);
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key).push(object);
  });
  for (const objects of batches.values()) {
    if (objects.length < 2) continue;
    const geometries = objects.map(object => object.geometry.clone().applyMatrix4(object.matrix));
    const geometry = mergeGeometries(geometries, false);
    geometries.forEach(item => item.dispose());
    if (!geometry) continue;
    ownedGeometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, objects[0].material);
    mesh.name = 'WEB_static_details';mesh.castShadow = true;mesh.receiveShadow = true;
    objects[0].parent.add(mesh);objects.forEach(object => object.removeFromParent());
  }
  const pitchTracks = [...new Map(allTracks.filter(track => !track.name.startsWith(ROTOR_NAME + '.')).map(track => [track.name, track])).values()];
  const pitchClip = new THREE.AnimationClip('Blender pitch', -1, pitchTracks);
  const mixer = new THREE.AnimationMixer(model);
  const pitchAction = mixer.clipAction(pitchClip).play();
  pitchAction.setLoop(THREE.LoopOnce, 1);pitchAction.clampWhenFinished = true;
  // Calibrate the original eased keyframes against the requested pitch angle.
  // A linear time fraction would not reproduce the angle shown on the dashboard.
  const referenceTrack = pitchTracks.find(track => track.name === 'pala_1_70m_separada_0_grados_escala_precisa.quaternion');
  if (!referenceTrack) throw new Error('Falta la animación de pitch de la pala de referencia.');
  const interpolant = referenceTrack.createInterpolant(new Float32Array(4));
  const referencePose = new THREE.Quaternion().fromArray(interpolant.evaluate(0)).normalize();
  const samplePose = new THREE.Quaternion();
  const samples = Array.from({ length: 241 }, (_, index) => {
    const time = pitchClip.duration * index / 240;
    const degrees = THREE.MathUtils.radToDeg(referencePose.angleTo(samplePose.fromArray(interpolant.evaluate(time)).normalize()));
    return { time, degrees };
  });
  const maxPitchSample = samples.reduce((maximum, sample) => sample.degrees > maximum.degrees ? sample : maximum);
  const ascending = samples.filter(sample => sample.time <= maxPitchSample.time);
  function timeForPitch(degrees) {
    const target = Math.min(degrees, maxPitchSample.degrees);
    const index = ascending.findIndex(sample => sample.degrees >= target);
    if (index <= 0) return ascending[0].time;
    const before = ascending[index-1], after = ascending[index];
    return THREE.MathUtils.lerp(before.time, after.time, (target-before.degrees)/Math.max(after.degrees-before.degrees, .00001));
  }
  const rotorBase = rotor.quaternion.clone();
  const axis = new THREE.Vector3(0, 0, -1);
  const spin = new THREE.Quaternion();
  let currentSpeed = 0, angle = 0, currentPitch = 0, elapsed = 0;
  const beacon = model.getObjectByName('ANIMATED_red_beacon_soft_halo');
  const bladeDirections = [1,2,3].map(index => {
    const object = model.getObjectByName(`pala_${index}_70m_separada_${(index-1)*120}_grados_escala_precisa`);
    return object ? rotor.worldToLocal(new THREE.Box3().setFromObject(object).getCenter(new THREE.Vector3())).normalize() : new THREE.Vector3(1,0,0);
  });
  return {
    model, rotor, yaw, hub, nacelleCenter, nacelleSize, bladeDirections,
    update(delta, { rpm = 0, pitchAngleDeg = 0, yawMisalignmentDeg = 0, bladeRootFlexDeg = 0, power = .45 } = {}) {
      const dt = Math.min(Math.max(delta, 0), .1);
      elapsed += dt;
      if (beacon?.material?.emissive) beacon.material.emissiveIntensity = .5 + (.55 + Math.sin(elapsed * 3.4) * .45) * (.9 + power);
      const follow = 1 - Math.pow(.04, dt);
      currentSpeed = THREE.MathUtils.lerp(currentSpeed, THREE.MathUtils.clamp(rpm / 60 * Math.PI * 2 * 1.65, 0, 1.95), follow);
      angle = (angle + currentSpeed * dt) % (Math.PI * 2);
      currentPitch = THREE.MathUtils.lerp(currentPitch, THREE.MathUtils.clamp(pitchAngleDeg, 0, 90), follow);
      bladeFlexUniform.value = THREE.MathUtils.degToRad(bladeRootFlexDeg) * .16;
      mixer.setTime(timeForPitch(currentPitch));
      spin.setFromAxisAngle(axis, angle);
      rotor.quaternion.copy(rotorBase).multiply(spin);
      const targetYaw = THREE.MathUtils.degToRad(THREE.MathUtils.clamp(yawMisalignmentDeg, -30, 30));
      yaw.rotation.y = THREE.MathUtils.lerp(yaw.rotation.y, targetYaw, follow);
    },
    setAnalysis(enabled) {
      nacelleMaterials.forEach(material => {
        material.transparent = enabled;material.opacity = enabled ? .16 : 1;
        material.depthWrite = !enabled;material.needsUpdate = true;
      });
    },
    setFatigueMap(enabled) { fatigueUniform.value = enabled ? 1 : 0; },
    setInspectionMap(view) { inspectionUniform.value = view?.startsWith('predictivo') ? 1 : 0;inspectionFocus.value = view === 'predictivo-palas' ? 1 : view === 'predictivo-base' ? 2 : 0; },
    diagnostics() { return { speed: currentSpeed, angle, pitch: currentPitch, maxSourcePitch: maxPitchSample.degrees, yaw: yaw.rotation.y, meshes: [...ownedMaterials].length }; },
    dispose() {
      mixer.stopAllAction();mixer.uncacheRoot(model);
      ownedGeometries.forEach(geometry => geometry.dispose());
      ownedMaterials.forEach(material => material.dispose());
    },
  };
}
