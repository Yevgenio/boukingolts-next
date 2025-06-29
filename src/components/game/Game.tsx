// components/game/Game.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import Player from './Player';
import CameraController from './CameraController';
import LightsAndSky from './LightsAndSky';

import Terrain from './Terrain';
import Trees from './Trees';
import Clouds from './Clouds';
import useBulletManager from './BulletManager';

export default function Game() {
  const obstacleRefs = useRef<React.RefObject<THREE.Mesh>[]>([]);
  const [score, setScore] = useState(0);
  const [planePosition, setPlanePosition] = useState<THREE.Vector3 | null>(null);
  const playerRef = useRef<THREE.Group>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const { fireBullet, Bullets } = useBulletManager();

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
    <div style={{ width: '100%', height: '90vh', position: 'relative' }}>
      <Canvas
        camera={{ fov: 75 }}
        shadows
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        <LightsAndSky />
        <Terrain />
        <Trees count={300} />
        <Clouds count={100} />
        {Bullets}
        <Player
        obstacleRefs={obstacleRefs.current}
        onScore={() => setScore((prev) => prev + 1)}
        onUpdatePosition={setPlanePosition}
        planeRef={playerRef}
        onFire={fireBullet}
        />
        <CameraController planeRef={playerRef} mouseDown={mouseDown} />
      </Canvas>

      <div style={{
        position: 'absolute', top: 20, left: 20,
        background: 'rgba(0,0,0,0.5)', padding: '10px 20px',
        color: 'white', fontSize: '1.2em', borderRadius: '8px'
      }}>
        Score: {score}
      </div>

      {planePosition && (
        <div style={{
          position: 'absolute', top: 70, left: 20,
          background: 'rgba(0,0,0,0.5)', padding: '8px 12px',
          color: 'white', fontSize: '0.9em', borderRadius: '6px'
        }}>
          X: {planePosition.x.toFixed(1)}<br />
          Y: {planePosition.y.toFixed(1)}<br />
          Z: {planePosition.z.toFixed(1)}
        </div>
      )}
    </div>
  );
}
