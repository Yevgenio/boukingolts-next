// // components/home/Menu3D.tsx
// 'use client';

// import { useRef, useState, useEffect } from 'react';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Text, useCursor } from '@react-three/drei';
// import { useRouter } from 'next/navigation';
// import * as THREE from 'three';

// function MenuButton({ label, route, position, delay }: { label: string; route: string; position: [number, number, number]; delay: number }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const meshRef = useRef<THREE.Mesh>(null);
//   const textRef = useRef<any>(null);
//   const [hovered, setHovered] = useState(false);
//   const [clicked, setClicked] = useState(false);
//   //const [rotation, setRotation] = useState(0);
//   const [introProgress, setIntroProgress] = useState(0);
//   const [introDelay, setIntroDelay] = useState(0);
//   const router = useRouter();
//   const [velocity, setVelocity] = useState(0);

//   useCursor(hovered);

//   useFrame((state, delta) => {
//     const scale = hovered ? 1 + Math.sin(state.clock.elapsedTime * 10) / 50 : 1;
//     if (meshRef.current) meshRef.current.scale.setScalar(scale);
//     if (textRef.current) textRef.current.scale.setScalar(scale);

//     // if (hovered && groupRef.current) {
//     //   setRotation((prev) => {
//     //     const next = prev + 0.2;
//     //     if (next >= Math.PI * 2) {
//     //       setHovered(false);
//     //       groupRef.current!.rotation.x = 0;
//     //       return 0;
//     //     }
//     //     if (groupRef.current) groupRef.current.rotation.x = next;
//     //     return next;
//     //   });
//     // }

//     // if (introDelay < delay) {
//     //   setIntroDelay((prev) => prev + delta);
//     //   return;
//     // }

//     // if (groupRef.current && introProgress < 1) {
//     //   setIntroProgress((prev) => {
//     //     const next = Math.min(prev + delta * 1.5, 1);
//     //     const angle = THREE.MathUtils.lerp(Math.PI /2, 0, next);
//     //     const radius = 1;
//     //     groupRef.current!.position.x = radius * Math.cos(angle);
//     //     groupRef.current!.position.z = radius * Math.sin(angle);
//     //     groupRef.current!.position.y = position[1];
//     //     groupRef.current!.rotation.y = -angle;
//     //     return next;
//     //   });
//     // }

//     // Delay start
//   if (introDelay < delay) {
//     setIntroDelay((prev) => prev + delta);
//     if (groupRef.current) groupRef.current.visible = false;
//     return;
//   } else if (groupRef.current && !groupRef.current.visible) {
//     groupRef.current.visible = true; // prevent teleport flicker
//   }

//   // Spring animation
//   if (groupRef.current && introProgress < 1) {
//     const target = 1;
//     const stiffness = 20;
//     const damping = 6;

//     setIntroProgress((prev) => {
//       const force = stiffness * (target - prev);
//       const damp = -damping * velocity;
//       const accel = force + damp;
//       const newVelocity = velocity + accel * delta;
//       const newPos = prev + newVelocity * delta;

//       setVelocity(newVelocity);

//       // Rotation angle
//       const angle = THREE.MathUtils.lerp(Math.PI / 2, 0, newPos);
//       const radius = 1;
//       groupRef.current!.position.x = radius * Math.cos(angle);
//       groupRef.current!.position.z = radius * Math.sin(angle);
//       groupRef.current!.position.y = position[1];
//       groupRef.current!.rotation.y = -angle;

//       return newPos >= 0.999 ? 1 : newPos;
//     });
//   }
//   });

//   return (
//     <group
//       ref={groupRef}
//       position={[0, position[1], 1]}
//       onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
//       onPointerOut={() => setHovered(false)}
//       onClick={(e) => { e.stopPropagation(); setClicked(!clicked); router.push(route); }}
//       scale={1.2}
//       visible={false}
//     >
//       <mesh ref={meshRef} receiveShadow castShadow>
//         <boxGeometry args={[2, 1, 0.2]} />
//         <meshStandardMaterial
//           roughness={1}
//           transparent
//           opacity={0.6}
//           color={clicked ? 'lightblue' : hovered ? 'aquamarine' : 'white'}
//         />
//       </mesh>
//       <Text
//         ref={textRef}
//         position={[0, 0, 0.12]}
//         fontSize={0.3}
//         color="black"
//         anchorX="center"
//         anchorY="middle"
//       >
//         {label}
//       </Text>
//     </group>
//   );
// }

// export default function Menu3D() {
//   return (
//     <Canvas camera={{ position: [0, 0, 10], fov: 50 }} shadows>
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[5, 5, 5]} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
//       <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]}>
//         <planeGeometry args={[20, 20]} />
//         <shadowMaterial opacity={0.2} />
//       </mesh>

//       <MenuButton label="Gallery" route="/gallery" position={[0, 2, 0]} delay={0} />
//       <MenuButton label="About" route="/about" position={[0, 0, 0]} delay={0.2} />
//       <MenuButton label="Shop" route="/shop" position={[0, -2, 0]} delay={0.4} />
//       <MenuButton label="Blog" route="/blog" position={[0, -4, 0]} delay={0.6} />
//       <MenuButton label="Contact" route="/contact" position={[0, -6, 0]} delay={0.8} />
//     </Canvas>
//   );
// }
