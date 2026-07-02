import { Cloud, Clouds, Environment, OrbitControls, Sky, Sparkles } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import WindTurbine from './WindTurbine.jsx';

function AnimatedSea() {
  const seaRef = useRef();
  const basePositions = useRef(null);

  useFrame((state) => {
    const geometry = seaRef.current?.geometry;
    if (!geometry) return;

    const position = geometry.attributes.position;
    if (!basePositions.current) {
      basePositions.current = Float32Array.from(position.array);
    }

    const elapsed = state.clock.elapsedTime;
    for (let i = 0; i < position.count; i += 1) {
      const x = basePositions.current[i * 3];
      const y = basePositions.current[i * 3 + 1];
      position.array[i * 3 + 2] =
        Math.sin(x * 0.42 + elapsed * 0.8) * 0.045 +
        Math.cos(y * 0.36 + elapsed * 0.55) * 0.035;
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={seaRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
      <planeGeometry args={[115, 115, 132, 132]} />
      <meshPhysicalMaterial
        color="#176f8b"
        roughness={0.24}
        metalness={0.02}
        transmission={0.04}
        thickness={1.1}
        transparent
        opacity={0.94}
        clearcoat={0.74}
        clearcoatRoughness={0.18}
      />
    </mesh>
  );
}

function DistantTurbine({ position, scale = 1, rotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.055, 2.4, 16]} />
        <meshStandardMaterial color="#d7e0dd" roughness={0.5} metalness={0.12} />
      </mesh>
      <mesh position={[0, 2.48, 0.03]} castShadow>
        <sphereGeometry args={[0.1, 16, 8]} />
        <meshStandardMaterial color="#edf2ef" roughness={0.36} metalness={0.12} />
      </mesh>
      <group position={[0, 2.48, 0.12]}>
        {[0, 1, 2].map((blade) => (
          <mesh key={blade} rotation={[0, 0, blade * ((Math.PI * 2) / 3)]} position={[0.24, 0, 0]}>
            <boxGeometry args={[0.62, 0.025, 0.01]} />
            <meshStandardMaterial color="#eef4f1" roughness={0.42} metalness={0.08} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function HorizonTurbine({ position, scale = 1, rotation = 0 }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <WindTurbine rpm={5} power={0.18} />
    </group>
  );
}

function OffshoreFoundation() {
  const railPosts = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, index) => {
        const angle = (index / 16) * Math.PI * 2;
        return [Math.cos(angle) * 0.92, Math.sin(angle) * 0.92, angle];
      }),
    [],
  );

  return (
    <group>
      <mesh position={[0, -0.72, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.58, 1.55, 48]} />
        <meshStandardMaterial color="#7a8988" roughness={0.58} metalness={0.18} />
      </mesh>
      <mesh position={[-1.28, -0.55, 0.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.46, 1.18, 36]} />
        <meshStandardMaterial color="#6f817f" roughness={0.62} metalness={0.16} />
      </mesh>
      <mesh position={[1.28, -0.55, 0.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.46, 1.18, 36]} />
        <meshStandardMaterial color="#6f817f" roughness={0.62} metalness={0.16} />
      </mesh>
      <mesh position={[0, -1.12, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[2.9, 0.18, 0.72]} />
        <meshStandardMaterial color="#596967" roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh position={[-0.64, -0.42, 0.06]} rotation={[0, 0, -0.48]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.55, 12]} />
        <meshStandardMaterial color="#d6c36a" roughness={0.52} metalness={0.18} />
      </mesh>
      <mesh position={[0.64, -0.42, 0.06]} rotation={[0, 0, 0.48]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.55, 12]} />
        <meshStandardMaterial color="#d6c36a" roughness={0.52} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.54, 0.68, 1.35, 64]} />
        <meshStandardMaterial color="#d9e1dc" roughness={0.42} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.47, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.05, 1.05, 0.08, 64]} />
        <meshStandardMaterial color="#4a5655" roughness={0.5} metalness={0.32} />
      </mesh>
      <mesh position={[0.72, 0.18, 0.72]} rotation={[0, -0.72, 0]} castShadow>
        <boxGeometry args={[0.08, 1.12, 0.08]} />
        <meshStandardMaterial color="#2f4f5a" roughness={0.46} metalness={0.22} />
      </mesh>
      <mesh position={[0.78, 0.68, 0.78]} rotation={[0, -0.72, 0]} castShadow>
        <boxGeometry args={[0.1, 0.08, 0.35]} />
        <meshStandardMaterial color="#f4c542" roughness={0.45} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.54, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.94, 0.018, 10, 80]} />
        <meshStandardMaterial color="#f4c542" roughness={0.45} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.82, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.94, 0.015, 10, 80]} />
        <meshStandardMaterial color="#f4c542" roughness={0.45} metalness={0.18} />
      </mesh>
      {railPosts.map(([x, z, angle]) => (
        <mesh key={angle} position={[x, 0.68, z]} rotation={[0, angle, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.32, 8]} />
          <meshStandardMaterial color="#f4c542" roughness={0.45} metalness={0.16} />
        </mesh>
      ))}
    </group>
  );
}

function MaintenanceWorker() {
  return (
    <group position={[0.72, 0.48, 0.5]} rotation={[0, -0.88, 0]} scale={0.19}>
      <mesh position={[0, 1.74, 0]} castShadow>
        <sphereGeometry args={[0.16, 18, 12]} />
        <meshStandardMaterial color="#d0a17a" roughness={0.58} />
      </mesh>
      <mesh position={[0, 1.91, 0]} castShadow>
        <sphereGeometry args={[0.18, 18, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f4c542" roughness={0.4} metalness={0.06} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <capsuleGeometry args={[0.18, 0.62, 10, 18]} />
        <meshStandardMaterial color="#f07a24" roughness={0.52} metalness={0.04} />
      </mesh>
      <mesh position={[0, 1.27, 0.185]} castShadow>
        <boxGeometry args={[0.22, 0.42, 0.018]} />
        <meshStandardMaterial color="#e7f3ef" roughness={0.5} metalness={0.02} />
      </mesh>
      <mesh position={[-0.21, 1.27, 0]} rotation={[0, 0, -0.2]} castShadow>
        <capsuleGeometry args={[0.055, 0.48, 8, 12]} />
        <meshStandardMaterial color="#f07a24" roughness={0.55} />
      </mesh>
      <mesh position={[0.22, 1.27, 0]} rotation={[0, 0, 0.38]} castShadow>
        <capsuleGeometry args={[0.055, 0.5, 8, 12]} />
        <meshStandardMaterial color="#f07a24" roughness={0.55} />
      </mesh>
      <mesh position={[-0.075, 0.65, 0]} rotation={[0, 0, 0.04]} castShadow>
        <capsuleGeometry args={[0.07, 0.58, 8, 12]} />
        <meshStandardMaterial color="#1f3135" roughness={0.58} />
      </mesh>
      <mesh position={[0.075, 0.65, 0]} rotation={[0, 0, -0.04]} castShadow>
        <capsuleGeometry args={[0.07, 0.58, 8, 12]} />
        <meshStandardMaterial color="#1f3135" roughness={0.58} />
      </mesh>
      <mesh position={[-0.08, 0.25, 0.03]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.28]} />
        <meshStandardMaterial color="#20282a" roughness={0.5} />
      </mesh>
      <mesh position={[0.08, 0.25, 0.03]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.28]} />
        <meshStandardMaterial color="#20282a" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Cable({ points, color = '#b45b43', radius = 0.025, dashed = false }) {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point))), [points]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 64, radius, 10, false]} />
      <meshStandardMaterial color={color} roughness={0.58} metalness={0.08} />
      {dashed ? null : null}
    </mesh>
  );
}

function SegmentedFloatCable({ side = 'left' }) {
  const direction = side === 'left' ? -1 : 1;
  const points = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, index) => {
        const t = index / 17;
        return [
          direction * (1.05 + t * 7.2),
          -1.1 - Math.sin(t * Math.PI) * 0.55,
          2.1 + t * 7.2,
        ];
      }),
    [direction],
  );

  return (
    <group>
      <Cable points={points} color="#8e4638" radius={0.018} />
      {points.slice(2, -2).map((point, index) => (
        <mesh
          key={`${side}-${point[0]}`}
          position={point}
          rotation={[0, direction * 0.52, 0.25]}
          castShadow
        >
          <capsuleGeometry args={[0.055, 0.24, 8, 12]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? '#e1c84d' : '#4b4a3c'}
            roughness={0.48}
            metalness={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

function UnderwaterCutaway() {
  const sandMarkers = useMemo(
    () =>
      Array.from({ length: 44 }).map((_, index) => ({
        x: -8 + ((index * 1.91) % 16),
        z: 1.2 + ((index * 2.43) % 10),
        size: 0.035 + (index % 5) * 0.012,
      })),
    [],
  );

  return (
    <group>
      <mesh position={[0, -1.72, 6.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[22, 14, 32, 12]} />
        <meshStandardMaterial color="#a99570" roughness={0.97} metalness={0.01} />
      </mesh>
      <mesh position={[0, -0.72, 6.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[22, 13.5, 1, 1]} />
        <meshPhysicalMaterial
          color="#0b5963"
          roughness={0.32}
          metalness={0}
          transparent
          opacity={0.46}
          transmission={0.18}
          thickness={2.4}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, -0.78, 13.08]}>
        <planeGeometry args={[22, 2.55, 1, 1]} />
        <meshBasicMaterial color="#063f48" transparent opacity={0.52} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.03, 13.1]} rotation={[0, 0, 0]}>
        <planeGeometry args={[22, 0.045, 1, 1]} />
        <meshBasicMaterial color="#dafcf7" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh position={[0, -1.55, 12.98]} rotation={[0, 0, 0]}>
        <planeGeometry args={[22, 0.05, 1, 1]} />
        <meshBasicMaterial color="#ddc99a" transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <Cable
        points={[
          [-0.1, -1.08, 0.25],
          [-2.4, -1.45, 2.8],
          [-4.6, -1.48, 5.4],
          [-7.6, -1.52, 8.8],
        ]}
        color="#9f4437"
        radius={0.026}
      />
      <SegmentedFloatCable side="left" />
      <SegmentedFloatCable side="right" />
      <Cable
        points={[
          [-1.28, -0.95, 0.18],
          [-2.2, -1.42, 1.8],
          [-3.2, -1.52, 4.4],
        ]}
        color="#cfd8d2"
        radius={0.012}
      />
      <Cable
        points={[
          [1.28, -0.95, 0.18],
          [2.2, -1.42, 1.8],
          [3.25, -1.52, 4.4],
        ]}
        color="#cfd8d2"
        radius={0.012}
      />
      {sandMarkers.map((marker) => (
        <mesh key={`${marker.x}-${marker.z}`} position={[marker.x, -1.64, marker.z]} receiveShadow>
          <sphereGeometry args={[marker.size, 8, 5]} />
          <meshStandardMaterial color="#796f5a" roughness={0.98} />
        </mesh>
      ))}
    </group>
  );
}

function ServiceBoat() {
  return (
    <group position={[18.5, 0.05, -24]} rotation={[0, -0.72, 0]} scale={0.42}>
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[2.8, 0.3, 0.56]} />
        <meshStandardMaterial color="#b83b2f" roughness={0.42} metalness={0.14} />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <boxGeometry args={[2.12, 0.24, 0.44]} />
        <meshStandardMaterial color="#263f48" roughness={0.45} metalness={0.18} />
      </mesh>
      <mesh position={[0.42, 0.55, 0]} castShadow>
        <boxGeometry args={[0.72, 0.5, 0.38]} />
        <meshStandardMaterial color="#f1f4ef" roughness={0.35} metalness={0.08} />
      </mesh>
      <mesh position={[0.64, 0.83, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.52, 8]} />
        <meshStandardMaterial color="#333f43" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[-1.95, 0.018, 0.26]} rotation={[-Math.PI / 2, 0, 0.07]}>
        <planeGeometry args={[4.8, 0.07, 1, 1]} />
        <meshBasicMaterial color="#e6faf7" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[-1.95, 0.018, -0.26]} rotation={[-Math.PI / 2, 0, -0.07]}>
        <planeGeometry args={[4.8, 0.07, 1, 1]} />
        <meshBasicMaterial color="#e6faf7" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[-3.8, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 0.12, 1, 1]} />
        <meshBasicMaterial color="#e6faf7" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OffshoreEnvironment() {
  const foamBands = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, index) => {
        const angle = index * 2.31;
        const radius = 3.8 + ((index * 7) % 29);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius - 2,
          rotation: angle + Math.PI / 2,
          width: 0.45 + (index % 5) * 0.16,
        };
      }),
    [],
  );

  return (
    <group>
      <AnimatedSea />
      <OffshoreFoundation />
      <MaintenanceWorker />
      <UnderwaterCutaway />
      <ServiceBoat />
      <DistantTurbine position={[-17, 0.02, -26]} scale={0.92} rotation={0.3} />
      <DistantTurbine position={[19, 0.02, -31]} scale={0.78} rotation={-0.35} />
      <DistantTurbine position={[2, 0.02, -36]} scale={0.66} rotation={0.14} />
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.8, 1.35, 96]} />
        <meshBasicMaterial color="#e6fbf7" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh position={[3.6, 0.018, -8]} rotation={[-Math.PI / 2, 0, -0.36]}>
        <planeGeometry args={[1.4, 16, 1, 1]} />
        <meshBasicMaterial color="#f8f0c7" transparent opacity={0.16} depthWrite={false} />
      </mesh>
      <mesh position={[6.6, 0.019, -15]} rotation={[-Math.PI / 2, 0, -0.36]}>
        <planeGeometry args={[0.7, 20, 1, 1]} />
        <meshBasicMaterial color="#f8f0c7" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      {foamBands.map((band, index) => (
        <mesh
          key={`${band.x}-${band.z}`}
          position={[band.x, 0.012, band.z]}
          rotation={[-Math.PI / 2, 0, band.rotation]}
        >
          <planeGeometry args={[band.width, 0.018, 1, 1]} />
          <meshBasicMaterial color="#e7f7f5" transparent opacity={index % 3 === 0 ? 0.26 : 0.16} />
        </mesh>
      ))}
      <mesh position={[0, 0.05, -38]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 4, 1, 1]} />
        <meshBasicMaterial color="#9bb4bd" transparent opacity={0.24} depthWrite={false} />
      </mesh>
      <mesh position={[-5.7, 0.28, -3.4]} castShadow>
        <cylinderGeometry args={[0.08, 0.11, 0.56, 18]} />
        <meshStandardMaterial color="#ee5d45" roughness={0.42} metalness={0.12} />
      </mesh>
      <mesh position={[-5.7, 0.6, -3.4]} castShadow>
        <sphereGeometry args={[0.12, 18, 10]} />
        <meshStandardMaterial color="#f6f0d5" emissive="#ffc75f" emissiveIntensity={0.35} roughness={0.3} />
      </mesh>
      <mesh position={[5.9, 0.25, 2.8]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.5, 18]} />
        <meshStandardMaterial color="#2d7fbd" roughness={0.42} metalness={0.12} />
      </mesh>
    </group>
  );
}

function RealisticTree({ position, scale = 1, variant = 0 }) {
  const foliageColors = ['#254d35', '#315f40', '#3b7049', '#496f42', '#2f5a3d'];
  const trunkColor = variant % 2 === 0 ? '#6b4b34' : '#59412f';

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.09, 0.96, 9]} />
        <meshStandardMaterial color={trunkColor} roughness={0.88} />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <sphereGeometry args={[0.42, 14, 10]} />
        <meshStandardMaterial color={foliageColors[variant % foliageColors.length]} roughness={0.9} />
      </mesh>
      <mesh position={[-0.24, 1.02, 0.06]} castShadow>
        <sphereGeometry args={[0.28, 12, 9]} />
        <meshStandardMaterial color={foliageColors[(variant + 1) % foliageColors.length]} roughness={0.92} />
      </mesh>
      <mesh position={[0.26, 0.98, -0.1]} castShadow>
        <sphereGeometry args={[0.25, 12, 9]} />
        <meshStandardMaterial color={foliageColors[(variant + 2) % foliageColors.length]} roughness={0.92} />
      </mesh>
      <mesh position={[0.06, 1.42, -0.04]} castShadow>
        <sphereGeometry args={[0.24, 12, 8]} />
        <meshStandardMaterial color={foliageColors[variant % foliageColors.length]} roughness={0.9} />
      </mesh>
    </group>
  );
}

function GrassTuft({ position, scale = 1, color = '#617b4b' }) {
  return (
    <group position={position} scale={scale}>
      {[0, 1, 2].map((blade) => (
        <mesh key={blade} rotation={[0, blade * 2.1, -0.18 + blade * 0.16]} castShadow>
          <coneGeometry args={[0.035, 0.46, 5]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function GroundDataGrid({ power }) {
  const gridRef = useRef();

  useFrame(() => {
    if (gridRef.current) {
      const materials = Array.isArray(gridRef.current.material) ? gridRef.current.material : [gridRef.current.material];
      materials.forEach((material) => {
        material.transparent = true;
        material.opacity = 0.025 + power * 0.035;
        material.depthWrite = false;
      });
    }
  });

  return (
    <group>
      <gridHelper
        ref={gridRef}
        args={[36, 36, '#d6eee8', '#d6eee8']}
        position={[0, 0.028, 0]}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}

function HolographicTelemetry({ power }) {
  const groupRef = useRef();
  const pulseRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.12;
    }

    if (pulseRef.current) {
      const pulse = 0.5 + Math.sin(state.clock.elapsedTime * 2.2) * 0.5;
      pulseRef.current.material.opacity = 0.08 + pulse * 0.18 + power * 0.08;
      pulseRef.current.scale.setScalar(1 + pulse * 0.035);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.55, 0.01, 8, 128]} />
        <meshBasicMaterial color="#bfeee6" transparent opacity={0.18} depthWrite={false} />
      </mesh>
      <mesh position={[0, 3.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.05, 0.009, 8, 128]} />
        <meshBasicMaterial color="#c6e2f5" transparent opacity={0.14} depthWrite={false} />
      </mesh>
      <mesh ref={pulseRef} position={[0, 5.18, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.75, 96]} />
        <meshBasicMaterial color="#d8fff3" transparent opacity={0.12} depthWrite={false} />
      </mesh>
      <mesh position={[0, 2.55, 0]} rotation={[0.18, 0, -0.58]}>
        <cylinderGeometry args={[0.012, 0.012, 7.6, 12]} />
        <meshBasicMaterial color="#d1f2ea" transparent opacity={0.1} depthWrite={false} />
      </mesh>
    </group>
  );
}

function WindFlowParticles({ power }) {
  const pointsRef = useRef();
  const particles = useMemo(
    () =>
      Array.from({ length: 90 }).map((_, index) => ({
        x: -13 + ((index * 1.73) % 26),
        y: 2.1 + ((index * 0.37) % 4.8),
        z: -9 + ((index * 2.19) % 17),
        speed: 0.6 + ((index * 7) % 12) / 10,
      })),
    [],
  );

  const geometry = useMemo(() => {
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        particles.flatMap((particle) => [particle.x, particle.y, particle.z]),
        3,
      ),
    );
    return particleGeometry;
  }, [particles]);

  useFrame((state) => {
    const position = pointsRef.current?.geometry.attributes.position;
    if (!position) return;

    const elapsed = state.clock.elapsedTime;
    for (let index = 0; index < particles.length; index += 1) {
      const particle = particles[index];
      const x = ((particle.x + elapsed * particle.speed * (0.7 + power) + 13) % 26) - 13;
      position.array[index * 3] = x;
      position.array[index * 3 + 1] = particle.y + Math.sin(elapsed * 1.2 + index) * 0.08;
      position.array[index * 3 + 2] = particle.z;
    }
    position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial color="#c9fff2" size={0.055} transparent opacity={0.42} depthWrite={false} />
    </points>
  );
}

function SafetyBeacons({ power }) {
  const beaconRef = useRef();

  useFrame((state) => {
    if (beaconRef.current) {
      const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 3.4) * 0.45;
      beaconRef.current.material.emissiveIntensity = 0.5 + pulse * (0.9 + power);
    }
  });

  return (
    <group>
      <mesh ref={beaconRef} position={[0, 5.74, -0.55]} castShadow>
        <sphereGeometry args={[0.045, 18, 10]} />
        <meshStandardMaterial color="#ff4b4b" emissive="#ff2f2f" emissiveIntensity={0.9} roughness={0.25} />
      </mesh>
      <pointLight position={[0, 5.74, -0.55]} color="#ff5555" intensity={0.35 + power * 0.3} distance={5} />
    </group>
  );
}

function LandEnvironment() {
  const trees = useMemo(
    () =>
      Array.from({ length: 120 })
        .map((_, index) => {
        const angle = index * 2.31;
        const radius = 18 + ((index * 13) % 30);
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 8;
        const distanceFromBase = Math.hypot(x, z);

        return {
          x,
          z,
          distanceFromBase,
          scale: 0.42 + ((index * 17) % 52) / 100,
          variant: index,
        };
      })
        .filter((tree) => tree.distanceFromBase > 18),
    [],
  );

  const grass = useMemo(
    () =>
      Array.from({ length: 140 }).map((_, index) => {
        const angle = index * 1.71;
        const radius = 3.4 + ((index * 9) % 36);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius - 1.5,
          scale: 0.28 + ((index * 11) % 38) / 100,
          color: index % 4 === 0 ? '#78915a' : '#607d4d',
        };
      }),
    [],
  );

  const farTurbines = useMemo(
    () => [
      { position: [-27, 0.02, -26], scale: 0.26, rotation: 0.32 },
      { position: [-18, 0.02, -22], scale: 0.32, rotation: -0.18 },
      { position: [-6, 0.02, -23], scale: 0.3, rotation: 0.08 },
      { position: [8, 0.02, -22], scale: 0.32, rotation: 0.12 },
      { position: [21, 0.02, -24], scale: 0.28, rotation: -0.36 },
      { position: [-28, 0.02, -28], scale: 0.24, rotation: 0.22 },
      { position: [-13, 0.02, -30], scale: 0.25, rotation: -0.28 },
      { position: [2, 0.02, -31], scale: 0.23, rotation: -0.08 },
      { position: [17, 0.02, -30], scale: 0.24, rotation: 0.18 },
      { position: [30, 0.02, -33], scale: 0.21, rotation: -0.22 },
    ],
    [],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.045, 0]} receiveShadow>
        <circleGeometry args={[52, 180]} />
        <meshStandardMaterial color="#788b60" roughness={0.97} metalness={0.01} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-12, -0.035, -20]} scale={[18, 7, 1]} receiveShadow>
        <circleGeometry args={[1, 80]} />
        <meshStandardMaterial color="#8a9a6f" roughness={0.96} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[15, -0.04, -24]} scale={[21, 8, 1]} receiveShadow>
        <circleGeometry args={[1, 80]} />
        <meshStandardMaterial color="#73865f" roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.32, 0.12, 80]} />
        <meshStandardMaterial color="#c4c7bd" roughness={0.72} metalness={0.04} />
      </mesh>
      {trees.map((tree) => (
        <RealisticTree
          key={`${tree.x}-${tree.z}`}
          position={[tree.x, 0, tree.z]}
          scale={tree.scale}
          variant={tree.variant}
        />
      ))}
      {grass.map((tuft) => (
        <GrassTuft
          key={`${tuft.x}-${tuft.z}`}
          position={[tuft.x, 0.13, tuft.z]}
          scale={tuft.scale}
          color={tuft.color}
        />
      ))}
      {farTurbines.map((turbine) => (
        <HorizonTurbine
          key={`${turbine.position[0]}-${turbine.position[2]}`}
          position={turbine.position}
          scale={turbine.scale}
          rotation={turbine.rotation}
        />
      ))}
    </group>
  );
}

function ProfessionalClouds() {
  return (
    <Clouds material={THREE.MeshBasicMaterial} limit={120}>
      <Cloud
        position={[-9, 7.2, -18]}
        scale={[4.8, 1.1, 1.3]}
        segments={24}
        bounds={[4, 1.2, 1]}
        volume={6}
        color="#f4f8f7"
        opacity={0.36}
      />
      <Cloud
        position={[9, 8.1, -24]}
        scale={[6.2, 1.3, 1.5]}
        segments={28}
        bounds={[5, 1.4, 1]}
        volume={7}
        color="#edf5f6"
        opacity={0.28}
      />
      <Cloud
        position={[0, 6.8, -32]}
        scale={[7.8, 1, 1.2]}
        segments={22}
        bounds={[5, 1, 1]}
        volume={5}
        color="#ffffff"
        opacity={0.18}
      />
    </Clouds>
  );
}

function Atmosphere({ power }) {
  const hazeRef = useRef();

  useFrame((state) => {
    if (hazeRef.current) {
      hazeRef.current.rotation.y = state.clock.elapsedTime * 0.012;
      hazeRef.current.material.opacity = 0.13 + power * 0.08;
    }
  });

  return (
    <mesh ref={hazeRef} position={[0, 4, -14]} rotation={[0.3, 0, 0]}>
      <planeGeometry args={[32, 10, 16, 4]} />
      <meshBasicMaterial color="#d7e4e2" transparent opacity={0.15} depthWrite={false} />
    </mesh>
  );
}

function SceneContent({ windData, showStressMap }) {
  const power = windData?.rotorPower ?? windData?.normalizedPower ?? 0.4;
  const rpm = windData?.rpm ?? 12;

  return (
    <>
      <color attach="background" args={['#b8d0dc']} />
      <fog attach="fog" args={['#d8e3df', 24, 62]} />
      <Sky sunPosition={[5.6, 7.8, 2.2]} turbidity={1.8} rayleigh={2.35} mieCoefficient={0.004} />
      <ambientLight intensity={0.62} />
      <directionalLight
        position={[6.4, 9.2, 4.2]}
        intensity={2.25}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.5}
        shadow-camera-far={42}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.00012}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-8, 4, -6]} intensity={0.32} color="#c7e6ff" />
      <WindTurbine rpm={rpm} power={power} showStressMap={showStressMap} mechanical={windData?.mechanical} />
      <LandEnvironment />
      <GroundDataGrid power={power} />
      <HolographicTelemetry power={power} />
      <WindFlowParticles power={power} />
      <SafetyBeacons power={power} />
      <ProfessionalClouds />
      <Atmosphere power={power} />
      <Sparkles count={10} scale={[24, 5, 18]} size={0.65} speed={0.025} opacity={0.06} color="#eef8f4" />
      <Environment preset="dawn" />
      <OrbitControls
        enablePan={false}
        minDistance={7.5}
        maxDistance={17}
        minPolarAngle={Math.PI / 3.7}
        maxPolarAngle={Math.PI / 2.02}
        target={[0, 3.25, 0.1]}
      />
    </>
  );
}

export default function WindTurbineScene({ windData, showStressMap = false }) {
  return (
    <section className="scene-wrap">
      <Canvas
        shadows
        camera={{ position: [8.2, 5.15, 8.4], fov: 38 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <SceneContent windData={windData} showStressMap={showStressMap} />
        </Suspense>
      </Canvas>
    </section>
  );
}


