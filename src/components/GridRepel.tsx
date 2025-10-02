'use client';

import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

type GridRepelProps = {
  gridSize?: number;
  spacing?: number;
  bounds?: number;
  followMouse?: boolean;
  showControls?: boolean;
};

export default function GridRepel({
  gridSize = 8,
  spacing = 1.0,
  bounds = 6,
  followMouse = false,
  showControls = false,
}: GridRepelProps) {
  return (
    <div className="relative w-full h-[60vh]">
      <Canvas camera={{ position: [0, 0, 18], fov: 55 }}>
        <color attach="background" args={['#0a0a0f']} />
        <ambientLight intensity={0.8} />
        <GridSystem
          gridSize={gridSize}
          spacing={spacing}
          bounds={bounds}
          followMouse={followMouse}
        />
        {showControls && <OrbitControls enableDamping dampingFactor={0.08} />}
      </Canvas>
    </div>
  );
}

function GridSystem({
  gridSize,
  spacing,
  bounds,
  followMouse,
}: Required<Pick<GridRepelProps, 'gridSize' | 'spacing' | 'bounds' | 'followMouse'>>) {
  // ----- SETUP -----
  const count = gridSize * gridSize;
  const inst = useRef<THREE.InstancedMesh>(null);
  const agentRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.Matrix4(), []);

  // Grid rest positions (centered)
  const restPositions = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const offset = (gridSize - 1) * 0.5;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        arr.push(new THREE.Vector3((x - offset) * spacing, (y - offset) * spacing, 0));
      }
    }
    return arr;
  }, [gridSize, spacing]);

  // Live state
  const positions = useMemo(() => restPositions.map(p => p.clone()), [restPositions]);
  const velocities = useMemo(() => positions.map(() => new THREE.Vector3()), [positions]);

  // Agent state (random walker by default)
  const agentPos = useRef(new THREE.Vector3(0, 0, 0));
  const agentVel = useRef(new THREE.Vector3(0.9, 0.7, 0.4));
  const agentTarget = useRef(randInBounds(bounds));

  // Mouse target (for followMouse mode)
  const mouseNDC = useRef(new THREE.Vector2());
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const planeIntersect = new THREE.Vector3();

  // ----- PHYSICS TUNING (snappier) -----
  const kSpring = 8.0;               // was 6.0 (stiffer pull to rest)
  const damping = 0.96;              // was 0.85 (retain more velocity)
  const neighborRepelDist = spacing * 0.9;
  const neighborRepelStrength = 16.0; // was 12.0
  const agentRadius = spacing * 3.0;  // was 2.2 (starts reacting earlier)
  const agentRepelStrength = 45.0;    // was 30.0

  // Hard collision shell: if inside this, snap out immediately
  const hardAgentRadius = agentRadius * 0.55;

  // Precompute 8-neighborhood (adds diagonals for faster propagation)
  const neighbors = useMemo(() => {
    const map: number[][] = [];
    const idx = (x: number, y: number) => y * gridSize + x;
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const list: number[] = [];
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
              list.push(idx(nx, ny));
            }
          }
        }
        map.push(list);
      }
    }
    return map;
  }, [gridSize]);

  // Mouse handler projects to z=0 plane
  const onPointerMove: ThreeElements['mesh']['onPointerMove'] = (e) => {
    if (!followMouse) return;
    const { camera } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    mouseNDC.current.set((e.pointer.x / width) * 2 - 1, -(e.pointer.y / height) * 2 + 1);
    raycaster.setFromCamera(mouseNDC.current, camera);
    raycaster.ray.intersectPlane(plane, planeIntersect);
    agentTarget.current.copy(planeIntersect.clampScalar(-bounds, bounds));
  };

  // ----- TEMP VECTORS (avoid GC) -----
  const tmp = useMemo(() => ({
    toRest: new THREE.Vector3(),
    away:   new THREE.Vector3(),
    diff:   new THREE.Vector3(),
  }), []);

  useFrame(({ }, dt) => {
    const _dt = Math.min(dt, 1 / 60);

    // === Agent motion ===
    if (followMouse) {
      const to = tmp.diff.copy(agentTarget.current).sub(agentPos.current);
      agentVel.current.addScaledVector(to, 0.08).clampLength(0, 2.5);
      agentVel.current.multiplyScalar(0.985);
      agentPos.current.addScaledVector(agentVel.current, _dt * 10);
    } else {
      const to = tmp.diff.copy(agentTarget.current).sub(agentPos.current);
      const dist = to.length();
      if (dist < 0.2) agentTarget.current = randInBounds(bounds);
      to.normalize().multiplyScalar(0.7);
      agentVel.current.lerp(to, 0.05);
      agentPos.current.addScaledVector(agentVel.current, _dt * 10);
      // soft reflect
      if (Math.abs(agentPos.current.x) > bounds) { agentPos.current.x = Math.sign(agentPos.current.x) * bounds; agentVel.current.x *= -1; }
      if (Math.abs(agentPos.current.y) > bounds) { agentPos.current.y = Math.sign(agentPos.current.y) * bounds; agentVel.current.y *= -1; }
      if (Math.abs(agentPos.current.z) > bounds) { agentPos.current.z = Math.sign(agentPos.current.z) * bounds; agentVel.current.z *= -1; }
    }
    agentRef.current?.position.copy(agentPos.current);

    // === Grid dynamics ===
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      const v = velocities[i];

      // Spring to rest
      tmp.toRest.copy(restPositions[i]).sub(p).multiplyScalar(kSpring);
      v.addScaledVector(tmp.toRest, _dt);

      // Agent repel (inverse-square falloff for snappier near-contact)
      tmp.away.copy(p).sub(agentPos.current);
      const dA = tmp.away.length();
      if (dA > 0 && dA < agentRadius) {
        // hard-shell projection to avoid "delay" at contact
        if (dA < hardAgentRadius) {
          tmp.away.normalize().multiplyScalar(hardAgentRadius);
          p.copy(agentPos.current).add(tmp.away); // snap out instantly
        }
        // smooth impulse
        const inv = 1 / Math.max(dA * dA, 1e-4);
        const strength = agentRepelStrength * inv; // stronger when closer
        tmp.away.normalize();
        v.addScaledVector(tmp.away, strength * _dt);
      }

      // Neighbor repel (with diagonals)
      const nList = neighbors[i];
      for (let j = 0; j < nList.length; j++) {
        const q = positions[nList[j]];
        tmp.diff.copy(p).sub(q);
        const d = tmp.diff.length();
        if (d > 0 && d < neighborRepelDist) {
          const push = (1 - d / neighborRepelDist) * neighborRepelStrength;
          tmp.diff.multiplyScalar(1 / d); // normalize in-place
          // symmetric push
          v.addScaledVector(tmp.diff, push * _dt * 0.5);
          velocities[nList[j]].addScaledVector(tmp.diff, -push * _dt * 0.5);
        }
      }

      // Integrate
      v.multiplyScalar(damping);
      p.addScaledVector(v, _dt);
    }

    // Write to instances
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      mat.makeTranslation(p.x, p.y, p.z);
      inst.current?.setMatrixAt(i, mat);
    }
    inst.current && (inst.current.instanceMatrix.needsUpdate = true);
  });

  return (
    <group onPointerMove={onPointerMove}>
      {/* Dots */}
      <instancedMesh ref={inst} args={[undefined as any, undefined as any, count]}>
        <sphereGeometry args={[0.09, 14, 14]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>

      {/* Agent */}
      <mesh ref={agentRef}>
        <sphereGeometry args={[0.16, 20, 20]} />
        <meshBasicMaterial color="#8ab4ff" />
      </mesh>
    </group>
  );
}

function randInBounds(b: number) {
  return new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(b * 2),
    THREE.MathUtils.randFloatSpread(b * 2),
    THREE.MathUtils.randFloatSpread(b * 2)
  );
}
