import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {loadBlenderSea} from './blenderSea.js';

const asset=name=>new URL(name,import.meta.url).href;
const loader=new GLTFLoader();
// Geometry and original timeline from Blender, not procedural replacement waves.
export function addSeaSurface(scene,{height,seabed=height-58}){
 const group=new THREE.Group();group.name='ENTORNO_BLENDER_MAR_075';group.position.y=height;
 group.material={uniforms:{opacity:{value:.96}}};scene.add(group);
 const state={ready:false,seaReady:false,error:null,time:0,seaTime:0,animals:7,humpbacks:2,spermWhales:2,sharks:3,speed:.75,seabed,seaModules:169,seaCoverage:1950};
 group.userData=state;
 let ocean,mixer,sandDetail,sandCenter;const animalMaterials=new Set();let surfaceView;
 const status=document.createElement('p');status.className='environment-status environment-loading';status.setAttribute('role','status');status.textContent='Cargando mar y fauna de Blender…';document.querySelector('#stage').append(status);
 group.ready=(async()=>{
  ocean=await loadBlenderSea({baseUrl:new URL('./',import.meta.url).href,scale:1,height:0});
  group.add(ocean);state.seaReady=true;
  status.className='environment-status';status.textContent='Cargando fauna y fondo de Blender...';
  const [animals,sand]=await Promise.all([loader.loadAsync(asset('fauna.glb')),loader.loadAsync(asset('arena.glb'))]);
  animals.scene.name='FAUNA_BLENDER_2_JOROBADAS_2_CACHALOTES_3_TIBURONES';group.add(animals.scene);
  animals.scene.traverse(o=>{if(o.isMesh)for(const material of [o.material].flat())animalMaterials.add(material);});
  surfaceView=undefined;
  mixer=new THREE.AnimationMixer(animals.scene);
  for(const clip of animals.animations)mixer.clipAction(clip).play();
  if(!animals.animations.length)throw Error('La fauna exportada no contiene animación.');
  mixer.update(0); // Apply the first swimming pose even when motion is reduced/paused.
  sand.scene.updateMatrixWorld(true);
  const tile=sand.scene.getObjectByName('ARENA_MODULO_WEB');
  if(!tile?.isMesh)throw Error('Falta el módulo de arena.');
  sand.scene.traverse(o=>{if(o.isMesh){o.material.map=null;o.material.color.set('#b9aa86');o.material.roughness=.95;o.material.metalness=0;o.material.needsUpdate=true;}});
  const continuation=sand.scene.getObjectByName('ARENA_CONTINUIDAD_WEB');
  if(continuation?.isMesh){
   continuation.geometry=continuation.geometry.clone();
   const pos=continuation.geometry.attributes.position,uv=continuation.geometry.attributes.uv;
   const extend=value=>Math.abs(value)<=48?value:Math.sign(value)*(48+(Math.abs(value)-48)*(800-48)/(300-48));
   for(let i=0;i<pos.count;i++){
    const x=extend(pos.getX(i)),z=extend(pos.getZ(i));pos.setX(i,x);pos.setZ(i,z);
    if(uv)uv.setXY(i,x/16,1+z/6);
   }
   pos.needsUpdate=true;if(uv)uv.needsUpdate=true;continuation.geometry.computeBoundingBox();continuation.geometry.computeBoundingSphere();
  }
  const instances=new THREE.InstancedMesh(tile.geometry,tile.material,96);instances.name='ARENA_96_MODULOS_16x6_METROS';
  const translation=new THREE.Matrix4();let index=0;
  for(let x=0;x<6;x++)for(let y=0;y<16;y++){
   translation.makeTranslation(x*16,0,-y*6);
   instances.setMatrixAt(index++,translation.clone().multiply(tile.matrixWorld));
  }
  instances.position.y=seabed-height+58;sand.scene.position.y=seabed-height+58;
  instances.computeBoundingSphere();group.add(instances);tile.removeFromParent();group.add(sand.scene);
  const centerGeometry=new THREE.PlaneGeometry(96,96);centerGeometry.rotateX(-Math.PI/2);
  const centerUV=centerGeometry.attributes.uv,centerPosition=centerGeometry.attributes.position;
  for(let i=0;i<centerUV.count;i++)centerUV.setXY(i,centerPosition.getX(i)/16,1+centerPosition.getZ(i)/6);
  centerUV.needsUpdate=true;
  sandCenter=new THREE.Mesh(centerGeometry,continuation.material);sandCenter.name='ARENA_CONTINUA_ZONA_CENTRAL';sandCenter.position.y=seabed-height;
  group.add(sandCenter);sandDetail=instances;sandDetail.visible=false;
  state.ready=true;status.remove();group.update(0,false);
 })().catch(error=>{state.error=error.message;status.className='environment-status';status.textContent='No se pudo cargar el entorno de Blender. Recarga la vista para volver a intentarlo.';console.error(error);});
 group.update=(dt,playing=true,cameraPosition)=>{
  if(!state.seaReady)return;
  const above=!!cameraPosition&&cameraPosition.y>=height;
  if(above!==surfaceView){
   surfaceView=above;
   // Match the approved surface; retain the previous underwater transparency.
   const opacity=above?.96:.6;
   ocean.traverse(mesh=>{if(mesh.isMesh){mesh.material.opacity=opacity;mesh.material.depthWrite=above;}});
   group.material.uniforms.opacity.value=opacity;state.surfaceOpacity=opacity;
   for(const material of animalMaterials){material.fog=!above;material.needsUpdate=true;}
  }
  const detailedSand=!!cameraPosition&&Math.hypot(cameraPosition.x,cameraPosition.z)<140;
  if(sandDetail)sandDetail.visible=detailedSand;
  if(sandCenter)sandCenter.position.y=seabed-height-(detailedSand?.36:0);
  state.sandDetail=detailedSand?'geometry':'normal-map';
  if(playing){state.time+=dt;mixer?.update(dt);}
  ocean.update(dt,playing,cameraPosition);
  state.seaTime=ocean.userData.seaTime;
  state.fullDetailModules=ocean.userData.fullDetailModules;

 };
 return group;
}
