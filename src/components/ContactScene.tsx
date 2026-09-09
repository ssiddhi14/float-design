// import { Canvas, useFrame } from "@react-three/fiber";
// import { Environment, MeshTransmissionMaterial, MeshDistortMaterial } from "@react-three/drei";
// import { useRef } from "react";
// import * as THREE from "three";

// function FloatingSphere() {
//   const ref = useRef<THREE.Mesh>(null);
//   useFrame((s) => {
//     if (!ref.current) return;
//     ref.current.position.y = -0.3 + Math.sin(s.clock.elapsedTime * 0.4) * 0.25;
//     ref.current.rotation.y = s.clock.elapsedTime * 0.12;
//   });
//   return (
//     <mesh ref={ref} position={[3.2, -0.3, 0.8]}>
//       <sphereGeometry args={[0.9, 64, 64]} />
//       <MeshTransmissionMaterial
//         backside samples={6} thickness={0.7} roughness={0.03}
//         chromaticAberration={0.08} color="#dce8f8"
//         distortion={0.15} distortionScale={0.2}
//         temporalDistortion={0.06} transmissionSampler
//       />
//     </mesh>
//   );
// }

// function OrangeBlob() {
//   const ref = useRef<THREE.Mesh>(null);
//   useFrame((s) => {
//     if (!ref.current) return;
//     ref.current.position.y = 0.8 + Math.cos(s.clock.elapsedTime * 0.35) * 0.3;
//     ref.current.position.x = -3.0 + Math.sin(s.clock.elapsedTime * 0.25) * 0.1;
//     ref.current.rotation.z = s.clock.elapsedTime * 0.1;
//   });
//   return (
//     <mesh ref={ref} position={[-3.0, 0.8, 0.5]}>
//       <sphereGeometry args={[0.7, 64, 64]} />
//       <MeshDistortMaterial
//         color="#FF6B00" metalness={0.2} roughness={0.2}
//         emissive="#FF4500" emissiveIntensity={0.3}
//         distort={0.38} speed={1.8}
//       />
//     </mesh>
//   );
// }

// function ChromeTorus() {
//   const ref = useRef<THREE.Mesh>(null);
//   useFrame((s) => {
//     if (!ref.current) return;
//     ref.current.rotation.x = s.clock.elapsedTime * 0.22;
//     ref.current.rotation.y = s.clock.elapsedTime * 0.18;
//     ref.current.position.y = 0.1 + Math.sin(s.clock.elapsedTime * 0.5 + 1) * 0.18;
//   });
//   return (
//     <mesh ref={ref} position={[1.2, 0.1, -0.8]}>
//       <torusKnotGeometry args={[0.55, 0.18, 160, 24]} />
//       <meshStandardMaterial color="#b0c8e0" metalness={0.97} roughness={0.05} envMapIntensity={2.2} />
//     </mesh>
//   );
// }

// function SmallRing() {
//   const ref = useRef<THREE.Mesh>(null);
//   useFrame((s) => {
//     if (!ref.current) return;
//     ref.current.rotation.x = s.clock.elapsedTime * 0.4;
//     ref.current.rotation.z = s.clock.elapsedTime * 0.28;
//     ref.current.position.y = -1.0 + Math.sin(s.clock.elapsedTime * 0.6 + 2) * 0.14;
//   });
//   return (
//     <mesh ref={ref} position={[-1.8, -1.0, 1.2]}>
//       <torusGeometry args={[0.32, 0.08, 32, 80]} />
//       <meshStandardMaterial color="#98b4cc" metalness={0.99} roughness={0.03} envMapIntensity={2.5} />
//     </mesh>
//   );
// }

// export default function ContactScene() {
//   return (
//     <Canvas
//       dpr={[1, 2]}
//       camera={{ position: [0, 0, 6], fov: 42 }}
//       gl={{ antialias: true, alpha: true }}
//       style={{ width: "100%", height: "100%" }}
//     >
//       <ambientLight intensity={0.45} />
//       <directionalLight position={[6, 8, 4]} intensity={1.4} />
//       <directionalLight position={[-5, 2, -4]} intensity={0.6} color="#a0c0ff" />
//       <pointLight position={[-2, 3, 2]} intensity={1.1} color="#FF6B00" />
//       <FloatingSphere />
//       <OrangeBlob />
//       <ChromeTorus />
//       <SmallRing />
//       <Environment preset="studio" />
//     </Canvas>
//   );
// }
