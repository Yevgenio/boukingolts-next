'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function Terrain() {
  const width = 5000;
  const depth = 5000;

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(width, depth, 1, 1);
  }, []);

  return (
    <mesh 
      geometry={geometry} 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -5, 0]}
      receiveShadow
    >

      <meshStandardMaterial color="green" />
  
    </mesh>
  );
}
