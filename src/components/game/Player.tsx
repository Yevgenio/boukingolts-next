// components/game/Player.tsx
'use client';
import { useRef , useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Plane from './CartoonPlane';
import useKeyboardControls from './useKeyboardControls';

const Player = ({
  obstacleRefs,
  onScore,
  onUpdatePosition,
  planeRef,
  onFire,
}: {
  obstacleRefs: React.RefObject<THREE.Mesh>[];
  onScore: () => void;
  onUpdatePosition: (pos: THREE.Vector3) => void;
  planeRef: React.RefObject<THREE.Group>;
  onFire: (pos: THREE.Vector3, dir: THREE.Vector3) => void;
}) => {
  const keys = useKeyboardControls();
  const hitSet = useRef(new Set());
  const lastShotTime = useRef(0);

  useFrame(() => {
    if (!planeRef.current) return;
    const plane = planeRef.current;

    const moveSpeed = 0.5;
    const rotSpeed = 0.05;
    const q = new THREE.Quaternion();
    const localAxis = new THREE.Vector3();

    // Rotation controls (roll, yaw, pitch)
    if (keys.rollLeft) {
      localAxis.set(0, 0, 1).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.rollRight) {
      localAxis.set(0, 0, 1).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, -rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.yawLeft) {
      localAxis.set(0, 1, 0).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.yawRight) {
      localAxis.set(0, 1, 0).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, -rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.up) {
      localAxis.set(1, 0, 0).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, -rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.down) {
      localAxis.set(1, 0, 0).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, rotSpeed);
      plane.quaternion.premultiply(q);
    }

    const now = performance.now();

    if (keys.shoot && now - lastShotTime.current > 100 && planeRef.current) {
      const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(planeRef.current.quaternion);
      const origin = planeRef.current.position.clone().add(direction.clone().multiplyScalar(1.2));
      onFire(origin, direction);
      lastShotTime.current = now;
    }

    // Movement
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(plane.quaternion);
    plane.position.add(forward.multiplyScalar(moveSpeed));

    // Terrain proximity
    const groundLevel = -5;
    const minAltitude = 1;
    const desiredY = groundLevel + minAltitude;
    if (plane.position.y < desiredY) {
      plane.position.y = THREE.MathUtils.lerp(plane.position.y, desiredY, 0.2);
      const forwardFlat = new THREE.Vector3(0, 0, -1).applyQuaternion(plane.quaternion);
      forwardFlat.y = 0;
      forwardFlat.normalize();
      const flatQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1), forwardFlat
      );
      plane.quaternion.slerp(flatQuat, 0.2);
    }

    onUpdatePosition(plane.position.clone());

    // Collision check
    obstacleRefs.forEach((ref, i) => {
      if (!ref.current || hitSet.current.has(i)) return;
      const dist = ref.current.position.distanceTo(plane.position);
      if (dist < 1) {
        hitSet.current.add(i);
        onScore();
      }
    });

    
  });

  return <group ref={planeRef}><Plane /></group>;
};

export default Player;
