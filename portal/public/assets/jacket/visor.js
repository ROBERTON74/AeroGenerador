import {addSeaSurface} from './mar.js';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from './RoomEnvironment.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const stage=document.querySelector('#stage'),loading=document.querySelector('#loading');
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}
catch(e){loading.textContent='No se ha podido iniciar WebGL. Puedes abrir el render de Blender desde el enlace lateral.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;stage.appendChild(renderer.domElement);
const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,3000);
const pmrem=new THREE.PMREMGenerator(renderer);
const room=new RoomEnvironment();const studio=pmrem.fromScene(room,.04);scene.environment=studio.texture;scene.environmentIntensity=.7;room.dispose();pmrem.dispose();
scene.background=new THREE.Color('#9fbdcc');scene.fog=new THREE.FogExp2('#9fbdcc',.0008);
const seaSurface=addSeaSurface(scene,{height:45,size:180,seabed:-49.975});
const orbit=new OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.minDistance=12;orbit.maxDistance=1300;
scene.add(new THREE.HemisphereLight(0xe4f1ff,0x66757b,1.2));
const sun=new THREE.DirectionalLight(0xfff3dc,1.8);sun.position.set(150,180,160);scene.add(sun);
const fill=new THREE.DirectionalLight(0xb8d8eb,.8);fill.position.set(-100,70,-150);scene.add(fill);
let root,spin,baseQuaternion,fullBox,platform,ring,rotor,selectedView=({mar:'marine',submarina:'underwater',plataforma:'platform',rotor:'rotor',conjunto:'general'})[new URLSearchParams(location.search).get('vista')]||'general';
let playing=!matchMedia('(prefers-reduced-motion: reduce)').matches,speed=1,angle=0,parentVisible=true,last=performance.now();
const axis=new THREE.Vector3(0,0,-1),turn=new THREE.Quaternion();
function setPlaying(value){playing=value;document.querySelector('#play').textContent=value?'Pausar animación':'Reanudar animación';document.querySelector('#play').setAttribute('aria-pressed',String(value));}
setPlaying(playing);
function fit(name='general'){
 if(!root)return;selectedView=name;
 if(name==='general'){
  const h=seaSurface.position.y;
  const center=fullBox.getCenter(new THREE.Vector3()),size=fullBox.getSize(new THREE.Vector3());
  const targetY=h+16,tangent=Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
  const vertical=Math.max(fullBox.max.y-targetY,targetY-fullBox.min.y);
  const distance=Math.max(vertical/tangent,size.x/(2*tangent*camera.aspect))*1.08+size.z/2;
  orbit.target.set(center.x,targetY,center.z);
  camera.position.set(center.x,h+7,center.z+distance);
  orbit.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));return;
 }
 if(name==='marine'||name==='underwater'){
  const h=seaSurface.position.y;
  if(name==='underwater'){
   const distance=Math.max(180,82/(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
   orbit.target.set(0,h-32,58);camera.position.set(15,h-23,58+distance);
  }else{
   const factor=Math.max(1,1.1/camera.aspect);
   orbit.target.set(0,h-8,58);camera.position.set(190*factor,h+100*factor,58+212*factor);
  }
  orbit.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));return;
 }
 const box=name==='platform'?new THREE.Box3().setFromObject(platform):name==='ring'?new THREE.Box3().setFromObject(ring):name==='rotor'?new THREE.Box3().setFromObject(rotor):fullBox;
 const center=box.getCenter(new THREE.Vector3()),size=box.getSize(new THREE.Vector3());
 const radius=size.length()/2;
 const halfFov=Math.min(THREE.MathUtils.degToRad(camera.fov/2),Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
 const distance=radius/Math.sin(halfFov)*1.06;
 orbit.target.copy(center);camera.position.copy(center).addScaledVector(new THREE.Vector3(1,.3,2.4).normalize(),distance);orbit.update();
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));
}
function resize(){camera.aspect=stage.clientWidth/stage.clientHeight;camera.updateProjectionMatrix();renderer.setSize(stage.clientWidth,stage.clientHeight);fit(selectedView);}
new ResizeObserver(resize).observe(stage);resize();
new GLTFLoader().load('./jacket.glb',gltf=>{
 root=gltf.scene;spin=root.getObjectByName('JACKET_ROTOR_ANIMADO_12_RPM');platform=root.getObjectByName('JACKET_CELOSIA_AMARILLA');ring=root.getObjectByName('JACKET_PILOTES_OSCUROS');rotor=spin?.children.find(o=>o.name.startsWith('ROTOR_3_PALAS_ESCALA_PRECISA_EJE_Y'));
 if(!spin||!platform||!ring||!rotor){loading.textContent='El modelo no contiene el conjunto esperado.';return;}
 baseQuaternion=spin.quaternion.clone();root.updateMatrixWorld(true);
 // Batch only static siblings with compatible attributes; preserve the rotor hierarchy.
 const batches=new Map();root.traverse(o=>{
  if(!o.isMesh||Array.isArray(o.material)||o.children.length)return;
  const attrs=Object.entries(o.geometry.attributes).sort(([a],[b])=>a.localeCompare(b)).map(([k,a])=>`${k}:${a.itemSize}:${a.normalized}:${a.array.constructor.name}`).join('|');
  const key=o.parent.uuid+':'+o.material.uuid+':'+attrs+':'+Boolean(o.geometry.index);
  if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);
 });
 for(const objects of batches.values()){
  if(objects.length<2)continue;
  const geometries=objects.map(o=>o.geometry.clone().applyMatrix4(o.matrix));const geometry=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());
  if(!geometry)continue;
  const mesh=new THREE.Mesh(geometry,objects[0].material);mesh.name='OFFSHORE_detalles_agrupados';objects[0].parent.add(mesh);objects.forEach(o=>o.removeFromParent());
 }
 root.traverse(o=>{if(o.isMesh){for(const mat of(Array.isArray(o.material)?o.material:[o.material])){mat.fog=false;mat.roughness=Math.max(mat.roughness??.4,.25);mat.metalness=Math.min(mat.metalness??0,.88);}}});
 scene.add(root);root.updateMatrixWorld(true);fullBox=new THREE.Box3().setFromObject(root);fit(selectedView);
 loading.hidden=true;stage.dataset.loaded='true';document.querySelector('#controls').disabled=false;
 // Read-only diagnostics for verifying animation and rendering.
 window.offshoreViewer={get environment(){return {...seaSurface.userData};},get seaSample(){return seaSurface.userData.seaTime;},get waterline(){return seaSurface.position.y;},get seaOpacity(){return seaSurface.material.uniforms.opacity.value;},get angle(){return angle;},get playing(){return playing;},get quaternion(){return spin.quaternion.toArray();},get calls(){return renderer.info.render.calls;},get visible(){return parentVisible&&!document.hidden;},get textureMaterials(){let n=0;root.traverse(o=>{if(o.isMesh){for(const m of(Array.isArray(o.material)?o.material:[o.material]))if(m.normalMap&&m.roughnessMap)n++;}});return n;},get selectedView(){return selectedView;},get definition(){return document.querySelector('#quality').value;}};
},e=>{if(e.total)loading.textContent=`Cargando el modelo 3D… ${Math.round(e.loaded/e.total*100)} %`;},()=>{loading.textContent='No se ha podido cargar el modelo. Puedes abrir el render de Blender desde el enlace lateral.';});
document.querySelector('#quality').onchange=e=>{renderer.setPixelRatio(e.target.value==='high'?Math.min(devicePixelRatio,2):1);resize();};
document.querySelector('#play').onclick=()=>setPlaying(!playing);
document.querySelector('#speed').onchange=e=>speed=Number(e.target.value);
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>fit(b.dataset.view));document.querySelector('#reset').onclick=()=>fit();
stage.addEventListener('keydown',e=>{
 if(e.target!==stage)return;
 if(e.code==='Space'){e.preventDefault();setPlaying(!playing);}
 if(e.key==='Home'){e.preventDefault();fit();}
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-'].includes(e.key)){
  e.preventDefault();const offset=camera.position.clone().sub(orbit.target);
  if(e.key==='ArrowLeft'||e.key==='ArrowRight')offset.applyAxisAngle(new THREE.Vector3(0,1,0),e.key==='ArrowLeft'?.12:-.12);
  if(e.key==='ArrowUp'||e.key==='ArrowDown')offset.y+=e.key==='ArrowUp'?8:-8;
  if(e.key==='+'||e.key==='-')offset.multiplyScalar(e.key==='+'?.9:1.1);
  camera.position.copy(orbit.target).add(offset);orbit.update();
 }
});
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();loading.hidden=false;loading.textContent='La vista 3D se ha interrumpido. Recarga la página para recuperarla.';});
window.addEventListener('message',e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='aerogenerador-visibility')parentVisible=e.data.visible===true;});
renderer.setAnimationLoop(now=>{
 const dt=Math.min((now-last)/1000,.25);last=now;
 if(document.hidden||!parentVisible)return;
 if(spin&&playing){angle=(angle+dt*speed*12*2*Math.PI/60)%(2*Math.PI);spin.quaternion.copy(baseQuaternion).multiply(turn.setFromAxisAngle(axis,angle));stage.dataset.angle=String(angle);}
 seaSurface.update(dt,playing,camera.position);
 const submerged=camera.position.y<seaSurface.position.y;
 scene.background.set(submerged?'#346b80':'#9fbdcc');scene.fog.color.copy(scene.background);scene.fog.density=submerged?.003:.0018;
 orbit.update();renderer.render(scene,camera);
});
