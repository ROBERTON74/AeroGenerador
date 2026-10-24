// Executes the installed viewers with real GLTF geometry and animations.
// Renderer/DOM stand-ins validate controls and loading, not visual appearance.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as geometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
const portal=path.resolve('portal/public');
const output=path.resolve('respaldos/revision_movil_2026-10-24');
await fs.mkdir(output,{recursive:true});
assert.equal(await fs.readFile(path.join(portal,'assets/entorno-offshore/blenderSea.js'),'utf8'),await fs.readFile('src/components/blenderSea.js','utf8'),'The platform ocean must use the approved React implementation');
for(const name of ['mar_base.glb','mar_animacion.json','mar_movimiento_0.bin.gz','mar_movimiento_1.bin.gz','mar_movimiento_2.bin.gz'])assert.deepEqual(await fs.readFile(path.join(portal,'assets/entorno-offshore',name)),await fs.readFile(path.join('public/models/mar-blender',name)),name);
function plainGLB(buffer){
 const size=buffer.readUInt32LE(12),json=JSON.parse(buffer.subarray(20,20+size));
 for(const mesh of json.meshes??[])for(const p of mesh.primitives)delete p.material;
 delete json.materials;delete json.images;delete json.textures;delete json.samplers;
 let text=Buffer.from(JSON.stringify(json));text=Buffer.concat([text,Buffer.alloc((4-text.length%4)%4,32)]);
 const binary=buffer.subarray(20+size),head=Buffer.alloc(20);
 head.writeUInt32LE(0x46546c67,0);head.writeUInt32LE(2,4);head.writeUInt32LE(20+text.length+binary.length,8);head.writeUInt32LE(text.length,12);head.writeUInt32LE(0x4e4f534a,16);
 return Buffer.concat([head,text,binary]);
}
globalThis.ProgressEvent=class{constructor(type,options){this.type=type;Object.assign(this,options);}};
globalThis.self=globalThis;
globalThis.fetch=async input=>{
 const url=typeof input==='string'?input:input.url;const pathname=new URL(url).pathname;
 if(pathname.endsWith('/fauna.glb'))await new Promise(resolve=>setTimeout(resolve,120));
 let data=await fs.readFile(path.join(portal,pathname));if(pathname.endsWith('.glb'))data=plainGLB(data);
 return new Response(data,{headers:{'Content-Length':String(data.length)}});
};
const report=[];
const reducedMotion=process.argv.includes('--reduced-motion');
for(const folder of ['plataformas-offshore','plataforma-tensores','jacket']){
 const base=`http://127.0.0.1:4200/assets/${folder}/`;
 class RelativeGLTFLoader extends GLTFLoader{load(url,...args){return super.load(new URL(url,base).href,...args);}}
 const buttons=['general','platform','ring','rotor','marine','underwater'].map(view=>({dataset:{view},setAttribute(){}}));
 const keyHandlers={};
 function element(){return {dataset:{},hidden:false,disabled:false,clientWidth:1200,clientHeight:800,style:{},setAttribute(){},addEventListener(type,fn){keyHandlers[type]=fn;},append(){},appendChild(){},remove(){},value:'high'};}
 const elements=Object.fromEntries(['stage','loading','play','controls','speed','quality','reset'].map(id=>['#'+id,element()]));
 const document={hidden:false,querySelector:s=>elements[s],querySelectorAll:()=>buttons,createElement:element};
 const handlers={},window={addEventListener(type,fn){handlers[type]=fn;}};
 let renderer;
 class Renderer{
  constructor(){renderer=this;this.domElement=element();this.info={render:{calls:0}};}
  setPixelRatio(value){this.pixelRatio=value;}setClearColor(){}setSize(){}setAnimationLoop(fn){this.loop=fn;}
  render(scene,camera){this.scene=scene;this.camera=camera;scene.updateMatrixWorld(true);}
 }
 class Controls{constructor(camera){this.object=camera;this.target=new THREE.Vector3();}update(){}}
 class PMREM{fromScene(){return {texture:new THREE.Texture()};}dispose(){}}
 let resizeCallback;
 const context=vm.createContext({window,document,location:new URL(base),parent:{},console,performance,URL,URLSearchParams,fetch,Response,Request,DecompressionStream,Uint16Array,Float32Array,Map,Math,devicePixelRatio:3,matchMedia:()=>({matches:reducedMotion}),ResizeObserver:class{constructor(fn){resizeCallback=fn;}observe(){}}});
 const registry=new Map();
 async function synthetic(id,exports){
  if(registry.has(id))return registry.get(id);
  const module=new vm.SyntheticModule(Object.keys(exports),function(){for(const [key,value] of Object.entries(exports))this.setExport(key,value);},{context,identifier:id});registry.set(id,module);return module;
 }
 async function load(url){
  if(registry.has(url))return registry.get(url);
  const text=await fs.readFile(path.join(portal,new URL(url).pathname),'utf8');
  const module=new vm.SourceTextModule(text,{context,identifier:url,initializeImportMeta(meta){meta.url=url;}});registry.set(url,module);
  await module.link(async(specifier,ref)=>{
   if(specifier==='three')return synthetic('three',{...THREE,WebGLRenderer:Renderer,PMREMGenerator:PMREM});
   if(specifier.includes('GLTFLoader'))return synthetic('loader',{GLTFLoader:RelativeGLTFLoader});
   if(specifier.includes('OrbitControls'))return synthetic('orbit',{OrbitControls:Controls});
   if(specifier.includes('BufferGeometryUtils'))return synthetic('geometryUtils',geometryUtils);
   if(specifier.includes('RoomEnvironment'))return synthetic('room',{RoomEnvironment});
   return load(new URL(specifier,ref.identifier).href);
  });return module;
 }
 const script=await load(base+'visor.js');await script.evaluate();
 let now=performance.now(),seaBeforeFauna=false;
 for(let i=0;i<200;i++){
  await new Promise(r=>setTimeout(r,30));now+=40;renderer.loop(now);
  if(window.offshoreViewer?.environment.seaReady&&!window.offshoreViewer.environment.ready)seaBeforeFauna=true;
  if(window.offshoreViewer?.environment.ready)break;
 }
 const viewer=window.offshoreViewer;assert(viewer,'Platform did not load: '+folder);assert(viewer.environment.ready,JSON.stringify(viewer.environment));
 assert.equal(renderer.camera.position.y,viewer.waterline+7,'Initial camera must stay just above the water');
 assert.equal(viewer.seaOpacity,.96,'Surface must use the approved ocean opacity');
 assert.equal(viewer.environment.seaModules,169);
 const ocean=renderer.scene.getObjectByName('MAR_BLENDER_PRINCIPAL_075');assert(ocean);
 assert.equal(ocean.children.length,10);
 for(const mesh of ocean.children){assert(mesh.material.normalMap?.isDataTexture,'Fine distant wave normals must exist');assert(mesh.material.depthWrite);assert.equal(mesh.material.normalMapType,THREE.ObjectSpaceNormalMap);}
 for(const view of buttons){view.onclick();now+=40;renderer.loop(now);assert(renderer.camera.position.toArray().every(Number.isFinite));}
 elements['#reset'].onclick();
 for(const width of [320,390,430,740]){elements['#stage'].clientWidth=width;elements['#stage'].clientHeight=530;resizeCallback();now+=40;renderer.loop(now);assert.equal(renderer.pixelRatio,width<740?1.25:1.5);}

 if(folder!=='plataformas-offshore'){
  elements['#quality'].value='low';elements['#quality'].onchange();assert.equal(renderer.pixelRatio,1);
  resizeCallback();assert.equal(renderer.pixelRatio,1,'Light quality must survive a resize');
  elements['#quality'].value='high';elements['#quality'].onchange();
 }
 if(reducedMotion){assert.equal(viewer.playing,false);const pausedTime=viewer.seaSample;now+=40;renderer.loop(now);assert.equal(viewer.seaSample,pausedTime);elements['#play'].onclick();}
 const before=viewer.seaSample;now+=40;renderer.loop(now);assert(viewer.seaSample>before);
 elements['#play'].onclick();const pause=viewer.seaSample,angle=viewer.angle;
 now+=40;renderer.loop(now);assert.equal(viewer.seaSample,pause);assert.equal(viewer.angle,angle);
 buttons.find(b=>b.dataset.view==='underwater').onclick();now+=40;renderer.loop(now);
 assert.equal(renderer.camera.position.y,viewer.waterline-23);assert.equal(viewer.seaOpacity,.6);assert.equal(renderer.scene.background.getHexString(),'346b80');
 elements['#stage'].clientWidth=390;elements['#stage'].clientHeight=530;resizeCallback();now+=40;renderer.loop(now);
 assert(Math.abs(renderer.camera.aspect-390/530)<1e-6);assert(renderer.camera.position.z>300,'Mobile fauna framing is too close');
 elements['#reset'].onclick();now+=40;renderer.loop(now);
 assert(Number.isFinite(renderer.camera.position.x));
 assert.equal(renderer.camera.position.y,viewer.waterline+7,'Reset must restore the horizon framing');
 assert.equal(viewer.seaOpacity,.96);
 elements['#play'].onclick();assert(viewer.playing);
 const originalSpeed=viewer.environment.speed;elements['#speed'].onchange({target:{value:'1.5'}});assert.equal(viewer.environment.speed,originalSpeed);
 const prior=viewer.seaSample;now+=40;renderer.loop(now);assert(Math.abs(viewer.seaSample-prior-.04*.75)<1e-6);
 handlers.message({source:context.parent,origin:context.location.origin,data:{type:'aerogenerador-visibility',visible:false}});
 const frozen=viewer.seaSample;now+=40;renderer.loop(now);assert.equal(viewer.seaSample,frozen);
 handlers.message({source:context.parent,origin:context.location.origin,data:{type:'aerogenerador-visibility',visible:true}});
 now+=40;renderer.loop(now);assert(viewer.seaSample>frozen);
 document.hidden=true;const hiddenTime=viewer.seaSample;now+=40;renderer.loop(now);assert.equal(viewer.seaSample,hiddenTime);document.hidden=false;
 report.push({folder,loaded:true,environment:true,waterline:viewer.waterline,seabed:viewer.environment.seabed,sea_speed:viewer.environment.speed,pause:true,underwater_camera:true,finite_camera:true,approved_ocean:true,reduced_motion_initial:reducedMotion,sea_before_fauna:seaBeforeFauna,distant_normal_map:true,mobile_widths:[320,390,430,740],mobile_dpr:1.25,play_resume:true,visibility_pause:true,sea_speed_independent:true,visual_gpu_review:false});
 console.log(JSON.stringify(report.at(-1)));
}
await fs.writeFile(path.join(output,reducedMotion?'verificacion_movimiento_reducido.json':'verificacion_visores_sin_gpu.json'),JSON.stringify(report,null,2));
