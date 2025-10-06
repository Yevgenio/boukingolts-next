// 'use client';

// import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { Line } from '@react-three/drei';
// import * as THREE from 'three';
// import React, { useMemo, useRef, useCallback } from 'react';

// type Chain3DProps = {
//   /** Number of points (re-allocates buffers when changed) */
//   count?: number;
//   /** Half-size of the square (points move within [-bounds, +bounds]) */
//   bounds?: number;
//   /** Max line distance in CSS pixels (converted to world units) */
//   pxThreshold?: number;
//   /** Extra pixels for fade-out band to reduce flicker */
//   hysteresisPx?: number;
//   /** Canvas height (vh) as a Tailwind-ish class string */
//   heightClass?: string;
// };

// /* ------------------------ easing: cubic-bezier(.3,.2,.2,1) ------------------------ */
// function cubicBezierEaseFactory(p1x: number, p1y: number, p2x: number, p2y: number) {
//   const NEWTON_ITERS = 4, NEWTON_EPS = 1e-6, n = 11, step = 1 / (n - 1);
//   const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
//   const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
//   const C = (a1: number) => 3 * a1;
//   const calc = (t: number, a1: number, a2: number) => ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
//   const slope = (t: number, a1: number, a2: number) => 3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);

//   const table = new Float32Array(n);
//   for (let i = 0; i < n; i++) table[i] = calc(i * step, p1x, p2x);

//   const tForX = (x: number) => {
//     let i = 1, start = 0;
//     while (i < n - 1 && table[i] <= x) { start += step; i++; }
//     i--;
//     const dist = (x - table[i]) / (table[i + 1] - table[i]);
//     let t = start + dist * step;
//     for (let j = 0; j < NEWTON_ITERS; j++) {
//       const xEst = calc(t, p1x, p2x) - x;
//       const dEst = slope(t, p1x, p2x);
//       if (Math.abs(dEst) < NEWTON_EPS) break;
//       t -= xEst / dEst;
//     }
//     return t;
//   };

//   return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : calc(tForX(x), p1y, p2y));
// }
// const ease = cubicBezierEaseFactory(0.3, 0.2, 0.2, 1);

// /* ---------------------------------- utils ---------------------------------- */
// const randInSquare = (b: number) =>
//   new THREE.Vector3(
//     THREE.MathUtils.randFloatSpread(b * 2),
//     THREE.MathUtils.randFloatSpread(b * 2),
//     0
//   );

// /* -------------------- custom shader (per-vertex alpha fade) -------------------- */
// const vert = /* glsl */`
//   attribute float aAlpha;
//   varying float vAlpha;
//   void main() {
//     vAlpha = aAlpha;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;
// const frag = /* glsl */`
//   precision mediump float;
//   varying float vAlpha;
//   uniform vec3 uColor;
//   void main() {
//     vec4 c = vec4(uColor, vAlpha);
//     if (c.a < 0.02) discard;
//     gl_FragColor = c;
//   }
// `;

// /* ------------------------------ inner logic ------------------------------ */
// function ChainLogic({
//   count,
//   bounds,
//   pxThreshold,
//   hysteresisPx,
// }: Required<Pick<Chain3DProps, 'count' | 'bounds' | 'pxThreshold' | 'hysteresisPx'>>) {
//   /* dots */
//   const positions = useMemo(() => [...Array(count)].map(() => randInSquare(bounds)), [count, bounds]);
//   const starts    = useMemo(() => positions.map(p => p.clone()), [positions]);
//   const targets   = useMemo(() => [...Array(count)].map(() => randInSquare(bounds)), [count, bounds]);
//   const inst = useRef<THREE.InstancedMesh>(null);
//   const mat = useMemo(() => new THREE.Matrix4(), []);
//   const DURATION = 1; // seconds per tween
//   const tAcc = useRef(0);

//   /* proximity lines (LineSegments with fading alpha) */
//   const maxPairs = (count * (count - 1)) >> 1; // nC2
//   const segPositions = useMemo(() => new Float32Array(maxPairs * 2 * 3), [maxPairs]);
//   const segAlphas    = useMemo(() => new Float32Array(maxPairs * 2),     [maxPairs]);
//   const segGeom = useRef<THREE.BufferGeometry | null>(null); // ✅ writeable ref

//   const lineMat = useMemo(() => {
//     return new THREE.ShaderMaterial({
//       vertexShader: vert,
//       fragmentShader: frag,
//       transparent: true,
//       depthWrite: false,
//       uniforms: { uColor: { value: new THREE.Color('#ffffff') } },
//     });
//   }, []);

//   // robust attribute init via ref callback (prevents "needsUpdate of undefined")
//   const initSegGeom = useCallback((g: THREE.BufferGeometry | null) => {
//     if (!g) return;
//     segGeom.current = g;
//     g.setAttribute('position', new THREE.BufferAttribute(segPositions, 3));
//     g.setAttribute('aAlpha',   new THREE.BufferAttribute(segAlphas, 1));
//     g.setDrawRange(0, 0);
//   }, [segPositions, segAlphas]);

//   /* pixel → world thresholds (with hysteresis to avoid flicker) */
//   const { size, camera } = useThree();
//   const thresholds = useMemo(() => {
//     const cam = camera as THREE.PerspectiveCamera;
//     const dist = Math.abs(cam.position.z - 0); // z=0 plane
//     const vFOV = THREE.MathUtils.degToRad(cam.fov);
//     const planeH = 2 * Math.tan(vFOV / 2) * dist;
//     const worldPerPxY = planeH / size.height;
//     const on  = pxThreshold * worldPerPxY;
//     const off = (pxThreshold + hysteresisPx) * worldPerPxY;
//     return { on, off, on2: on * on, off2: off * off };
//   }, [camera, size.height, pxThreshold, hysteresisPx]);

//   /* frame loop */
//   useFrame((_, dt) => {
//     const clamped = Math.min(dt, 1 / 30);
//     tAcc.current += clamped;

//     let phase = tAcc.current / DURATION;
//     if (phase >= 1) {
//       for (let i = 0; i < count; i++) {
//         positions[i].copy(targets[i]);
//         starts[i].copy(positions[i]);
//         targets[i] = randInSquare(bounds);
//       }
//       tAcc.current = 0;
//       phase = 0;
//     }
//     const e = ease(phase);

//     // update dots
//     for (let i = 0; i < count; i++) {
//       const s = starts[i], t = targets[i];
//       const x = THREE.MathUtils.lerp(s.x, t.x, e);
//       const y = THREE.MathUtils.lerp(s.y, t.y, e);
//       positions[i].set(x, y, 0);
//       inst.current?.setMatrixAt(i, mat.makeTranslation(x, y, 0));
//     }
//     if (inst.current) inst.current.instanceMatrix.needsUpdate = true;

//     // build faded proximity segments
//     const { on2, off2 } = thresholds;
//     let writeVerts = 0;

//     for (let i = 0; i < count; i++) {
//       const pi = positions[i];
//       for (let j = i + 1; j < count; j++) {
//         const pj = positions[j];
//         const dx = pi.x - pj.x, dy = pi.y - pj.y;
//         const d2 = dx * dx + dy * dy;

//         let a = 0;
//         if (d2 <= on2) {
//           a = 1;
//         } else if (d2 < off2) {
//           // smoothstep(off -> on)
//           const d = Math.sqrt(d2);
//           const t = THREE.MathUtils.clamp((thresholds.off - d) / (thresholds.off - thresholds.on), 0, 1);
//           a = t * t * (3 - 2 * t);
//         }

//         if (a > 0) {
//           const o0 = writeVerts * 3;
//           segPositions[o0 + 0] = pi.x; segPositions[o0 + 1] = pi.y; segPositions[o0 + 2] = 0;
//           segAlphas[writeVerts] = a; writeVerts++;

//           const o1 = writeVerts * 3;
//           segPositions[o1 + 0] = pj.x; segPositions[o1 + 1] = pj.y; segPositions[o1 + 2] = 0;
//           segAlphas[writeVerts] = a; writeVerts++;
//         }
//       }
//     }

//     // push to GPU (re-bind attributes if arrays were reallocated)
//     const g = segGeom.current;
//     if (g) {
//       let posAttr = g.getAttribute('position') as THREE.BufferAttribute | undefined;
//       if (!posAttr || (posAttr.array as Float32Array) !== segPositions) {
//         g.setAttribute('position', new THREE.BufferAttribute(segPositions, 3));
//         posAttr = g.getAttribute('position') as THREE.BufferAttribute;
//       }
//       let aAttr = g.getAttribute('aAlpha') as THREE.BufferAttribute | undefined;
//       if (!aAttr || (aAttr.array as Float32Array) !== segAlphas) {
//         g.setAttribute('aAlpha', new THREE.BufferAttribute(segAlphas, 1));
//         aAttr = g.getAttribute('aAlpha') as THREE.BufferAttribute;
//       }
//       posAttr.needsUpdate = true;
//       aAttr.needsUpdate = true;
//       g.setDrawRange(0, writeVerts); // vertex count
//       g.computeBoundingSphere?.();
//     }
//   });

//   // visible square bounds
//   const square = useMemo(() => {
//     const b = bounds;
//     return [
//       new THREE.Vector3(-b, -b, 0),
//       new THREE.Vector3( b, -b, 0),
//       new THREE.Vector3( b,  b, 0),
//       new THREE.Vector3(-b,  b, 0),
//       new THREE.Vector3(-b, -b, 0),
//     ];
//   }, [bounds]);

//   return (
//     <>
//       {/* bounds outline */}
//       <Line points={square} color="#ffffff" lineWidth={1} transparent opacity={0.9} />

//       {/* proximity lines with per-vertex alpha */}
//       <lineSegments>
//         <bufferGeometry ref={initSegGeom} />
//         {/* @ts-ignore - use custom ShaderMaterial */}
//         <primitive object={lineMat} attach="material" />
//       </lineSegments>

//       {/* dots */}
//       <instancedMesh ref={inst} args={[undefined as any, undefined as any, count]}>
//         <sphereGeometry args={[0.12, 16, 16]} />
//         <meshBasicMaterial color="#ffffff" />
//       </instancedMesh>
//     </>
//   );
// }

// /* ------------------------------ exported component ------------------------------ */
// export default function Chain3D({
//   count = 18,
//   bounds = 7,
//   pxThreshold = 50,
//   hysteresisPx = 12,
//   heightClass = 'h-[60vh]',
// }: Chain3DProps) {
//   return (
//     <div className={`relative w-full ${heightClass}`}>
//       <Canvas camera={{ position: [0, 0, 16], fov: 60 }}>
//         <color attach="background" args={['#0a0a0f']} />
//         <ambientLight intensity={0.7} />
//         <ChainLogic
//           count={count}
//           bounds={bounds}
//           pxThreshold={pxThreshold}
//           hysteresisPx={hysteresisPx}
//         />
//       </Canvas>
//     </div>
//   );
// }
