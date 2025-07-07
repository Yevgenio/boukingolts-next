// pages/home.tsx
// import TileParagraph from '@/components/tiles/TileParagraph';

// const Home = () => {
//   return (        
//     <main>
//       <br />
//       <section className="w-full h-full items-center justify-center flex flex-col">
//         <TileParagraph />
//       </section>
//     </main>
//   );
// };

// export default Home;

'use client';

import TileParagraph from '@/components/tiles/TileParagraph';

// import dynamic from 'next/dynamic';
// const R3FScrollGallery = dynamic(() => import('@/components/home/R3FScrollGallery'), {
//   ssr: false,
// });

// const Menu3D = dynamic(() => import('@/components/home/Menu3D'), { ssr: false });

const Home = () => {
  return (
      <div className="w-screen h-screen overflow-hidden">
        {/* <Menu3D /> */}
        {/* <R3FScrollGallery /> */}
        <TileParagraph />
      </div>
  );
};

export default Home;
