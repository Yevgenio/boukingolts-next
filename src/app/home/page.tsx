// app/page.tsx (server component)
import dynamic from 'next/dynamic';
// const Chain3D = dynamic(() => import('@/components/Chain3D'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* SSR headline for SEO */}
      <section className="relative z-10 text-center py-16">
        <h1 className="text-4xl md:text-6xl font-semibold">Boukingolts.art</h1>
        <p className="text-lg opacity-70">Hand-crafted works & motion art</p>
      </section>

      {/* client island */}
      {/* <Chain3D count={18} bounds={7} pxThreshold={150} hysteresisPx={16} /> */}
    </>
  );
}