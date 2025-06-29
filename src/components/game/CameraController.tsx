// components/game/CameraController.tsx
'use client';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export default function CameraController({
  planeRef,
  mouseDown,
}: {
  planeRef: React.RefObject<THREE.Group>;
  mouseDown: boolean;
}) {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useFrame(() => {
    if (!planeRef.current || !controlsRef.current) return;
    const plane = planeRef.current;
    const controls = controlsRef.current;
    controls.target.copy(plane.position);

    if (mouseDown) {
      controls.enabled = true;
      controls.update();
    } else {
      controls.enabled = false;
      const behind = new THREE.Vector3(0, 1.5, 2)
        .applyQuaternion(plane.quaternion)
        .add(plane.position);
      camera.position.lerp(behind, 0.2);
      camera.lookAt(plane.position);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={false}
      enablePan={false}
      enableRotate={false} //mouseDown
    />
  );
}
