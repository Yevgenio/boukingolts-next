'use client';

import { useEffect, useState, useRef } from 'react';
import API_URL from '@/config/config';
import gsap from 'gsap';
import Link from 'next/link';
import { HeroContent } from '@/types/HomeContent';

interface Props {
  content: HeroContent;
}

function getTintStyle(tint: string): React.CSSProperties {
  if (!tint) return {};
  if (tint.startsWith('#') || tint.startsWith('rgb')) return { backgroundColor: tint };
  return {};
}

export default function HeroSection({ content }: Props) {
  const [index, setIndex] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.timeline()
      .fromTo(headingRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out' })
      .fromTo(subheadingRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6')
      .fromTo(buttonRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
  }, []);

  useEffect(() => {
    if (content.images.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % content.images.length), 5000);
    return () => clearInterval(id);
  }, [content.images.length]);

  return (
    <section className="relative w-full min-h-[70vh] overflow-hidden text-white flex items-center justify-center">
      {/* Slides */}
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

      {/* Tint overlay */}
      <div className="absolute inset-0 z-0" style={getTintStyle(content.tint)} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-20 max-w-3xl">
        <h1 ref={headingRef} className="font-serif text-5xl md:text-6xl font-light leading-tight mb-5 drop-shadow">
          {content.title}
        </h1>
        <p ref={subheadingRef} className="text-base md:text-lg text-white/85 mb-10 max-w-xl mx-auto leading-relaxed">
          {content.paragraph}
        </p>
        <div ref={buttonRef} className="flex flex-wrap justify-center gap-4">
          <Link
            href="/gallery"
            className="bg-white text-stone-900 px-8 py-3 text-sm font-medium tracking-wide hover:bg-stone-100 transition-colors"
          >
            Explore Gallery
          </Link>
          <Link
            href="/events"
            className="border border-white text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-white hover:text-stone-900 transition-colors"
          >
            Upcoming Events
          </Link>
        </div>
      </div>

      {/* Slide dots */}
      {content.images.length > 1 && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
          {content.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'bg-white w-5' : 'bg-white/40 w-1.5'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
