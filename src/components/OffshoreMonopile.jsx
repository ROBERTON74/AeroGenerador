import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const YELLOW = '#e5b627';
const STEEL = '#64757c';

function Member({ from, to, radius = .006, color = YELLOW }) {
  const { center, orientation, length } = useMemo(() => {
    const start = new THREE.Vector3(...from), end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    return { center: start.add(end).multiplyScalar(.5), length: direction.length(), orientation: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize()) };
  }, [from, to]);
  return <mesh position={center} quaternion={orientation} castShadow receiveShadow>
    <cylinderGeometry args={[radius,radius,length,8]} />
    <meshStandardMaterial color={color} roughness={.46} metalness={.5} />
  </mesh>;
}

function GuardRail({ y }) {
  const curve = useMemo(() => {
    const points = Array.from({length:65},(_,i) => {
      const angle = Math.PI/2+.29+i/64*(Math.PI*2-.58);
      return new THREE.Vector3(Math.cos(angle)*.402,y,Math.sin(angle)*.402);
    });
    return new THREE.CatmullRomCurve3(points);
  }, [y]);
  return <mesh castShadow>
    <tubeGeometry args={[curve,96,.0035,6,false]} />
    <meshStandardMaterial color={YELLOW} metalness={.45} roughness={.4} />
  </mesh>;
}

export default function OffshoreMonopile() {
  const posts = useMemo(() => Array.from({length:28},(_,i)=>i/28*Math.PI*2).filter(a=>Math.abs(a-Math.PI/2)>.27),[]);
  const grating = useMemo(() => {
    const pixels = new Uint8Array(32*32*4);
    for(let y=0;y<32;y++) for(let x=0;x<32;x++) {
      const index=(y*32+x)*4, line=x%8<2||y%8<2;
      pixels.set([164,175,176,line?255:0],index);
    }
    const texture=new THREE.DataTexture(pixels,32,32,THREE.RGBAFormat);
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.repeat.set(10,10);
    texture.magFilter=THREE.NearestFilter;texture.needsUpdate=true;
    return texture;
  },[]);
  useEffect(()=>()=>grating.dispose(),[grating]);
  const cable = useMemo(()=>new THREE.CatmullRomCurve3([
    new THREE.Vector3(-.22,-1.35,-.20),new THREE.Vector3(-.26,-.8,-.17),
    new THREE.Vector3(-.275,-.1,-.12),new THREE.Vector3(-.275,.35,-.12),
    new THREE.Vector3(-.24,.43,-.10),
  ]),[]);
  return <group name="Offshore_monopile_transition_piece">
    {/* Single steel pile continues below the sea; no surface pads or side pods. */}
    <mesh position={[0,-2.5,0]} castShadow receiveShadow>
      <cylinderGeometry args={[.239,.247,5.1,64]} />
      <meshStandardMaterial color="#3b4c50" metalness={.65} roughness={.62} />
    </mesh>
    <mesh position={[0,.19,0]} castShadow receiveShadow>
      <cylinderGeometry args={[.196,.249,.65,64]} />
      <meshStandardMaterial color={YELLOW} metalness={.36} roughness={.48} />
    </mesh>
    <mesh position={[0,-.075,0]} receiveShadow>
      <cylinderGeometry args={[.247,.251,.11,64]} />
      <meshStandardMaterial color="#8f8143" metalness={.25} roughness={.88} />
    </mesh>
    {/* Slim bolted tower interface and an open steel working deck. */}
    <mesh position={[0,.518,0]} castShadow receiveShadow>
      <cylinderGeometry args={[.207,.207,.022,64]} />
      <meshStandardMaterial color="#b2bcc0" roughness={.34} metalness={.72} />
    </mesh>
    <mesh position={[0,.49,0]} rotation={[-Math.PI/2,0,0]} castShadow receiveShadow>
      <ringGeometry args={[.2,.41,96]} />
      <meshStandardMaterial map={grating} color="#9fa9ac" alphaTest={.5} side={THREE.DoubleSide} roughness={.66} metalness={.62} />
    </mesh>
    {[.405,.216].map(radius=><mesh key={radius} position={[0,.482,0]} rotation={[Math.PI/2,0,0]} castShadow>
      <torusGeometry args={[radius,.008,6,96]} /><meshStandardMaterial color={STEEL} roughness={.5} metalness={.7} />
    </mesh>)}
    {Array.from({length:12},(_,i)=>i*Math.PI/6).map(angle=><group key={angle} rotation={[0,angle,0]}>
      <Member from={[.21,.48,0]} to={[.405,.48,0]} radius={.007} color={STEEL} />
      <Member from={[.235,.31,0]} to={[.385,.475,0]} radius={.007} />
    </group>)}
    <GuardRail y={.56} /><GuardRail y={.598} />
    {posts.map(angle=><Member key={angle} from={[Math.cos(angle)*.402,.486,Math.sin(angle)*.402]} to={[Math.cos(angle)*.402,.598,Math.sin(angle)*.402]} radius={.0035} />)}
    {Array.from({length:36},(_,i)=>i*Math.PI/18).map(angle=><mesh key={angle} position={[Math.cos(angle)*.197,.533,Math.sin(angle)*.197]} castShadow>
      <cylinderGeometry args={[.0037,.0037,.009,6]} /><meshStandardMaterial color="#d3d8d8" roughness={.36} metalness={.8} />
    </mesh>)}
    {/* Access door sits above the service deck, on the tower's front. */}
    <mesh position={[0,.602,.182]} castShadow>
      <boxGeometry args={[.055,.137,.009]} /><meshStandardMaterial color="#56676e" metalness={.55} roughness={.48} />
    </mesh>
    <mesh position={[0,.602,.188]}>
      <boxGeometry args={[.046,.125,.005]} /><meshStandardMaterial color="#dce2df" metalness={.4} roughness={.42} />
    </mesh>
    <Member from={[.015,.59,.193]} to={[.015,.613,.193]} radius={.0025} color="#424e53" />
    {/* Front boat landing, rubber fenders and a ladder through the rail gate. */}
    <group name="Boat_landing_and_access_ladder">
      {[-1,1].map(side=><group key={side}>
        <Member from={[side*.09,-.21,.452]} to={[side*.09,.31,.452]} radius={.014} color="#17292c" />
        <Member from={[side*.09,.28,.45]} to={[side*.10,.28,.205]} radius={.008} />
        <Member from={[side*.09,-.1,.45]} to={[side*.10,-.1,.225]} radius={.008} />
        <Member from={[side*.031,.12,.40]} to={[side*.031,.59,.40]} radius={.0034} />
      </group>)}
      {Array.from({length:21},(_,i)=>.13+i*.018).map(y=><Member key={y} from={[-.031,y,.4]} to={[.031,y,.4]} radius={.0028} color="#d3d8d7" />)}
      <mesh position={[0,.13,.385]} castShadow receiveShadow>
        <boxGeometry args={[.15,.012,.14]} /><meshStandardMaterial color={STEEL} metalness={.65} roughness={.6} />
      </mesh>
      <Member from={[-.11,.598,.39]} to={[.11,.598,.39]} radius={.003} color="#f4df78" />
    </group>
    {/* Cable protection tube and compact service davit. */}
    <mesh castShadow><tubeGeometry args={[cable,32,.014,10,false]} /><meshStandardMaterial color="#d7aa25" roughness={.6} metalness={.4} /></mesh>
    <Member from={[-.29,.49,-.08]} to={[-.29,.72,-.08]} radius={.009} />
    <Member from={[-.29,.72,-.08]} to={[-.43,.76,.01]} radius={.008} />
    <Member from={[-.29,.6,-.08]} to={[-.4,.75,-.01]} radius={.0035} color={STEEL} />
    <Member from={[-.43,.76,.01]} to={[-.43,.66,.01]} radius={.0018} color="#bfc8c7" />
    <mesh position={[-.43,.652,.01]} rotation={[Math.PI/2,0,0]}><torusGeometry args={[.008,.002,5,12,Math.PI*1.5]} /><meshStandardMaterial color="#404e52" metalness={.65} roughness={.45} /></mesh>
  </group>;
}
