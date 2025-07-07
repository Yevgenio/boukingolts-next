// // components/home/R3FScrollGallery.tsx
// 'use client';

// import * as THREE from 'three';
// import { Suspense, useRef, useState } from 'react';
// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { Preload, ScrollControls, Scroll, useScroll, Image as DreiImage } from '@react-three/drei';

// // Type for Image component props
// interface CustomImageProps {
//   url: string;
//   position: [number, number, number];
//   scale: [number, number] | number;
//   c?: THREE.Color;
// }

// // Interactive Image Component
// function Image({ c = new THREE.Color(), ...props }: CustomImageProps) {
//   const ref = useRef<any>();
//   const [hovered, hover] = useState(false);

//   useFrame(() => {
//     if (ref.current) {
//       ref.current.material.color.lerp(c.set(hovered ? 'white' : '#ccc'), hovered ? 0.4 : 0.05);
//     }
//   });

//   return (
//     <DreiImage
//       ref={ref}
//       onPointerOver={() => hover(true)}
//       onPointerOut={() => hover(false)}
//       {...props}
//     />
//   );
// }

// // Image Layout & Scroll Animation
// function Images() {
//   const { width, height } = useThree((state) => state.viewport);
//   const data = useScroll();
//   const group = useRef<any>();

//   useFrame(() => {
//     if (!group.current) return;
//     const [a, b, c, d, e, f, g] = group.current.children;
//     a.material.zoom = 1 + data.range(0, 1 / 3) / 3;
//     b.material.zoom = 1 + data.range(0, 1 / 3) / 3;
//     c.material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 3;
//     d.material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
//     e.material.zoom = 1 + data.range(1.25 / 3, 1 / 3) / 1;
//     f.material.zoom = 1 + data.range(1.8 / 3, 1 / 3) / 3;
//     f.material.grayscale = 1 - data.range(1.6 / 3, 1 / 3);
//     g.material.zoom = 1 + (1 - data.range(2 / 3, 1 / 3)) / 3;
//   });

//   return (
//     <group ref={group}>
//       <Image position={[-2, 0, 0]} scale={[4, height]} url="/img1.jpg" /> {/* Table chair */}
//       <Image position={[2, 0, 1]} scale={3} url="/img6.jpg" /> {/* yellow chair */}
//       <Image position={[-2.3, -height, 2]} scale={[1, 3]} url="/trip2.jpg" /> {/* 2 lamps */}
//       <Image position={[-0.6, -height, 3]} scale={[1, 2]} url="/img8.jpg" /> {/* grey sofa salon */}
//       <Image position={[0.75, -height, 3.5]} scale={1.5} url="/trip4.jpg" /> {/* window salon */}
//       <Image position={[0, -height * 1.5, 2.5]} scale={[1.5, 3]} url="/img3.jpg" /> {/* hanging lamps */}
//       <Image position={[0, -height * 2 - height / 4, 0]} scale={[width, height / 2]} url="/img7.jpg" /> {/* blue room */}
//     </group>
//   );
// }

// // Main Gallery Export
// export default function R3FScrollGallery() {
//   return (
//     <Canvas gl={{ antialias: false }} dpr={[1, 1.5]}>
//       <Suspense fallback={null}>
//         <ScrollControls damping={1} pages={3}>
//           <Scroll>
//             <Images />
//           </Scroll>
//           <Scroll html>
//             <h1 style={{ position: 'absolute', top: '50vh', left: '0.5em', fontSize: '20vw' }}>Art</h1>
//             <h1 style={{ position: 'absolute', top: '120vh', left: '50vw', fontSize: '10vw' }}>Design</h1>
//             <h1 style={{ position: 'absolute', top: '198.5vh', left: '0.5vw', fontSize: '30vw' }}>Code</h1>
//           </Scroll>
//         </ScrollControls>
//         <Preload />
//       </Suspense>
//     </Canvas>
//   );
// }
