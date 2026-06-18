import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function PrinterPen({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.35;
    const targetX = mouse.current.y * 0.25;
    const targetZ = mouse.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.3, 0.6, -0.4]}>
      {/* Pen body */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 2.4, 64]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Orange accent ring */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.37, 0.37, 0.18, 64]} />
        <meshStandardMaterial color="#FF6B00" metalness={0.6} roughness={0.3} emissive="#FF6B00" emissiveIntensity={0.15} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.38, 0.36, 0.25, 64]} />
        <meshStandardMaterial color="#2D2D2D" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Nozzle */}
      <mesh position={[0, -1.35, 0]}>
        <coneGeometry args={[0.35, 0.6, 64]} />
        <meshStandardMaterial color="#c9c9c9" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Extruded filament */}
      <mesh position={[0, -1.85, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.5, 32]} />
        <meshStandardMaterial color="#FF6B00" emissive="#FF6B00" emissiveIntensity={0.4} />
      </mesh>
      {/* Button */}
      <mesh position={[0.37, 0.05, 0]}>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial color="#FF6B00" metalness={0.4} roughness={0.4} />
      </mesh>
    </group>
  );
}

function PixelArrow({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = -3.5 + mouse.current.x * 0.35;
    // Organic floating on Y axis using sine wave
    ref.current.position.y = 0.5 + mouse.current.y * 0.25 + Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
  });
  const cubes: Array<[number, number]> = [
    [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
    [3, 1], [4, 1],
    [3, -1], [4, -1],
    [2, 2], [3, 2],
    [2, -2], [3, -2],
  ];
  return (
    <group ref={ref} position={[-3.5, 0.5, -1]} scale={0.18}>
      {cubes.map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.95, 0.95, 0.95]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.9}
            thickness={0.8}
            roughness={0.12}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}

function PixelBlob({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = 3.4 + mouse.current.x * 0.35;
    // Organic floating on Y axis using cosine wave
    ref.current.position.y = -0.3 + mouse.current.y * 0.25 + Math.cos(state.clock.elapsedTime * 0.6) * 0.18;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.rotation.x = state.clock.elapsedTime * 0.08;
  });
  return (
    <group ref={ref} position={[3.4, -0.3, -1]} scale={0.22}>
      {[
        [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
        [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
        [2, 0, 0], [2, 1, 0], [-1, 0, 0], [0, -1, 0],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <boxGeometry args={[0.92, 0.92, 0.92]} />
          {i % 3 === 0 ? (
            // Glowing orange glass
            <meshPhysicalMaterial
              color="#FF6B00"
              transmission={0.8}
              thickness={0.8}
              roughness={0.15}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              transparent
              opacity={0.85}
              emissive="#FF6B00"
              emissiveIntensity={0.3}
            />
          ) : (
            // Clear glass
            <meshPhysicalMaterial
              color="#ffffff"
              transmission={0.9}
              thickness={0.8}
              roughness={0.12}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              transparent
              opacity={0.85}
            />
          )}
        </mesh>
      ))}
    </group>
  );
}

function GlassPlatform() {
  return (
    <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[1.4, 1.6, 0.12, 64]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={0.9}
        thickness={0.5}
        roughness={0.15}
        metalness={0.1}
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

export default function HeroScene({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#FF6B00" />
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
          <PrinterPen mouse={mouse} />
        </Float>
        <PixelArrow mouse={mouse} />
        <PixelBlob mouse={mouse} />
        <GlassPlatform />
        <ContactShadows
          position={[0, -2.35, 0]}
          opacity={0.35}
          scale={6}
          blur={2.4}
          far={4}
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
