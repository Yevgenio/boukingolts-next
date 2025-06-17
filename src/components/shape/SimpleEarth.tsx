'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const Earth = () => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Earth Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="skyblue" />
      </mesh>

      {/* Continent 1 (simple blob) */}
      <mesh position={[0.7, 0.2, 0.6]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {/* Continent 2 */}
      <mesh position={[0, -0.5, 0.5]}
      rotation={[1, 0, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial color="green" />
      </mesh>

      {/* Continent 3 */}
      <mesh position={[0.2, -0.4, -0.9]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="green" />
      </mesh>
    </group>
  );
};

const SimpleEarth = () => {
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <Earth />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default SimpleEarth;