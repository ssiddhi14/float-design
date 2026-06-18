import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

// Individual floating glass box component
function FloatingGlassBox({
  position,
  scale = 1,
  speed = 1,
  offset = 0,
  color = "#ffffff",
  emissive = "#000000",
  emissiveIntensity = 0,
  mouse,
}: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  offset?: number;
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const initialX = position[0];
  const initialY = position[1];

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.elapsedTime * speed + offset;
    
    // Smooth floating movement
    ref.current.position.y = initialY + Math.sin(time) * 0.25;
    
    // Mouse lag/tracking offset
    const mouseTargetX = initialX + mouse.current.x * 0.35;
    const mouseTargetY = ref.current.position.y + mouse.current.y * 0.25;
    
    ref.current.position.x += (mouseTargetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (mouseTargetY - ref.current.position.y) * 0.05;

    // Continuous rotation
    ref.current.rotation.x = time * 0.2;
    ref.current.rotation.y = time * 0.15;
    ref.current.rotation.z = time * 0.1;
  });

  return (
    <mesh ref={ref} position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshPhysicalMaterial
        color={color}
        transmission={0.9}
        thickness={0.8}
        roughness={0.12}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transparent
        opacity={0.85}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
      />
    </mesh>
  );
}

export default function InnovateScene({
  mouse,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  // Define positions for floating cubes (left and right clusters)
  const cubes = [
    // Left cluster (glass arrow style)
    { pos: [-3.2, 0.8, -1], scale: 0.22, speed: 0.8, offset: 0, color: "#ffffff" },
    { pos: [-2.8, 1.2, -1.2], scale: 0.18, speed: 1.1, offset: 1.5, color: "#ffffff" },
    { pos: [-3.5, 0.4, -0.8], scale: 0.2, speed: 0.9, offset: 3.2, color: "#FF6B00", emissive: "#FF6B00", emissiveIntensity: 0.35 },
    { pos: [-2.6, 0.6, -1.5], scale: 0.15, speed: 1.2, offset: 4.8, color: "#ffffff" },

    // Right cluster (glass blob style)
    { pos: [2.8, -0.4, -1], scale: 0.24, speed: 0.75, offset: 0.5, color: "#ffffff" },
    { pos: [3.4, 0.2, -1.2], scale: 0.2, speed: 1.0, offset: 2.2, color: "#FF6B00", emissive: "#FF6B00", emissiveIntensity: 0.35 },
    { pos: [3.0, -0.8, -0.8], scale: 0.18, speed: 0.85, offset: 3.9, color: "#ffffff" },
    { pos: [2.5, -0.2, -1.4], scale: 0.16, speed: 1.3, offset: 5.1, color: "#ffffff" },
  ];

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#FF6B00" />
        
        {cubes.map((cube, i) => (
          <FloatingGlassBox
            key={i}
            position={cube.pos as [number, number, number]}
            scale={cube.scale}
            speed={cube.speed}
            offset={cube.offset}
            color={cube.color}
            emissive={cube.emissive}
            emissiveIntensity={cube.emissiveIntensity}
            mouse={mouse}
          />
        ))}

        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
