import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GeneratorCutaway, StressMap } from './WindTurbine.jsx';
import { BLENDER_MODEL_URL, MODEL_SCALE, prepareBlenderTurbine } from './blenderTurbineModel.js';

export default function BlenderWindTurbine({ rpm = 12, power = .45, mechanical, scada, showStressMap = false, showDelMap = false, inspectionView = '' }) {
  const gltf = useGLTF(BLENDER_MODEL_URL);
  const instance = useMemo(() => prepareBlenderTurbine(gltf), [gltf]);
  const { gl } = useThree();
  const sway = useRef();
  const nacelleOverlay = useRef();
  const rootMarkers = useRef();
  const intensity = THREE.MathUtils.clamp((mechanical?.mechanicalLoadPercent ?? power * 100) / 100, .25, 1);
  useEffect(() => { instance.setAnalysis(showStressMap && !showDelMap && !inspectionView);instance.setFatigueMap(showDelMap);instance.setInspectionMap(inspectionView); }, [instance, showStressMap, showDelMap, inspectionView]);
  useEffect(() => { gl.domElement.dataset.inspectionView = inspectionView; }, [gl,inspectionView]);
  useEffect(() => { gl.domElement.dataset.fatigueMap = String(showDelMap); }, [gl, showDelMap]);
  useEffect(() => {
    gl.domElement.dataset.turbineModel = 'blender';
    return () => { delete gl.domElement.dataset.turbineModel; };
  }, [gl, instance]);
  useEffect(() => {
    // Deferred disposal survives React StrictMode's immediate effect re-run.
    let retired = false;
    instance.retired = false;
    return () => { retired = true;instance.retired = true;queueMicrotask(() => { if (retired && instance.retired) instance.dispose(); }); };
  }, [instance]);
  useFrame((state, delta) => {
    instance.update(delta, { rpm, power, pitchAngleDeg: scada?.pitchAngleDeg ?? 0, yawMisalignmentDeg: scada?.yawMisalignmentDeg ?? 0, bladeRootFlexDeg: mechanical?.bladeRootFlexDeg ?? power*1.2 });
    if (sway.current) {
      const time = state.clock.elapsedTime;
      const pulse = Math.sin(time * .72), gust = Math.sin(time * 1.46 + power * 2.8);
      const towerSway = THREE.MathUtils.degToRad(mechanical?.towerSwayDeg ?? power * .2);
      const towerTorsion = THREE.MathUtils.degToRad(mechanical?.towerTorsionDeg ?? power * .03);
      const follow = 1 - Math.pow(.035, Math.min(delta, .1));
      sway.current.rotation.z = THREE.MathUtils.lerp(sway.current.rotation.z, THREE.MathUtils.clamp(pulse*towerSway*.7+gust*towerSway*.08,-.00733,.00733),follow);
      sway.current.rotation.y = THREE.MathUtils.lerp(sway.current.rotation.y,THREE.MathUtils.clamp(pulse*towerTorsion*.55+gust*towerTorsion*.08,-.0021,.0021),follow);
    }
    if (nacelleOverlay.current) nacelleOverlay.current.rotation.y = instance.yaw.rotation.y;
    if (rootMarkers.current) {
      rootMarkers.current.quaternion.copy(instance.yaw.quaternion).multiply(instance.rotor.quaternion);
    }
  });
  const cutawayScale = [Math.max(instance.nacelleSize.x/.85,.4),Math.max(instance.nacelleSize.y/.85,.3),Math.max(instance.nacelleSize.z/1.7,.35)];
  return (
    <group ref={sway} scale={1.2} name="Blender_aerogenerador_principal">
      <group scale={MODEL_SCALE} dispose={null}>
        <primitive object={instance.model} dispose={null} />
      </group>
      {showStressMap && !showDelMap && !inspectionView ? <>
        <StressMap intensity={intensity} />
        <group ref={nacelleOverlay} position={[0,5.2,0]}>
          <GeneratorCutaway rpm={rpm} power={power} intensity={intensity}
            position={[instance.nacelleCenter.x,instance.nacelleCenter.y-5.2,instance.nacelleCenter.z]}
            scale={cutawayScale} />
        </group>
        <group ref={rootMarkers} position={instance.hub}>
          {instance.bladeDirections.map((direction,index) => <group key={index} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1,0,0),direction)}>
            <mesh position={[.42,0,.03]} rotation={[Math.PI/2,0,0]}>
              <torusGeometry args={[.14,.018,8,32]} />
              <meshBasicMaterial color="#ff563e" transparent opacity={.85} depthWrite={false} />
            </mesh>
            <mesh position={[1.1,0,.06]} rotation={[0,0,-Math.PI/2]}>
              <coneGeometry args={[.065,.35,12]} />
              <meshBasicMaterial color="#ff3434" depthTest={false} />
            </mesh>
          </group>)}
        </group>
      </> : null}
    </group>
  );
}

useGLTF.preload(BLENDER_MODEL_URL);
