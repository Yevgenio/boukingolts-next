// components/game/Bullet.tsx
'use client';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface BulletProps {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  onExpire: () => void;
}

export default function Bullet({ position, direction, onExpire }: BulletProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const speed = 3;
  const velocity = direction.clone().normalize().multiplyScalar(speed);
  const bulletPos = useRef(position.clone()); 
  const startTime = useRef(performance.now());

  useFrame(() => {
    if (!meshRef.current) return;

    // Update bullet position
    bulletPos.current.add(velocity);
    meshRef.current.position.copy(bulletPos.current);

    if (performance.now() - startTime.current > 3000) {
      onExpire();
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshStandardMaterial color="red" emissive="red" />
    </mesh>
  );
}
