// components/game/LightsAndSky.tsx
'use client';
import * as THREE from 'three';

export default function LightsAndSky() {
  return (
    <>
      <color attach="background" args={['skyblue']} />
      <ambientLight intensity={0.8} />
      <directionalLight
        castShadow
        position={[50, 100, -500]}
        intensity={1.2}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-camera-near={1}
        shadow-camera-far={1000}
      />
      <mesh position={[50, 100, -500]}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={1.5} />
      </mesh>
    </>
  );
}
