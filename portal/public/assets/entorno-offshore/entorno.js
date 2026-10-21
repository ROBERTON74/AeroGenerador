import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const asset=name=>new URL(name,import.meta.url).href;
const loader=new GLTFLoader();
function distantGeometry(source){
 const uv=source.attributes.uv,position=source.attributes.position;
 const us=[...new Set(Array.from({length:uv.count},(_,i)=>uv.getX(i)))].sort((a,b)=>a-b);
 const vs=[...new Set(Array.from({length:uv.count},(_,i)=>uv.getY(i)))].sort((a,b)=>a-b);
 const lookup=new Map();for(let i=0;i<uv.count;i++)lookup.set(uv.getX(i)+':'+uv.getY(i),i);
 const sample=values=>values.filter((_,i)=>i%4===0||i===values.length-1);
 const u=sample(us),v=sample(vs),mapping=[],points=[],coords=[],indices=[];
 for(const y of v)for(const x of u){
  const index=lookup.get(x+':'+y);if(index===undefined)throw Error('La cuadrícula lejana del agua está incompleta.');
  mapping.push(index);points.push(position.getX(index),position.getY(index),position.getZ(index));coords.push(x,y);
 }
 for(let y=0;y<v.length-1;y++)for(let x=0;x<u.length-1;x++){
  const a=y*u.length+x,b=a+1,c=a+u.length,d=c+1;indices.push(a,b,d,a,d,c);
 }
 const geometry=new THREE.BufferGeometry();geometry.setIndex(indices);
 geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3).setUsage(THREE.DynamicDrawUsage));
 geometry.setAttribute('uv',new THREE.Float32BufferAttribute(coords,2));geometry.computeVertexNormals();
 return {geometry,mapping};
}
const half=new Float32Array(65536);
for(let i=0;i<65536;i++){
 const s=i&32768?-1:1,e=(i>>10)&31,m=i&1023;
 half[i]=s*(e===0?2**-14*m/1024:e===31?(m?NaN:Infinity):2**(e-15)*(1+m/1024));
}
async function motionFile(name){
 const response=await fetch(asset(name));
 if(!response.ok)throw Error(`No se pudo cargar ${name}`);
 const bytes=await response.arrayBuffer();const header=new Uint8Array(bytes,0,Math.min(bytes.byteLength,2));
 // Vite may serve .gz with Content-Encoding:gzip, which fetch already decodes.
 if(header[0]!==0x1f||header[1]!==0x8b)return new Uint16Array(bytes);
 if(!globalThis.DecompressionStream)throw Error('El navegador no admite los datos comprimidos del mar.');
 return new Uint16Array(await new Response(new Response(bytes).body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
}

// Geometry and original timeline from Blender, not procedural replacement waves.
export function addSeaSurface(scene,{height,seabed=height-58}){
 const group=new THREE.Group();group.name='ENTORNO_BLENDER_MAR_075';group.position.y=height;
 group.material={uniforms:{opacity:{value:.6}}};scene.add(group);
 const state={ready:false,error:null,time:0,seaTime:0,animals:7,humpbacks:2,spermWhales:2,sharks:3,speed:.75,seabed,seaModules:81,seaCoverage:1350};
 group.userData=state;
 let mixer,sandDetail,sandCenter;const motions=[];const animalMaterials=new Set();const cache=new Map();let lodKey='',surfaceView;
 let lastSample=-1;
 const status=document.createElement('p');status.className='environment-status';status.setAttribute('role','status');status.textContent='Cargando mar y fauna de Blender…';document.querySelector('#stage').append(status);
 group.ready=(async()=>{
  const response=await fetch(asset('mar_animacion.json'));if(!response.ok)throw Error('No se pudo cargar el clip del mar.');
  const meta=await response.json();
  const water=await loader.loadAsync(asset(meta.static));
  water.scene.updateMatrixWorld(true);
  const ocean=new THREE.Group();ocean.name='MAR_BLENDER_CONTINUIDAD_1350m';group.add(ocean);
  for(const row of meta.meshes){
   const mesh=water.scene.getObjectByName(row.name);
   if(!mesh?.isMesh)throw Error('Falta una malla del clip del mar: '+row.name);
   if(!cache.has(row.file))cache.set(row.file,motionFile(row.file));
   const values=await cache.get(row.file);
   if(values.length!==row.targets*row.vertices*3)throw Error('Datos incompletos del oleaje.');
   const attr=mesh.geometry.attributes.position;
   attr.setUsage(THREE.DynamicDrawUsage);
   const distant=distantGeometry(mesh.geometry);
   mesh.material.depthWrite=false;mesh.material.side=THREE.DoubleSide;
   mesh.material.color.set('#4d8295');mesh.material.roughness=.38;mesh.material.metalness=.08;
   const close=new THREE.InstancedMesh(mesh.geometry,mesh.material,18);
   const far=new THREE.InstancedMesh(distant.geometry,mesh.material,81);
   close.name='MAR_DETALLE_'+row.name;far.name='MAR_LEJANO_'+row.name;
   close.frustumCulled=false;far.frustumCulled=false;
   motions.push({row,values,base:attr.array.slice(),attr,geometry:mesh.geometry,distant,close,far,matrix:mesh.matrixWorld.clone()});
   ocean.add(close,far);
  }
  const [animals,sand]=await Promise.all([loader.loadAsync(asset('fauna.glb')),loader.loadAsync(asset('arena.glb'))]);
  animals.scene.name='FAUNA_BLENDER_2_JOROBADAS_2_CACHALOTES_3_TIBURONES';group.add(animals.scene);
  animals.scene.traverse(o=>{if(o.isMesh)for(const material of [o.material].flat())animalMaterials.add(material);});
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
 })().catch(error=>{state.error=error.message;status.textContent='No se pudo cargar el entorno de Blender. Recarga la vista para volver a intentarlo.';console.error(error);});
 group.update=(dt,playing=true,cameraPosition)=>{
  if(!state.ready)return;
  const above=!!cameraPosition&&cameraPosition.y>=height;
  if(above!==surfaceView){
   surfaceView=above;
   // A clear surface view reveals the submerged animals at their original depth.
   const opacity=above?.26:.6;
   for(const m of motions)m.close.material.opacity=opacity;
   group.material.uniforms.opacity.value=opacity;state.surfaceOpacity=opacity;
   for(const material of animalMaterials){material.fog=!above;material.needsUpdate=true;}
  }
  const detailedSand=!!cameraPosition&&Math.hypot(cameraPosition.x,cameraPosition.z)<140;
  sandDetail.visible=detailedSand;sandCenter.position.y=seabed-height-(detailedSand?.36:0);
  state.sandDetail=detailedSand?'geometry':'normal-map';
  const cx=cameraPosition?THREE.MathUtils.clamp(Math.round(cameraPosition.x/150),-4,4):0;
  const cz=cameraPosition?THREE.MathUtils.clamp(Math.round(cameraPosition.z/150),-4,4):0;
  const key=cx+':'+cz;
  if(key!==lodKey){
   lodKey=key;const translation=new THREE.Matrix4();
   for(const m of motions){
    let near=0,far=0;
    for(let x=-4;x<=4;x++)for(let z=-4;z<=4;z++){
     translation.makeTranslation(x*150,0,z*150);const matrix=translation.clone().multiply(m.matrix);
     const fullDetail=(Math.abs(x)<=1&&Math.abs(z)<=1)||(Math.abs(x-cx)<=1&&Math.abs(z-cz)<=1);
     if(fullDetail)m.close.setMatrixAt(near++,matrix);else m.far.setMatrixAt(far++,matrix);
    }
    m.close.count=near;m.far.count=far;m.close.instanceMatrix.needsUpdate=true;m.far.instanceMatrix.needsUpdate=true;state.fullDetailModules=near;
   }
  }
  if(playing){state.time+=dt;state.seaTime+=dt*.75;mixer.update(dt);}
  const sample=Math.floor(state.seaTime*48);
  if(sample===lastSample)return;lastSample=sample;
  for(const m of motions){
   const {row,values,base,attr,geometry}=m;
   const times=row.times,duration=times.at(-1)-times[0];
   const t=(state.seaTime%duration)+times[0];
   let low=0,high=times.length-1;
   while(low+1<high){const mid=(low+high)>>1;if(times[mid]<=t)low=mid;else high=mid;}
   const mix=(t-times[low])/(times[high]-times[low]);
   const weights=new Map();
   for(const [i,w] of row.weights[low])weights.set(i,(weights.get(i)||0)+w*(1-mix));
   for(const [i,w] of row.weights[high])weights.set(i,(weights.get(i)||0)+w*mix);
   attr.array.set(base);
   for(const [target,weight] of weights){
    if(Math.abs(weight)<1e-7)continue;
    const offset=target*base.length;
    for(let i=0;i<base.length;i++)attr.array[i]+=half[values[offset+i]]*weight;
   }
   attr.needsUpdate=true;geometry.computeVertexNormals();
   const distant=m.distant,position=distant.geometry.attributes.position,normal=distant.geometry.attributes.normal;
   for(let i=0;i<distant.mapping.length;i++){
    const index=distant.mapping[i];position.setXYZ(i,attr.getX(index),attr.getY(index),attr.getZ(index));
    const n=geometry.attributes.normal;normal.setXYZ(i,n.getX(index),n.getY(index),n.getZ(index));
   }
   position.needsUpdate=true;normal.needsUpdate=true;
  }
 };
 return group;
}
