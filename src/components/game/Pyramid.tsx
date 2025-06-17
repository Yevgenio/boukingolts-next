'use client';

import { useRef, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Pyramid = forwardRef<THREE.Group, { control: boolean }>(({ control }, ref) => {
  const groupRef = ref as React.MutableRefObject<THREE.Group>;
  const rotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!control) return;
      rotation.current.x -= e.movementY * 0.002;
      rotation.current.y -= e.movementX * 0.002;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [control]);

useFrame(() => {
  if (!groupRef.current) return;

  const object = groupRef.current;
  const q = new THREE.Quaternion();

  // Local axes
  const pitchAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(object.quaternion);
  const yawAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(object.quaternion);

  // Apply pitch
  q.setFromAxisAngle(pitchAxis, rotation.current.x);
  object.quaternion.premultiply(q);

  // Apply yaw
  q.setFromAxisAngle(yawAxis, rotation.current.y);
  object.quaternion.premultiply(q);

  // Reset deltas so rotation only applies once per frame
  rotation.current.x = 0;
  rotation.current.y = 0;
});

  return (
    <group ref={groupRef}>
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.2, 0.5, 4]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    </group>
  );
});

export default Pyramid;
