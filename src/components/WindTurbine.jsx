import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const TURBINE_WHITE = '#f7faf8';
const TURBINE_SOFT_WHITE = '#edf3f0';
const TURBINE_SHADOW = '#c7d1cf';
const STRESS_RED = '#ff3434';
const STRESS_AMBER = '#ff9b35';
const STRESS_ARROW = '#ff1f2d';
const MAX_SWAY_RAD = THREE.MathUtils.degToRad(0.42);
const MAX_TORSION_RAD = THREE.MathUtils.degToRad(0.12);
const ROTOR_VISUAL_SPEED_GAIN = 1.65;

function MechanicalLabel({ text, position, width = 1.36 }) {
  return (
    <group position={position}>
      <mesh position={[0, 0, -0.012]} renderOrder={9}>
        <planeGeometry args={[width, 0.26]} />
        <meshBasicMaterial color="#152724" transparent opacity={0.72} depthWrite={false} />
      </mesh>
      <Text
        position={[0, 0, 0]}
        fontSize={0.105}
        maxWidth={width - 0.18}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#fff3ed"
        renderOrder={10}
      >
        {text}
      </Text>
    </group>
  );
}

function RedCalloutArrow({ start, end, head = true }) {
  const { midpoint, length, quaternion, conePosition } = useMemo(() => {
    const startVector = new THREE.Vector3(...start);
    const endVector = new THREE.Vector3(...end);
    const direction = endVector.clone().sub(startVector);
    const safeLength = Math.max(0.001, direction.length());
    direction.normalize();

    return {
      midpoint: startVector.clone().add(endVector).multiplyScalar(0.5),
      length: safeLength,
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction),
      conePosition: endVector.clone().sub(direction.clone().multiplyScalar(0.09)),
    };
  }, [start, end]);

  return (
    <group>
      <mesh position={midpoint} quaternion={quaternion} renderOrder={8}>
        <cylinderGeometry args={[0.012, 0.012, length, 12]} />
        <meshBasicMaterial color={STRESS_ARROW} transparent opacity={0.88} depthWrite={false} />
      </mesh>
      {head ? (
        <mesh position={conePosition} quaternion={quaternion} renderOrder={8}>
          <coneGeometry args={[0.055, 0.18, 18]} />
          <meshBasicMaterial color={STRESS_ARROW} transparent opacity={0.94} depthWrite={false} />
        </mesh>
      ) : null}
    </group>
  );
}

function Blade({ rotation = 0, flex = 0 }) {
  const shape = useMemo(() => {
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, -0.062);
    bladeShape.bezierCurveTo(0.9, -0.092, 2.28, -0.062, 3.38, -0.02);
    bladeShape.bezierCurveTo(3.7, -0.006, 3.76, 0.018, 3.44, 0.034);
    bladeShape.bezierCurveTo(2.24, 0.108, 0.86, 0.104, 0, 0.064);
    bladeShape.closePath();
    return bladeShape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.035,
      bevelEnabled: true,
      bevelSegments: 6,
      bevelSize: 0.025,
      bevelThickness: 0.018,
    }),
    [],
  );

  return (
    <group rotation={[0, 0, rotation]}>
      <mesh position={[0.3, 0, -0.016]} rotation={[0, 0.04 + flex, 0]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={TURBINE_WHITE}
          roughness={0.22}
          metalness={0.05}
          clearcoat={0.42}
          clearcoatRoughness={0.3}
          emissive="#dfeeed"
          emissiveIntensity={0.025}
        />
      </mesh>
      <mesh position={[1.66, 0.004, 0.024]} rotation={[0, flex * 0.7, 0.01]} castShadow>
        <boxGeometry args={[2.54, 0.012, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.24} metalness={0.04} />
      </mesh>
      <mesh position={[1.6, 0.058, 0.046]} rotation={[0, flex * 0.5, 0.012]} castShadow={false}>
        <boxGeometry args={[2.28, 0.009, 0.006]} />
        <meshStandardMaterial color="#d8e1df" roughness={0.32} metalness={0.06} />
      </mesh>
    </group>
  );
}

function RotorMotionDisc({ power }) {
  const discRef = useRef();

  useFrame((state) => {
    if (!discRef.current) return;
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 3.2) * 0.5;
    discRef.current.material.opacity = 0.035 + power * 0.055 + pulse * 0.012;
  });

  return (
    <mesh ref={discRef} position={[0, 0, -0.012]} renderOrder={0}>
      <circleGeometry args={[3.92, 96]} />
      <meshBasicMaterial color="#f6fffb" transparent opacity={0.05} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function BladeProjectedShadow({ rotorRef, power }) {
  const shadowRef = useRef();

  useFrame(() => {
    if (!shadowRef.current || !rotorRef.current) return;
    shadowRef.current.rotation.y = -rotorRef.current.rotation.z + 0.26;
  });

  return (
    <group ref={shadowRef} position={[-0.9, 0.071, -0.62]} scale={[1.15, 1, 0.78]}>
      {[0, 1, 2].map((blade) => (
        <mesh
          key={blade}
          rotation={[-Math.PI / 2, 0, blade * ((Math.PI * 2) / 3)]}
          position={[0, 0.002 + blade * 0.001, 0]}
          renderOrder={1}
        >
          <planeGeometry args={[4.2, 0.28]} />
          <meshBasicMaterial
            color="#173025"
            transparent
            opacity={0.12 + power * 0.05}
            depthWrite={false}
          />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
        <circleGeometry args={[0.36, 42]} />
        <meshBasicMaterial color="#173025" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function StressRing({ position, rotation = [0, 0, 0], radius = 0.5, tube = 0.018, intensity = 0.5 }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (!ringRef.current) return;
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2.1) * 0.5;
    ringRef.current.material.opacity = 0.2 + intensity * 0.38 + pulse * 0.1;
    ringRef.current.material.emissiveIntensity = 0.45 + intensity * 1.1 + pulse * 0.35;
    ringRef.current.scale.setScalar(1 + pulse * 0.035);
  });

  return (
    <mesh ref={ringRef} position={position} rotation={rotation} renderOrder={4}>
      <torusGeometry args={[radius, tube, 12, 96]} />
      <meshStandardMaterial
        color={STRESS_RED}
        emissive={STRESS_RED}
        transparent
        opacity={0.42}
        depthWrite={false}
        roughness={0.22}
        metalness={0.04}
      />
    </mesh>
  );
}

function StressPatch({ position, rotation = [0, 0, 0], scale = [1, 1, 1], intensity = 0.5 }) {
  const patchRef = useRef();

  useFrame((state) => {
    if (!patchRef.current) return;
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2.7) * 0.5;
    patchRef.current.material.opacity = 0.18 + intensity * 0.28 + pulse * 0.08;
    patchRef.current.material.emissiveIntensity = 0.35 + intensity * 0.9;
  });

  return (
    <mesh ref={patchRef} position={position} rotation={rotation} scale={scale} renderOrder={5}>
      <sphereGeometry args={[1, 24, 12]} />
      <meshStandardMaterial
        color={STRESS_AMBER}
        emissive={STRESS_RED}
        transparent
        opacity={0.34}
        depthWrite={false}
        roughness={0.25}
        metalness={0.02}
      />
    </mesh>
  );
}

function MechanicalArrow({
  position,
  rotation = [0, 0, 0],
  length = 0.9,
  intensity = 0.5,
  phase = 0,
  travel = 0.08,
}) {
  const arrowRef = useRef();

  useFrame((state) => {
    if (!arrowRef.current) return;
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2.6 + phase) * 0.5;
    arrowRef.current.position.x = pulse * travel;
    arrowRef.current.scale.setScalar(0.94 + pulse * 0.12);

    arrowRef.current.traverse((child) => {
      if (!child.material) return;
      child.material.opacity = 0.38 + intensity * 0.42 + pulse * 0.16;
      child.material.emissiveIntensity = 0.55 + intensity * 1.25 + pulse * 0.55;
    });
  });

  return (
    <group position={position} rotation={rotation}>
      <group ref={arrowRef}>
        <mesh position={[length * 0.42, 0, 0]} rotation={[0, 0, -Math.PI / 2]} renderOrder={6}>
          <cylinderGeometry args={[0.018, 0.018, length, 16]} />
          <meshStandardMaterial
            color={STRESS_ARROW}
            emissive={STRESS_ARROW}
            transparent
            opacity={0.76}
            depthWrite={false}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[length * 0.9, 0, 0]} rotation={[0, 0, -Math.PI / 2]} renderOrder={6}>
          <coneGeometry args={[0.085, 0.22, 24]} />
          <meshStandardMaterial
            color={STRESS_ARROW}
            emissive={STRESS_ARROW}
            transparent
            opacity={0.86}
            depthWrite={false}
            roughness={0.18}
          />
        </mesh>
        <pointLight position={[length * 0.58, 0, 0.04]} color={STRESS_ARROW} intensity={0.18 + intensity * 0.25} distance={1.8} />
      </group>
    </group>
  );
}

function TorsionArrow({ intensity }) {
  const arrowRef = useRef();

  useFrame((state) => {
    if (!arrowRef.current) return;
    const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2.2) * 0.5;
    arrowRef.current.rotation.z = state.clock.elapsedTime * 0.7;
    arrowRef.current.material.opacity = 0.26 + intensity * 0.35 + pulse * 0.12;
    arrowRef.current.material.emissiveIntensity = 0.55 + intensity * 1.2;
  });

  return (
    <group position={[0, 4.98, 0.18]} rotation={[0, 0, 0]}>
      <mesh ref={arrowRef} rotation={[0, 0, 0]} renderOrder={6}>
        <torusGeometry args={[0.58, 0.012, 10, 96]} />
        <meshStandardMaterial
          color={STRESS_ARROW}
          emissive={STRESS_ARROW}
          transparent
          opacity={0.52}
          depthWrite={false}
          roughness={0.22}
        />
      </mesh>
      <MechanicalArrow
        position={[0.42, 0.42, 0]}
        rotation={[0, 0, Math.PI * 0.72]}
        length={0.38}
        intensity={intensity}
        phase={1.2}
        travel={0.035}
      />
    </group>
  );
}

function StressMotionArrows({ intensity }) {
  return (
    <>
      <MechanicalArrow
        position={[-1.5, 2.7, 0.48]}
        rotation={[0, 0, 0]}
        length={1.18}
        intensity={intensity}
        phase={0.2}
      />
      <RedCalloutArrow start={[-1.68, 2.76, 0.5]} end={[-3.1, 3.58, 0.78]} />
      <MechanicalLabel text="Oscilacion de la torre" position={[-3.88, 3.6, 0.8]} width={1.58} />
      <MechanicalArrow
        position={[1.38, 2.3, 0.48]}
        rotation={[0, 0, Math.PI]}
        length={1.02}
        intensity={intensity * 0.9}
        phase={1.7}
      />
      <RedCalloutArrow start={[1.56, 2.36, 0.5]} end={[3.16, 2.94, 0.78]} />
      <MechanicalLabel text="Flexion lateral" position={[3.74, 2.96, 0.8]} width={1.16} />
      <MechanicalArrow
        position={[-1.55, 0.82, 0.56]}
        rotation={[0, 0, 0.12]}
        length={1}
        intensity={intensity}
        phase={2.2}
        travel={0.05}
      />
      <RedCalloutArrow start={[-1.74, 0.88, 0.58]} end={[-3.04, 1.52, 0.88]} />
      <MechanicalLabel text="Base y cimentacion" position={[-3.74, 1.54, 0.9]} width={1.42} />
      <TorsionArrow intensity={intensity} />
    </>
  );
}

function BladeFlexArrows({ intensity }) {
  return (
    <>
      {[0, 1, 2].map((blade) => (
        <group key={blade} rotation={[0, 0, blade * ((Math.PI * 2) / 3)]}>
          <MechanicalArrow
            position={[1.18, 0.22, 0.13]}
            rotation={[0, 0, -0.08]}
            length={0.72}
            intensity={intensity}
            phase={blade * 0.7}
            travel={0.045}
          />
        </group>
      ))}
    </>
  );
}

function BladeRootStressMarkers({ intensity }) {
  return (
    <>
      {[0, 1, 2].map((blade) => (
        <group key={blade} rotation={[0, 0, blade * ((Math.PI * 2) / 3)]}>
          <StressRing
            position={[0.38, 0, 0.07]}
            rotation={[Math.PI / 2, 0, 0]}
            radius={0.17}
            tube={0.012}
            intensity={intensity}
          />
          <StressPatch
            position={[0.64, 0, 0.055]}
            rotation={[0, 0, 0]}
            scale={[0.28, 0.07, 0.035]}
            intensity={intensity}
          />
        </group>
      ))}
    </>
  );
}

function StressMap({ intensity }) {
  return (
    <>
      <StressRing position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]} radius={0.52} tube={0.022} intensity={intensity} />
      <StressRing position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]} radius={0.43} tube={0.015} intensity={intensity * 0.85} />
      <StressRing position={[0, 5.17, 0.36]} rotation={[0, 0, 0]} radius={0.38} tube={0.018} intensity={intensity} />
      <StressPatch position={[0, 5.18, -0.24]} scale={[0.5, 0.24, 0.32]} intensity={intensity * 0.9} />
      <RedCalloutArrow start={[-0.4, 5.28, 0.6]} end={[-3.08, 6.02, 0.98]} />
      <MechanicalLabel text="Buje motor" position={[-3.62, 6.08, 1]} width={1.08} />
      <RedCalloutArrow start={[1.7, 5.74, 0.43]} end={[3.1, 6.14, 0.4]} />
      <MechanicalLabel text="Torsion de pala" position={[3.72, 6.18, 0.4]} width={1.24} />
      <StressMotionArrows intensity={intensity} />
      <pointLight position={[0.2, 5.22, 0.44]} color={STRESS_RED} intensity={0.25 + intensity * 0.7} distance={3.4} />
    </>
  );
}

function GearWheel({ radius = 0.18, teeth = 14, color = '#d8e0dc', speed = 1, position, scale = 1 }) {
  const gearRef = useRef();
  const teethPositions = useMemo(
    () =>
      Array.from({ length: teeth }).map((_, index) => {
        const angle = (index / teeth) * Math.PI * 2;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius, angle];
      }),
    [radius, teeth],
  );
  const spokeAngles = useMemo(
    () => Array.from({ length: 6 }).map((_, index) => (index / 6) * Math.PI * 2),
    [],
  );

  useFrame((_, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += delta * speed;
    }
  });

  return (
    <group ref={gearRef} position={position} scale={scale}>
      <mesh renderOrder={3}>
        <cylinderGeometry args={[radius, radius, 0.075, 56]} />
        <meshStandardMaterial color={color} roughness={0.22} metalness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.047]} renderOrder={3}>
        <torusGeometry args={[radius * 0.62, 0.012, 8, 48]} />
        <meshStandardMaterial color="#eef5f1" roughness={0.25} metalness={0.48} />
      </mesh>
      <mesh position={[0, 0, 0.05]} renderOrder={4}>
        <cylinderGeometry args={[radius * 0.2, radius * 0.2, 0.09, 28]} />
        <meshStandardMaterial color="#f7fbf7" roughness={0.18} metalness={0.66} />
      </mesh>
      {spokeAngles.map((angle) => (
        <mesh key={angle} position={[Math.cos(angle) * radius * 0.38, Math.sin(angle) * radius * 0.38, 0.054]} rotation={[0, 0, angle]} renderOrder={4}>
          <boxGeometry args={[radius * 0.62, 0.016, 0.034]} />
          <meshStandardMaterial color="#edf5f1" roughness={0.22} metalness={0.58} />
        </mesh>
      ))}
      {teethPositions.map(([x, y, angle]) => (
        <mesh key={angle} position={[x, y, 0]} rotation={[0, 0, angle]} renderOrder={3}>
          <boxGeometry args={[0.05, 0.02, 0.095]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.74} />
        </mesh>
      ))}
    </group>
  );
}

function CoilPack({ angle, color = '#ff8f35' }) {
  const x = Math.cos(angle) * 0.33;
  const y = Math.sin(angle) * 0.33;

  return (
    <mesh position={[x, y, -0.36]} rotation={[Math.PI / 2, 0, angle]} renderOrder={4}>
      <torusGeometry args={[0.055, 0.012, 10, 18]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.12}
        roughness={0.28}
        metalness={0.48}
      />
    </mesh>
  );
}

function BearingHousing({ position, radius = 0.18 }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
        <torusGeometry args={[radius, 0.026, 14, 72]} />
        <meshStandardMaterial color="#8d9b99" roughness={0.24} metalness={0.78} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
        <torusGeometry args={[radius * 0.62, 0.009, 8, 48]} />
        <meshStandardMaterial color="#f4f7f4" roughness={0.18} metalness={0.62} />
      </mesh>
    </group>
  );
}

function SupportFrame() {
  return (
    <group>
      <mesh position={[-0.22, -0.22, -0.2]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.018, 0.018, 1.24, 12]} />
        <meshStandardMaterial color="#647371" roughness={0.36} metalness={0.58} />
      </mesh>
      <mesh position={[0.22, -0.22, -0.2]} rotation={[Math.PI / 2, 0, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.018, 0.018, 1.24, 12]} />
        <meshStandardMaterial color="#647371" roughness={0.36} metalness={0.58} />
      </mesh>
      {[-0.62, -0.22, 0.18].map((z) => (
        <mesh key={z} position={[0, -0.22, z]} renderOrder={2}>
          <boxGeometry args={[0.62, 0.028, 0.035]} />
          <meshStandardMaterial color="#7c8a87" roughness={0.34} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function RemovedNacelleCover() {
  return (
    <group position={[0, 5.82, -0.38]} rotation={[0.24, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.31, 0.92, 10, 28]} />
        <meshStandardMaterial
          color="#eef4f0"
          transparent
          opacity={0.7}
          roughness={0.24}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[0, -0.28, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.008, 8, 64]} />
        <meshStandardMaterial color="#b8c4c1" roughness={0.22} metalness={0.45} />
      </mesh>
    </group>
  );
}

function GeneratorCutaway({ rpm, power, intensity }) {
  const shaftRef = useRef();
  const generatorRotorRef = useRef();
  const torquePulseRef = useRef();
  const shaftSpeed = THREE.MathUtils.clamp((rpm / 60) * Math.PI * 2, 0, 1.45);
  const coilAngles = useMemo(
    () => Array.from({ length: 10 }).map((_, index) => (index / 10) * Math.PI * 2),
    [],
  );

  useFrame((state, delta) => {
    if (shaftRef.current) {
      shaftRef.current.rotation.z -= shaftSpeed * delta;
    }

    if (generatorRotorRef.current) {
      generatorRotorRef.current.rotation.z -= shaftSpeed * 2.4 * delta;
    }

    if (torquePulseRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 4.2) * 0.5;
      torquePulseRef.current.material.opacity = 0.18 + pulse * 0.26 + intensity * 0.18;
      torquePulseRef.current.scale.setScalar(0.96 + pulse * 0.08);
    }
  });

  return (
    <group position={[0, 5.2, -0.23]} rotation={[0, 0, 0]}>
      <SupportFrame />

      <group ref={shaftRef}>
        <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
          <cylinderGeometry args={[0.052, 0.052, 1.18, 40]} />
          <meshStandardMaterial color="#d8e0dd" roughness={0.18} metalness={0.78} />
        </mesh>
        <mesh position={[0.059, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
          <boxGeometry args={[0.014, 0.014, 0.62]} />
          <meshStandardMaterial color="#ff5148" emissive="#ff2b2b" emissiveIntensity={0.25} />
        </mesh>
      </group>

      <BearingHousing position={[0, 0, 0.22]} radius={0.19} />
      <BearingHousing position={[0, 0, -0.2]} radius={0.15} />

      <group position={[0, 0, -0.08]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0.02, 0, -0.03]} renderOrder={2}>
          <boxGeometry args={[0.78, 0.55, 0.08]} />
          <meshStandardMaterial
            color="#30454a"
            transparent
            opacity={0.26}
            depthWrite={false}
            roughness={0.26}
            metalness={0.32}
          />
        </mesh>
        <GearWheel radius={0.22} teeth={20} color="#d6dfdc" speed={shaftSpeed * 0.75} position={[0, 0, 0.035]} />
        <GearWheel
          radius={0.13}
          teeth={12}
          color="#f4c542"
          speed={-shaftSpeed * 1.85}
          position={[0.3, 0.02, 0.065]}
        />
        <GearWheel
          radius={0.1}
          teeth={10}
          color="#c8d3cf"
          speed={shaftSpeed * 2.6}
          position={[-0.25, -0.02, 0.005]}
        />
      </group>

      <group position={[0, 0, -0.52]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={3}>
          <cylinderGeometry args={[0.39, 0.39, 0.38, 64, 1, true]} />
          <meshStandardMaterial
            color="#20363d"
            emissive="#15394a"
            emissiveIntensity={0.15 + power * 0.2}
            transparent
            opacity={0.74}
            roughness={0.34}
            metalness={0.36}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
          <torusGeometry args={[0.39, 0.012, 8, 72]} />
          <meshStandardMaterial color="#d7e1dd" roughness={0.2} metalness={0.58} />
        </mesh>
        <group ref={generatorRotorRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]} renderOrder={4}>
            <cylinderGeometry args={[0.17, 0.17, 0.44, 40]} />
            <meshStandardMaterial color="#e6efeb" roughness={0.24} metalness={0.64} />
          </mesh>
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, 0.12]} renderOrder={4}>
            <boxGeometry args={[0.18, 0.028, 0.32]} />
            <meshStandardMaterial color="#d6dfdc" roughness={0.24} metalness={0.45} />
          </mesh>
          <mesh position={[-0.2, 0, 0]} rotation={[0, 0, 0.12]} renderOrder={4}>
            <boxGeometry args={[0.18, 0.028, 0.32]} />
            <meshStandardMaterial color="#d6dfdc" roughness={0.24} metalness={0.45} />
          </mesh>
        </group>
        {coilAngles.map((angle) => (
          <CoilPack key={angle} angle={angle} color={angle > Math.PI ? '#ff8f35' : '#ffbd5a'} />
        ))}
      </group>

      <mesh ref={torquePulseRef} position={[0, 0, -0.17]} rotation={[Math.PI / 2, 0, 0]} renderOrder={5}>
        <torusGeometry args={[0.47, 0.012, 8, 96]} />
        <meshStandardMaterial
          color={STRESS_RED}
          emissive={STRESS_RED}
          transparent
          opacity={0.35}
          depthWrite={false}
          roughness={0.2}
        />
      </mesh>

      <MechanicalArrow
        position={[-0.58, 0.2, -0.22]}
        rotation={[0, 0, -0.08]}
        length={0.48}
        intensity={intensity}
        phase={0.4}
        travel={0.035}
      />
      <pointLight position={[0, 0.2, -0.35]} color="#ff6040" intensity={0.25 + intensity * 0.45} distance={2.2} />
    </group>
  );
}

export default function WindTurbine({
  rpm = 12,
  power = 0.45,
  showStressMap = false,
  mechanical,
}) {
  const turbineRef = useRef();
  const rotorRef = useRef();
  const targetSpeedRef = useRef(0);
  const currentSpeedRef = useRef(0);
  const stressIntensity = THREE.MathUtils.clamp((mechanical?.mechanicalLoadPercent ?? power * 100) / 100, 0.25, 1);
  const bladeFlex = THREE.MathUtils.degToRad(mechanical?.bladeRootFlexDeg ?? power * 1.2) * 0.16;
  const towerSway = THREE.MathUtils.degToRad(mechanical?.towerSwayDeg ?? power * 0.2);
  const towerTorsion = THREE.MathUtils.degToRad(mechanical?.towerTorsionDeg ?? power * 0.03);

  useFrame((state, delta) => {
    targetSpeedRef.current = THREE.MathUtils.clamp(
      (rpm / 60) * Math.PI * 2 * ROTOR_VISUAL_SPEED_GAIN,
      0,
      1.95,
    );
    currentSpeedRef.current = THREE.MathUtils.lerp(
      currentSpeedRef.current,
      targetSpeedRef.current,
      1 - Math.pow(0.04, delta),
    );

    if (rotorRef.current) {
      rotorRef.current.rotation.z -= currentSpeedRef.current * delta;
    }

    if (turbineRef.current) {
      const windPulse = Math.sin(state.clock.elapsedTime * 0.72);
      const gustPulse = Math.sin(state.clock.elapsedTime * 1.46 + power * 2.8);
      const targetZ = THREE.MathUtils.clamp(
        windPulse * towerSway * 0.7 + gustPulse * towerSway * 0.08,
        -MAX_SWAY_RAD,
        MAX_SWAY_RAD,
      );
      const targetY = THREE.MathUtils.clamp(
        windPulse * towerTorsion * 0.55 + gustPulse * towerTorsion * 0.08,
        -MAX_TORSION_RAD,
        MAX_TORSION_RAD,
      );
      const follow = 1 - Math.pow(0.035, delta);

      turbineRef.current.rotation.y = THREE.MathUtils.lerp(turbineRef.current.rotation.y, targetY, follow);
      turbineRef.current.rotation.z = THREE.MathUtils.lerp(turbineRef.current.rotation.z, targetZ, follow);
      turbineRef.current.rotation.x = 0;
    }
  });

  return (
    <group ref={turbineRef} position={[0, 0, 0]} scale={1.2}>
      <mesh position={[0, 2.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.23, 0.44, 5.1, 48, 1]} />
        <meshPhysicalMaterial
          color={TURBINE_SOFT_WHITE}
          roughness={0.25}
          metalness={0.18}
          clearcoat={0.28}
          clearcoatRoughness={0.36}
        />
      </mesh>
      {showStressMap ? <StressMap intensity={stressIntensity} /> : null}

      <mesh position={[0, 5.15, 0]} castShadow>
        <sphereGeometry args={[0.42, 36, 18]} />
        <meshPhysicalMaterial color={TURBINE_WHITE} roughness={0.22} metalness={0.12} clearcoat={0.35} />
      </mesh>

      <mesh position={[0, 5.22, -0.36]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.34, 1.2, 16, 32]} />
        <meshPhysicalMaterial
          color={TURBINE_WHITE}
          roughness={0.2}
          metalness={0.12}
          clearcoat={0.45}
          clearcoatRoughness={0.28}
          transparent={showStressMap}
          opacity={showStressMap ? 0.24 : 1}
          depthWrite={!showStressMap}
        />
      </mesh>
      {showStressMap ? (
        <>
          <GeneratorCutaway rpm={rpm} power={power} intensity={stressIntensity} />
          <RemovedNacelleCover />
        </>
      ) : null}

      <mesh position={[0, 5.05, -0.98]} rotation={[0.12, 0, 0]} castShadow>
        <boxGeometry args={[0.46, 0.16, 0.42]} />
        <meshPhysicalMaterial
          color={TURBINE_SHADOW}
          roughness={0.32}
          metalness={0.14}
          clearcoat={0.25}
          transparent={showStressMap}
          opacity={showStressMap ? 0.32 : 1}
          depthWrite={!showStressMap}
        />
      </mesh>

      <group ref={rotorRef} position={[0, 5.2, 0.38]}>
        <RotorMotionDisc power={power} />
        <Blade rotation={0} flex={bladeFlex} />
        <Blade rotation={(Math.PI * 2) / 3} flex={bladeFlex} />
        <Blade rotation={(Math.PI * 4) / 3} flex={bladeFlex} />
        {showStressMap ? (
          <>
            <BladeRootStressMarkers intensity={stressIntensity} />
            <BladeFlexArrows intensity={stressIntensity} />
          </>
        ) : null}

        <mesh castShadow>
          <sphereGeometry args={[0.36, 48, 24]} />
          <meshPhysicalMaterial color={TURBINE_WHITE} roughness={0.18} metalness={0.16} clearcoat={0.4} />
        </mesh>
      </group>

      <BladeProjectedShadow rotorRef={rotorRef} power={power} />

      <pointLight
        position={[0.3, 5.15, 0.55]}
        color="#89f7d2"
        intensity={0.3 + power * 0.4}
        distance={2.8}
      />
    </group>
  );
}


