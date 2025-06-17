'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';



const deg = (d: number) => (d * Math.PI) / 180;

const Plane = () => {
  const propellerRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (propellerRef.current) {
      propellerRef.current.rotation.z += 0.3;
    }
  });

  return (
    <group rotation={[0, deg(90), 0]} >
      <mesh rotation={[0, 0, deg(90)]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 2, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <mesh position={[0, 0, 0]} rotation={[0, deg(90), 0]} castShadow>
        <boxGeometry args={[2, 0.05, 0.3]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.9, 0.1, 0]} rotation={[0, deg(90), 0]}>
        <boxGeometry args={[0.5, 0.05, 0.15]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <mesh position={[-0.95, 0.25, 0]} >
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="yellow" />
      </mesh>
      <mesh
        ref={propellerRef}
        position={[1.2, 0, 0]}
        rotation={[0, deg(90), 0]}>
        <boxGeometry args={[0.05, 0.5, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
};

export default Plane;
