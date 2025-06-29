'use client';

import React from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import Plane from './CartoonPlane';
import Terrain from './Terrain';
import Trees from './Trees';
import Clouds from './Clouds';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

const useKeyboardControls = () => {
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    rollLeft: false,
    rollRight: false,
    yawLeft: false,
    yawRight: false,  
  });

  useEffect(() => {
   const mapKey = (key: string) => {
      switch (key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          return 'up';
        case 's':
        case 'arrowdown':
          return 'down';
        case 'a':
        case 'arrowleft':
          return 'rollLeft';
        case 'd':
        case 'arrowright':
          return 'rollRight';
        case 'q':
          return 'yawLeft';
        case 'e':
          return 'yawRight';
        default:
          return null;
      }
    };
    const down = (e: KeyboardEvent) => {
      const k = mapKey(e.key);
      if (k) setKeys((prev) => ({ ...prev, [k]: true }));
    };
    const up = (e: KeyboardEvent) => {
      const k = mapKey(e.key);
      if (k) setKeys((prev) => ({ ...prev, [k]: false }));
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return keys;
};

const Player = ({
  obstacleRefs,
  onScore,
  onUpdatePosition,
  planeRef
}: {
  obstacleRefs: React.RefObject<THREE.Mesh>[];
  onScore: () => void;
  onUpdatePosition: (pos: THREE.Vector3) => void;
  planeRef: React.RefObject<THREE.Group>;
}) => {
  const keys = useKeyboardControls();
  const hitSet = useRef(new Set());

  useFrame(() => {
    if (!planeRef.current) return;
    const plane = planeRef.current;

    const moveSpeed = 0.3;
    const rotSpeed = 0.05;

    const q = new THREE.Quaternion();
    const localAxis = new THREE.Vector3();

    // --- ROTATION CONTROLS ---
    if (keys.rollLeft) {
      localAxis.set(0, 0, 1).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis,  rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.rollRight) {
      localAxis.set(0, 0, 1).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis, -rotSpeed);
      plane.quaternion.premultiply(q);
    }
    if (keys.yawLeft) {
      localAxis.set(0, 1, 0).applyQuaternion(plane.quaternion);
      q.setFromAxisAngle(localAxis,  rotSpeed);
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
      q.setFromAxisAngle(localAxis,  rotSpeed);
      plane.quaternion.premultiply(q);
    }

    // --- MOVEMENT ---
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(plane.quaternion);
    plane.position.add(forward.multiplyScalar(moveSpeed));

    // --- TERRAIN COLLISION CORRECTION ---
    const groundLevel = -5;
    const minAltitude = 1;
    const desiredY = groundLevel + minAltitude;

    if (plane.position.y < desiredY) {
      // Smoothly adjust position.y
      plane.position.y = THREE.MathUtils.lerp(plane.position.y, desiredY, 0.2);

      // Flatten forward vector
      const forwardFlat = new THREE.Vector3(0, 0, -1).applyQuaternion(plane.quaternion);
      forwardFlat.y = 0;
      forwardFlat.normalize();

      // Compute new quaternion facing forwardFlat
      const flatQuat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        forwardFlat
      );

      // Extract current roll (approximate)
      // const zAxis = new THREE.Vector3(0, 0, 1).applyQuaternion(plane.quaternion);
      // const rollQuat = new THREE.Quaternion().setFromAxisAngle(zAxis, 0); // placeholder if needed

      // Interpolate current to new orientation smoothly
      plane.quaternion.slerp(flatQuat, 0.2);
    }

    // --- UPDATE POSITION ---
    onUpdatePosition(plane.position.clone());

    // --- COLLISION CHECK ---
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


function CameraController({
  planeRef,
  mouseDown,
}: {
  planeRef: React.RefObject<THREE.Group>;
  mouseDown: boolean;
}) {
  const { camera, gl } = useThree();
  // const controlsRef = useRef<any>(null);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useFrame(() => {
    if (!planeRef.current || !controlsRef.current) return;

    const plane = planeRef.current;
    const controls = controlsRef.current;

    controls.target.copy(plane.position);

    if (mouseDown) {
      // Let OrbitControls take over camera position/rotation
      controls.enabled = true;
      controls.update();
    } else {
      // Prevent mouse input but keep OrbitControls alive
      controls.enabled = false;

      // Default camera follow position
      const behind = new THREE.Vector3(0, 1.5, 4)
        .applyQuaternion(plane.quaternion)
        .add(plane.position);

      camera.position.lerp(behind, 0.1);
      camera.lookAt(plane.position);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={false}
      enablePan={false}
      enableRotate={mouseDown} // <— only allow rotation if dragging
    />
  );
}

// const RandomObstacles = ({ obstacleRefs }: { obstacleRefs: React.RefObject<THREE.Mesh>[] }) => {
//   const count = 100;

//   // Create refs once
//   const refs = useMemo(
//     () => Array.from({ length: count }, () => React.createRef<THREE.Mesh>()),
//     []
//   );

//   // Assign to external ref array
//   useEffect(() => {
//     refs.forEach((ref, i) => {
//       obstacleRefs[i] = ref;
//     });
//   }, [refs, obstacleRefs]);

//   const obstacles = useMemo(() => {
//     return Array.from({ length: count }, () => ({
//       pos: [THREE.MathUtils.randFloatSpread(300), Math.random() * 30 + 5, THREE.MathUtils.randFloatSpread(300)] as [number, number, number],
//       size: Math.random() * 0.5 + 0.2,
//     }));
//   }, []);

//   return (
//     <>
//       {obstacles.map((o, i) => (
//         <mesh key={i} ref={refs[i]} position={o.pos}>
//           <boxGeometry args={[o.size, o.size, o.size]} />
//           <meshStandardMaterial color="orange" />
//         </mesh>
//       ))}
//     </>
//   );
// };

export default function Game() {
  const obstacleRefs = useRef<React.RefObject<THREE.Mesh>[]>([]);
  const [score, setScore] = useState(0);
  const [planePosition, setPlanePosition] = useState<THREE.Vector3 | null>(null);
  const playerRef = useRef<THREE.Group>(null);
  const [mouseDown, setMouseDown] = useState(false);

  useEffect(() => {
    const handleDown = () => setMouseDown(true);
    const handleUp = () => setMouseDown(false);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '90vh', position: 'relative'}}>
      <Canvas 
        camera={{ fov: 75 }} 
        shadows
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap; // Optional: softer shadows
        }}
        >

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

        <color attach="background" args={['skyblue']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <Terrain />
        <Trees count={300} />
        <Clouds count={100} />
        <Player
          obstacleRefs={obstacleRefs.current}
          onScore={() => setScore((prev) => prev + 1)}
          onUpdatePosition={setPlanePosition}
          planeRef={playerRef}
        />
        <CameraController planeRef={playerRef} mouseDown={mouseDown} />
        {/* <RandomObstacles obstacleRefs={obstacleRefs.current} /> */}
      </Canvas>

      <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(0,0,0,0.5)', padding: '10px 20px', color: 'white', fontSize: '1.2em', borderRadius: '8px' }}>
        Score: {score}
      </div>

      {planePosition && (
        <div style={{ position: 'absolute', top: 70, left: 20, background: 'rgba(0,0,0,0.5)', padding: '8px 12px', color: 'white', fontSize: '0.9em', borderRadius: '6px' }}>
          X: {planePosition.x.toFixed(1)}<br />
          Y: {planePosition.y.toFixed(1)}<br />
          Z: {planePosition.z.toFixed(1)}
        </div>
      )}
    </div>
  );
}
