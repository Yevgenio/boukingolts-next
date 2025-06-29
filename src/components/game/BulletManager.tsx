// components/game/BulletManager.tsx
'use client';
import { useState, useCallback } from 'react';
import * as THREE from 'three';
import Bullet from './Bullet';

export default function BulletManager() {
  const [bullets, setBullets] = useState<
    { id: number; position: THREE.Vector3; direction: THREE.Vector3 }[]
  >([]);

  const fireBullet = useCallback((pos: THREE.Vector3, dir: THREE.Vector3) => {
    setBullets((prev) => [
      ...prev,
      {
        id: Date.now(),
        position: pos.clone(),
        direction: dir.clone().normalize(),
      },
    ]);
  }, []);

  const removeBullet = useCallback((id: number) => {
    setBullets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    fireBullet,
    Bullets: (
      <>
        {bullets.map((b) => (
          <Bullet
            key={b.id}
            position={b.position}
            direction={b.direction}
            onExpire={() => removeBullet(b.id)}
          />
        ))}
      </>
    ),
  };
}
