import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function CameraRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.08) * 0.45;
    camera.position.y = Math.cos(t * 0.1) * 0.25;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const particleCount = 1800;
    const data = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 8 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      data[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.7;
      data[i * 3 + 2] = radius * Math.cos(phi);
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current || !pointMaterialRef.current) {
      return;
    }
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.y = t * 0.02;
    pointsRef.current.rotation.x = Math.sin(t * 0.07) * 0.05;
    pointMaterialRef.current.size = 0.035 + Math.sin(t * 0.9) * 0.006;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={pointMaterialRef}
        color="#6ff9ff"
        size={0.035}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function EnergySystem() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) {
      return;
    }
    const t = clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.24;
    groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial color="#64f5ff" emissive="#2fe7ff" emissiveIntensity={2.2} metalness={0.5} roughness={0.15} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[1.7, 0.028, 20, 180]} />
        <meshBasicMaterial color="#3bf3ff" transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 2]}>
        <torusGeometry args={[2.25, 0.02, 20, 180]} />
        <meshBasicMaterial color="#3fffb6" transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, Math.PI / 5, 0]}>
        <torusGeometry args={[2.85, 0.018, 20, 200]} />
        <meshBasicMaterial color="#00d6ff" transparent opacity={0.4} />
      </mesh>
      <Float speed={2} floatIntensity={1.5} rotationIntensity={0.6}>
        <mesh position={[2.6, 0.2, -0.4]}>
          <sphereGeometry args={[0.11, 24, 24]} />
          <meshStandardMaterial color="#53f7ff" emissive="#20ecff" emissiveIntensity={2.2} />
        </mesh>
      </Float>
      <Float speed={2.3} floatIntensity={1.7} rotationIntensity={0.6}>
        <mesh position={[-2.1, -0.6, 0.9]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshStandardMaterial color="#7dffd2" emissive="#32ffc8" emissiveIntensity={1.8} />
        </mesh>
      </Float>
      <Float speed={1.8} floatIntensity={1.4} rotationIntensity={0.8}>
        <mesh position={[0.6, 1.8, -1.2]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <meshStandardMaterial color="#6ff3ff" emissive="#37e6ff" emissiveIntensity={2} />
        </mesh>
      </Float>
    </group>
  );
}

export default function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 52, near: 0.1, far: 100, position: [0, 0, 9.5] }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#01070f"]} />
        <fog attach="fog" args={["#02111d", 10, 28]} />
        <ambientLight intensity={0.25} />
        <pointLight position={[6, 4, 5]} intensity={2.4} color="#39f0ff" />
        <pointLight position={[-6, -3, 2]} intensity={1.1} color="#2fffb8" />
        <directionalLight position={[0, 5, 5]} intensity={0.5} color="#9efbff" />
        <ParticleField />
        <EnergySystem />
        <CameraRig />
      </Canvas>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(17,190,218,0.14)_0%,rgba(4,18,31,0.78)_55%,rgba(0,0,0,0.94)_100%)]" />
    </div>
  );
}