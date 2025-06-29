// app/3d/page.tsx or pages/3d.tsx depending on your structure
import dynamic from 'next/dynamic';

// const RotatingBox = dynamic(() => import('@/components/shape/RotatingBox'), {
//   ssr: false, // disables server-side rendering for WebGL
// });

// const SimpleEarth = dynamic(() => import('@/components/shape/SimpleEarth'), {
//   ssr: false, // disables server-side rendering for WebGL
// });

// const CartoonPlane = dynamic(() => import('@/components/game/CartoonPlane'), {
//   ssr: false, // disables server-side rendering for WebGL
// });

const Game = dynamic(() => import('@/components/game/Game'), {
  ssr: false, // disables server-side rendering for WebGL
});


export default function ShapePage() {
  return (
    <main>
      {/* <RotatingBox /> */}
        <Game />
    </main>
  );
}
