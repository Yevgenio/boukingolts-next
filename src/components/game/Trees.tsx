'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function Trees({ count = 200 }: { count?: number }) {
  const trees = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: [
        THREE.MathUtils.randFloatSpread(1000), // X
        -5,                                    // Y (ground level)
        THREE.MathUtils.randFloatSpread(1000), // Z
      ] as [number, number, number],
    }));
  }, [count]);

  return (
    <>
      {trees.map((tree, i) => (
        <group key={i} position={tree.position} >
          {/* Brown stem */}
          <mesh position={[0, 1, 0]} castShadow >
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial color="saddlebrown" />
          </mesh>
          {/* Green foliage */}
          <mesh position={[0, 2.5, 0]} castShadow>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="green" />
          </mesh>
        </group>
      ))}
    </>
  );
}
