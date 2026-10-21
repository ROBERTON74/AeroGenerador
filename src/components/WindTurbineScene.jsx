import { Cloud, Clouds, Environment, OrbitControls, Sky, Sparkles } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import WindTurbine from './WindTurbine.jsx';
import BlenderWindTurbine from './BlenderWindTurbine.jsx';
import OffshoreMonopile from './OffshoreMonopile.jsx';
import BlenderSea from './BlenderSea.jsx';
import AerodynamicOverlay from './AerodynamicOverlay.jsx';
import { Html } from '@react-three/drei';
import { Component } from 'react';

class TurbineModelBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <>
      {this.props.fallback}
      <Html center position={[0,7.2,0]}><p role="status" style={{width:250,padding:12,background:'#15313be8',color:'#fff',borderRadius:8,fontSize:12}}>No se pudo cargar el modelo de Blender. Se muestra el modelo de respaldo; recarga para intentarlo de nuevo.</p></Html>
    </>;
  }
}

function AnimatedSea() {
  // Mar procedural: mueve vertices de la malla para evitar que parezca una placa de cristal.
  const seaRef = useRef();
  const foamRef = useRef();
  const basePositions = useRef(null);
  const foamLines = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, index) => {
        const angle = index * 2.17;
        const radius = 5 + ((index * 11) % 46);
        return {
          x: Math.cos(angle) * radius,
          z: Math.sin(angle) * radius - 4,
          rotation: angle + Math.PI / 2,
          width: 0.75 + (index % 7) * 0.24,
          opacity: 0.1 + (index % 5) * 0.035,
          speed: 0.08 + (index % 6) * 0.018,
        };
      }),
    [],
  );

  useFrame((state) => {
    // Cada frame modifica la altura de cada vertice y recalcula normales para reflejos suaves.
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
        Math.sin(x * 0.34 + elapsed * 1.08) * 0.11 +
        Math.cos(y * 0.29 + elapsed * 0.82) * 0.075 +
        Math.sin((x + y) * 0.13 + elapsed * 0.46) * 0.045;
    }
    position.needsUpdate = true;
    geometry.computeVertexNormals();

    if (foamRef.current) {
      foamRef.current.children.forEach((line, index) => {
        line.position.x += foamLines[index].speed * 0.018;
        line.position.z += Math.sin(elapsed * 0.35 + index) * 0.0015;
        if (line.position.x > 54) {
          line.position.x = -54;
        }
      });
    }
  });

  return (
    <group>
      <mesh ref={seaRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <planeGeometry args={[115, 115, 156, 156]} />
        <meshPhysicalMaterial
          color="#0d6f83"
          roughness={0.62}
          metalness={0.02}
          transmission={0}
          thickness={0.45}
          transparent
          opacity={0.96}
          clearcoat={0.28}
          clearcoatRoughness={0.72}
        />
      </mesh>
      <group ref={foamRef}>
        {foamLines.map((line, index) => (
          <mesh
            key={`${line.x}-${line.z}`}
            position={[line.x, 0.018, line.z]}
            rotation={[-Math.PI / 2, 0, line.rotation]}
          >
            <planeGeometry args={[line.width, 0.035, 1, 1]} />
            <meshBasicMaterial
              color="#d7fbf4"
              transparent
              opacity={line.opacity}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function DistantTurbine({ position, scale = 1, rotation = 0 }) {
  // Turbina de fondo simplificada para dar escala al parque offshore.
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
  // Variante que reutiliza el aerogenerador completo cuando se necesita mas detalle en horizonte.
  return (
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      <WindTurbine rpm={5} power={0.18} />
    </group>
  );
}

function MaintenanceWorker() {
  // Figura pequena de operario para reforzar escala humana y contexto de mantenimiento.
  return (
    <group position={[0.28, 0.49, -0.12]} rotation={[0, -0.88, 0]} scale={0.055}>
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
  // Cable curvo generado con CatmullRom para lineas submarinas o amarres.
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
  // Cable flotante con segmentos alternos para que se lea visualmente sobre el mar.
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
  // Corte submarino didactico: muestra fondo, agua translucida, cables y referencias de escala.
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
  // Barco de servicio que aporta contexto offshore y movimiento visual mediante estela.
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

function OffshoreEnvironment({ reducedMotion }) {
  // Entorno principal actual: mar, cimentacion, barco, cables, espuma y turbinas lejanas.
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
      <BlenderSea fallback={<AnimatedSea />} reducedMotion={reducedMotion} />
      <OffshoreMonopile />
      <MaintenanceWorker />
      <UnderwaterCutaway />
      <ServiceBoat />
      <DistantTurbine position={[-17, 0.02, -26]} scale={0.92} rotation={0.3} />
      <DistantTurbine position={[19, 0.02, -31]} scale={0.78} rotation={-0.35} />
      <DistantTurbine position={[2, 0.02, -36]} scale={0.66} rotation={0.14} />
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.245, 0.34, 96]} />
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
  // Recurso del entorno terrestre anterior; se conserva por compatibilidad/rollback visual.
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
  // Hierba procedural del rollback terrestre.
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
  // Rejilla holografica tenue que refuerza lectura tecnica sin tapar el mar.
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
  // Aros tecnicos alrededor de la turbina para dar sensacion de monitorizacion SCADA.
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
  // Particulas de viento: su velocidad aumenta con la potencia normalizada.
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
    // Mueve las particulas en X para simular flujo continuo atravesando el rotor.
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
  // Baliza de seguridad en gondola con pulso visual dependiente de la potencia.
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
  // Entorno terrestre anterior: no se monta en la escena actual, queda como referencia/rollback.
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
  // Nubes ligeras de Drei para profundidad atmosferica sin cargar demasiado la escena.
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
  // Capa de bruma suave: da distancia y cambia ligeramente con la potencia.
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

function CameraControls({ cameraView, cameraRevision, autoRotate, reducedMotion }) {
  const controls = useRef();
  const transition = useRef(null);
  const { camera, size } = useThree();
  useEffect(() => {
    const fatigueViews = {
      del: { target: [0,6.2,.25], position: [4.6,7.1,7.9] },
      'del-nacelle': { target: [0,6.24,-.18], position: [-4.5,7.3,-4.8] },
      'del-base': { target: [0,.5,0], position: [1.8,1.25,2.15] },
      base: { target: [0,.5,0], position: [1.8,1.25,2.15] },
      predictivo: { target: [0,6.24,-.18], position: [-4.5,7.3,-4.8] },
      'predictivo-palas': { target: [0,6.2,.25], position: [4.6,7.1,7.9] },
      'predictivo-base': { target: [0,.5,0], position: [1.8,1.25,2.15] },
      rainflow: { target: [0,6.2,.25], position: [4.6,7.1,8.9] },
    };
    const fatigue = fatigueViews[cameraView];
    const target = new THREE.Vector3(...(fatigue?.target ?? (cameraView === 'rotor' ? [0, 6.24, 0.31] : [0, 4.7, 0.1])));
    const fitDistance = Math.max(17.3, 9.4 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * (size.width / size.height)));
    const position = fatigue ? new THREE.Vector3(...fatigue.position) : cameraView === 'rotor' ? new THREE.Vector3(5.3, 7.5, 5.3) : target.clone().addScaledVector(new THREE.Vector3(.64,.14,.77).normalize(), fitDistance);
    if (fatigue && size.width < 640) position.sub(target).multiplyScalar(1.35).add(target);
    if (reducedMotion && controls.current) {
      camera.position.copy(position);
      controls.current.target.copy(target);
      controls.current.update();
    } else transition.current = { position, target, remaining: 1.8 };
  }, [cameraView, cameraRevision, reducedMotion, camera, size.width, size.height]);
  useFrame((_, delta) => {
    if (!transition.current || !controls.current) return;
    const { position, target } = transition.current;
    const blend = 1 - Math.exp(-delta * 5);
    camera.position.lerp(position, blend);
    controls.current.target.lerp(target, blend);
    controls.current.update();
    transition.current.remaining -= delta;
    if (camera.position.distanceTo(position) < 0.01 || transition.current.remaining <= 0) transition.current = null;
  });
  return <OrbitControls ref={controls} enablePan={false} enableDamping dampingFactor={0.06}
    autoRotate={autoRotate} autoRotateSpeed={0.65} minDistance={['base','del-base','predictivo-base'].includes(cameraView) ? 1.5 : 4.5} maxDistance={40}
    minPolarAngle={Math.PI / 3.7} maxPolarAngle={Math.PI / 2.02} target={[0, 3.25, 0.1]}
    onStart={() => { transition.current = null; }} />;
}

function SceneContent({ windData, showStressMap, showDelMap, ...cameraProps }) {
  // Une datos, luces, entorno offshore, aerogenerador y controles de camara.
  const power = windData?.rotorPower ?? windData?.normalizedPower ?? 0.4;
  const rpm = windData?.rpm ?? 12;
  const inspectionView = cameraProps.cameraView?.startsWith('predictivo') ? cameraProps.cameraView : '';

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
      <TurbineModelBoundary fallback={<WindTurbine rpm={rpm} power={power} showStressMap={showStressMap} mechanical={windData?.mechanical} />}>
        <Suspense fallback={<Html center position={[0,4.5,0]}><p role="status" style={{padding:12,background:'#15313be8',color:'#fff',borderRadius:8,whiteSpace:'nowrap'}}>Cargando modelo de Blender…</p></Html>}>
          <BlenderWindTurbine rpm={rpm} power={power} showStressMap={showStressMap} showDelMap={showDelMap} inspectionView={inspectionView} mechanical={windData?.mechanical} scada={windData?.scada} />
        </Suspense>
      </TurbineModelBoundary>
      {cameraProps.cameraView === 'rainflow' ? <AerodynamicOverlay yaw={windData?.scada?.yawMisalignmentDeg ?? 0} reducedMotion={cameraProps.reducedMotion} /> : null}
      <OffshoreEnvironment reducedMotion={cameraProps.reducedMotion} />
      <GroundDataGrid power={power} />
      <HolographicTelemetry power={power} />
      <WindFlowParticles power={power} />
      <ProfessionalClouds />
      <Atmosphere power={power} />
      <Sparkles count={10} scale={[24, 5, 18]} size={0.65} speed={0.025} opacity={0.06} color="#eef8f4" />
      <Environment preset="dawn" />
      <CameraControls {...cameraProps} />
    </>
  );
}

export default function WindTurbineScene({ windData, showStressMap = false, ...cameraProps }) {
  // Canvas principal de Three.js; queda dentro de scene-wrap para que CSS controle responsive.
  return (
    <section className="scene-wrap">
      <Canvas
        shadows
        camera={{ position: [8.2, 5.15, 8.4], fov: 38 }}
        dpr={[1, 1.8]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      >
        <Suspense fallback={null}>
          <SceneContent windData={windData} showStressMap={showStressMap} {...cameraProps} />
        </Suspense>
      </Canvas>
    </section>
  );
}
