'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

interface Blob {
  offset: [number, number, number];
  size: number;
}

interface Cloud {
  position: [number, number, number];
  blobs: Blob[];
}

export default function Clouds({ count = 40 }: { count?: number }) {
  const clouds = useMemo<Cloud[]>(() => {
    return Array.from({ length: count }, () => {
      const blobCount = THREE.MathUtils.randInt(4, 8); // slightly more blobs

      const blobs: Blob[] = Array.from({ length: blobCount }, () => ({
        offset: [
          THREE.MathUtils.randFloatSpread(16),       // wider x spread
          THREE.MathUtils.randFloatSpread(4),        // taller range
          THREE.MathUtils.randFloatSpread(10),       // deeper z spread
        ],
        size: THREE.MathUtils.randFloat(3, 7),        // larger blobs
      }));

      return {
        position: [
          THREE.MathUtils.randFloatSpread(1000),
          THREE.MathUtils.randFloat(30, 70),           // slightly higher sky
          THREE.MathUtils.randFloatSpread(1000),
        ],
        blobs,
      };
    });
  }, [count]);

  return (
    <>
      {clouds.map((cloud, i) => (
        <group key={i} position={cloud.position}>
          {cloud.blobs.map((blob, j) => (
            <mesh key={j} position={blob.offset}>
              <sphereGeometry args={[blob.size, 10, 10]} />
              <meshStandardMaterial color="white" transparent opacity={0.85} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  );
}
