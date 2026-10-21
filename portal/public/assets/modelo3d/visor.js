import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const stage = document.querySelector('#stage');
const loading = document.querySelector('#loading');
const controlsUI = document.querySelector('#controls');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch (error) {
  loading.textContent = 'Tu navegador no ha podido iniciar la vista 3D. Activa WebGL o prueba otro navegador.';
  throw error;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
stage.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, 0.2, 2500);
const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.minDistance = 15;
orbit.maxDistance = 650;
orbit.maxPolarAngle = Math.PI * .87;
scene.add(new THREE.HemisphereLight(0xd3edff, 0x48636a, 2.8));
const sun = new THREE.DirectionalLight(0xfff3df, 4);
sun.position.set(90, 170, 120); scene.add(sun);
const rim = new THREE.DirectionalLight(0x69d9e1, 2.6);
rim.position.set(-130, 90, -70); scene.add(rim);
const grid = new THREE.GridHelper(450, 30, 0x376c78, 0x163b49);
grid.material.transparent = true; grid.material.opacity = .45;
scene.add(grid);
const platform = new THREE.Mesh(new THREE.CylinderGeometry(18, 21, 1, 64), new THREE.MeshStandardMaterial({color:0x153947,metalness:.4,roughness:.6}));
platform.position.y = -.6; scene.add(platform);
const ring = new THREE.Mesh(new THREE.TorusGeometry(22, .11, 6, 120),new THREE.MeshBasicMaterial({color:0x32d0bd}));
ring.rotation.x = Math.PI/2;ring.position.y=.02;scene.add(ring);
let root, rotor, baseQuaternion, mixer, clip, hub, fullBox;
let mode = 'rotor', playing = !matchMedia('(prefers-reduced-motion: reduce)').matches, speed = 1, angle = 0;
let last = performance.now(), inView = true, parentVisible = true;
window.addEventListener('message',event=>{
  if(event.source!==window.parent||event.origin!==location.origin||event.data?.type!=='aerogenerador-visibility')return;
  parentVisible=event.data.visible===true;
});
const rotorAxis = new THREE.Vector3(0,0,-1); // Blender local +Y converted to glTF's Y-up coordinates.
const spinQuaternion = new THREE.Quaternion();
function setPlaying(value) {
  playing = value;
  document.querySelector('#play').textContent = playing ? 'Pausar' : 'Reanudar';
  document.querySelector('#play').setAttribute('aria-pressed', String(playing));
}
setPlaying(playing);
function fitView(name = 'general') {
  if (!root) return;
  let target, distance, direction;
  if (name === 'general') {
    target = fullBox.getCenter(new THREE.Vector3());
    const size = fullBox.getSize(new THREE.Vector3());
    // Fit both height and width, including narrow mobile viewports.
    distance = Math.max(size.y / (2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))),size.x / (2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect))*1.28;
    direction = new THREE.Vector3(1,.25,2.5).normalize();
  } else {
    target = hub.clone();
    if(name === 'nacelle') target.add(new THREE.Vector3(0,0,-7));
    distance = name === 'rotor' ? 105 : 55;
    direction = name === 'rotor' ? new THREE.Vector3(.6,.15,2.5).normalize() : new THREE.Vector3(2,.6,-1.3).normalize();
  }
  orbit.target.copy(target);camera.position.copy(target).addScaledVector(direction,distance);orbit.update();
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
}
function resize() {
  camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();
  renderer.setSize(stage.clientWidth,stage.clientHeight);
}
new ResizeObserver(resize).observe(stage); resize();
const poses = [];
new GLTFLoader().load('./aerogenerador.glb', gltf=>{
  root=gltf.scene;
  // Merge only compatible static siblings, retaining the rig and animated nodes.
  const animatedNames=new Set(gltf.animations.flatMap(a=>a.tracks.map(t=>t.name.slice(0,t.name.lastIndexOf('.')))));
  const batches=new Map();
  root.updateMatrixWorld(true);
  root.traverse(o=>{
    if(!o.isMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.children.length||animatedNames.has(o.name)||Object.keys(o.geometry.morphAttributes).length)return;
    const attributes=Object.entries(o.geometry.attributes).sort(([a],[b])=>a.localeCompare(b)).map(([name,attribute])=>`${name}:${attribute.itemSize}:${attribute.normalized}:${attribute.array.constructor.name}`).join('|');
    const key=o.parent.uuid+':'+o.material.uuid+':'+attributes+':'+Boolean(o.geometry.index);
    if(!batches.has(key))batches.set(key,[]);
    batches.get(key).push(o);
  });
  for(const objects of batches.values()){
    if(objects.length<2)continue;
    const geometries=objects.map(o=>o.geometry.clone().applyMatrix4(o.matrix));
    const merged=mergeGeometries(geometries,false);
    geometries.forEach(g=>g.dispose());
    if(!merged)continue;
    const mesh=new THREE.Mesh(merged,objects[0].material);
    mesh.name='web_static_batch';objects[0].parent.add(mesh);
    objects.forEach(o=>o.removeFromParent());
  }
  const box=new THREE.Box3().setFromObject(root);
  const center=box.getCenter(new THREE.Vector3());
  root.position.add(new THREE.Vector3(-center.x,-box.min.y,-center.z));
  scene.add(root);root.updateMatrixWorld(true);
  fullBox=new THREE.Box3().setFromObject(root);
  rotor=root.getObjectByName('ROTOR_3_PALAS_ESCALA_PRECISA_EJE_Y');
  if(!rotor) throw new Error('No se encuentra el rig del rotor exportado.');
  baseQuaternion=rotor.quaternion.clone(); hub=rotor.getWorldPosition(new THREE.Vector3());
  root.traverse(o=>{
    poses.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]);
    if(o.isMesh) {
      const materials=Array.isArray(o.material)?o.material:[o.material];
      for(const m of materials) if(m.isMeshStandardMaterial) { m.roughness=Math.max(m.roughness,.28);m.metalness=Math.min(m.metalness,.7); }
    }
  });
  mixer=new THREE.AnimationMixer(root);
  const tracks=new Map(gltf.animations.flatMap(a=>a.tracks).map(t=>[t.name,t]));
  if(!tracks.size) throw new Error('No se encuentra la animación de pitch de Blender.');
  clip=new THREE.AnimationClip('Pitch Blender',-1,[...tracks.values()]);
  document.querySelector('[data-mode=pitch]').title=`Animación original: ${clip.duration.toFixed(2)} segundos`;
  controlsUI.disabled=false;loading.hidden=true;stage.dataset.loaded='true';
  fitView();
}, progress=>{
  if(progress.total) loading.textContent=`Cargando el aerogenerador… ${Math.round(progress.loaded/progress.total*100)} %`;
}, error=>{
  console.error(error);loading.textContent='No se ha podido cargar el modelo. Recarga la página para intentarlo de nuevo.';
});
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
  mode=button.dataset.mode;angle=0;
  mixer.stopAllAction();
  poses.forEach(([o,p,q,s])=>{o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s)});
  if(mode==='pitch') mixer.clipAction(clip).reset().play();
  document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelector('#motion-label').textContent=mode==='pitch'?'Pitch original de Blender':'Giro ilustrativo sobre el rig original';
  document.querySelector('#motion-description').textContent=mode==='pitch'?'Reproduce los fotogramas exportados de Blender: variación del ángulo de las palas sobre su propio eje.':'El rotor gira sobre el eje del modelo de Blender. Puedes pausar el movimiento para observar sus uniones.';
}));
document.querySelector('#play').addEventListener('click',()=>setPlaying(!playing));
document.querySelector('#speed').addEventListener('change',e=>speed=Number(e.target.value));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>fitView(b.dataset.view)));
document.querySelector('#reset').addEventListener('click',()=>fitView());
// Keyboard camera controls supplement pointer and touch controls.
stage.addEventListener('keydown',e=>{
  if(e.target!==stage) return;
  if(e.code==='Space'){e.preventDefault();setPlaying(!playing)}
  if(e.key==='Home'){e.preventDefault();fitView()}
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){
    e.preventDefault();const offset=camera.position.clone().sub(orbit.target);
    if(e.key==='ArrowLeft'||e.key==='ArrowRight') offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.12:-.12);
    if(e.key==='ArrowUp'||e.key==='ArrowDown') offset.y+=e.key==='ArrowUp'?8:-8;
    if(e.key==='+'||e.key==='-') offset.multiplyScalar(e.key==='+'?.9:1.1);
    camera.position.copy(orbit.target).add(offset);orbit.update();
  }
});
new IntersectionObserver(entries=>{inView=entries[0].isIntersecting},{threshold:0}).observe(stage);
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();loading.hidden=false;loading.textContent='La vista 3D se ha interrumpido. Recarga la página para recuperarla.';});
renderer.setAnimationLoop(now=>{
  const dt=Math.min((now-last)/1000,.05);last=now;
  if(document.hidden||!inView||!parentVisible) return;
  if(root&&playing){
    if(mode==='pitch') mixer.update(dt*speed);
    else {angle=(angle+dt*speed*Math.PI*.4)%(Math.PI*2);spinQuaternion.setFromAxisAngle(rotorAxis,angle);rotor.quaternion.copy(baseQuaternion).multiply(spinQuaternion);}
  }
  orbit.update();renderer.render(scene,camera);
});
