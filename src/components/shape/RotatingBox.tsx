// components/RotatingBox.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MeshProps } from '@react-three/fiber';
import { useRef } from 'react';

const Box = (props: MeshProps) => {
//   const meshRef = useRef<THREE.Mesh>(null);
const meshRef = useRef(null);

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[1, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const RotatingBox = () => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas camera={{ position: [2, 2, 2] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[0, 0, 0]} />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default RotatingBox;
