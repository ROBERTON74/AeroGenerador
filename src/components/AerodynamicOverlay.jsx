import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function AerodynamicOverlay({ yaw = 0, reducedMotion = false }) {
  const particles=useRef();
  const arrows=useMemo(()=>[
    {at:new THREE.Vector3(-.75,.48,2.7),color:0x41e7d0,length:2.2},
    {at:new THREE.Vector3(.75,-.35,2.7),color:0x41e7d0,length:2.2},
    {at:new THREE.Vector3(1.05,.25,.2),color:0xffb23e,length:1.7},
  ],[]);
  const direction=useMemo(()=>new THREE.Vector3(0,0,-1),[]);
  useFrame(({clock})=>{
    if(!particles.current||reducedMotion)return;
    particles.current.children.forEach((particle,index)=>{particle.position.z=2.8-((clock.elapsedTime*.7+index*.43)%2.8)});
  });
  return <group name="Cp_Ct_illustrative_flow" position={[0,6.24,.31]} rotation={[0,THREE.MathUtils.degToRad(yaw),0]}>
    {arrows.map((arrow,index)=><arrowHelper key={index} args={[direction,arrow.at,arrow.length,arrow.color,.19,.09]} />)}
    <mesh position={[0,0,-.02]}><ringGeometry args={[1.1,1.12,80]}/><meshBasicMaterial color="#41e7d0" transparent opacity={.35} side={THREE.DoubleSide} depthWrite={false}/></mesh>
    <group ref={particles}>{Array.from({length:12},(_,index)=><mesh key={index} position={[index%2?-.75:.75,index%2?.48:-.35,2.8-index*.2]}><sphereGeometry args={[.026,8,6]}/><meshBasicMaterial color="#83ffeb"/></mesh>)}</group>
  </group>;
}
