
// export default function HeroSection() {
//     const headingRef = useRef<HTMLHeadingElement>(null);
//     const subheadingRef = useRef<HTMLParagraphElement>(null);
//     const buttonRef = useRef<HTMLDivElement>(null);



//     return (
//         <section className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 to-rose-200 text-center px-4">
//         <h1 ref={headingRef} className="text-5xl font-bold text-gray-900 mb-4">
//             Boukingolts Flowers
//         </h1>
//         <p ref={subheadingRef} className="text-xl text-gray-700 mb-8">
//             Flowers for your favorite moments
//         </p>
//         <div ref={buttonRef} className="flex gap-4">
//             <a href="https://wa.me/972501234567" className="bg-white text-orange-500 border border-orange-500 px-6 py-3 rounded-lg font-medium hover:bg-orange-100 transition">
//             WhatsApp Us
//             </a>
//             <a href="tel:+972501234567" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition">
//             Call Now
//             </a>
//         </div>
//         </section>
//     );
// }
'use client';

import { useEffect, useState, useRef } from 'react';
import API_URL from '@/config/config';
import gsap from 'gsap';

import { HeroContent } from '@/types/HomeContent';

interface Props {
  content: HeroContent;
}

function getTintStyle(tint: string): React.CSSProperties {
  if (!tint) return {};
  if (tint.startsWith('#') || tint.startsWith('rgb')) {
    return { backgroundColor: tint };
  }
  return {};
}

export default function HeroSection({ content }: Props) {
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(headingRef.current, 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 1 }
    )
    .fromTo(subheadingRef.current, 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 1 }, "-=0.5"
    )
    .fromTo(buttonRef.current, 
    { opacity: 0, scale: 0.8 }, 
    { opacity: 1, scale: 1, duration: 0.8 }, "-=0.4"
    );
  }, []);

  useEffect(() => {
    if (content.images.length <= 1) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % content.images.length);
    }, 5000);
    return () => clearInterval(id);
  }, [content.images.length]);

  return (
    <section className="relative w-full p-16 overflow-hidden text-white">
      {content.images.map((img, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{
            backgroundImage: `url('${API_URL}/api/uploads/${img.url}')`,
            transform: `translateX(${(i - index) * 100}%)`,
          }}
        />
      ))}
      <div
        className="absolute inset-0 z-0"
        style={getTintStyle(content.tint)}
      />
      {/* <div className={`absolute inset-0 bg-slate-800/60 z-0`} /> */}
      <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
        <div className="max-w-3xl">
          <h1 ref={headingRef} className="text-4xl md:text-5xl font-bold leading-tight mb-6">{content.title}</h1>
          <p ref={subheadingRef} className="text-lg md:text-xl mb-8">{content.paragraph}</p>
          <div ref={buttonRef} className="flex flex-wrap justify-center gap-4">
            <a
              href="/gallery"
              className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 border-2 text-sm font-semibold"
            >
              Explore Shop
            </a>
            <a
              href="/events"
              className="bg-transparent hover:bg-white hover:text-black border-2 px-6 py-3 text-sm font-semibold"
            >
              Future Events
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}