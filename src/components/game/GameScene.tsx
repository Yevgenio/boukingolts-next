'use client';

import { Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import Plane from './CartoonPlane'; // from your uploaded file

const NUM_OBSTACLES = 50;

const RandomObstacles = () => {
  const groupRef = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    return new Array(NUM_OBSTACLES).fill(0).map(() => ({
      position: [
        THREE.MathUtils.randFloatSpread(100), // x between -50 and 50
        THREE.MathUtils.randFloatSpread(30),  // y between -15 and 15
        THREE.MathUtils.randFloatSpread(100), // z between -50 and 50
      ] as [number, number, number],
      size: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  return (
    <group ref={groupRef}>
      {positions.map((p, i) => (
        <mesh key={i} position={p.position}>
          <boxGeometry args={[p.size, p.size, p.size]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ))}
    </group>
  );
};

const GameScene = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Plane />
        <RandomObstacles />
      </Canvas>
    </div>
  );
};

export default GameScene;
