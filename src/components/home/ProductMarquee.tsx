'use client';

import { useEffect, useRef } from 'react';
import { IMAGE_URL } from '@/config/config';
import Image from 'next/image';
import { Product } from '@/types/Product';
import Link from 'next/link';

interface Props {
  products: Product[];
}

const BASE_SPEED  = 0.04;
const MAX_BOOST   = 3;
const BOOST_GAIN  = 0.03;
const DECAY_RATE  = 0.88;
const CARD_HEIGHT = 220; // px — all cards share this height, widths vary by aspect ratio

function cardWidth(product: Product): number {
  const img = product.images[0];
  const ratio = (img?.width ?? 1) / (img?.height ?? 1);
  return Math.round(CARD_HEIGHT * ratio);
}

export default function ProductMarquee({ products }: Props) {
  const trackRef    = useRef<HTMLDivElement>(null);
  const offsetRef   = useRef(0);
  const boostRef    = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const dy = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      boostRef.current = Math.max(-MAX_BOOST, Math.min(boostRef.current + dy * BOOST_GAIN, MAX_BOOST));
    };

    const half = (track.firstElementChild as HTMLElement)?.offsetWidth ?? track.scrollWidth / 2;

    let rafId: number;
    let lastTs = performance.now();

    const animate = (ts: number) => {
      const delta = Math.min(ts - lastTs, 50);
      lastTs = ts;

      boostRef.current *= Math.pow(DECAY_RATE, delta / 16.67);

      offsetRef.current += (BASE_SPEED + boostRef.current) * delta;
      if (offsetRef.current >= half) offsetRef.current -= half;
      if (offsetRef.current < 0) offsetRef.current += half;

      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [products]);

  if (!products.length) return null;

  const applyBoost = (dir: 'left' | 'right') => {
    boostRef.current = dir === 'right' ? MAX_BOOST : -MAX_BOOST;
  };

  return (
    <section className="w-full py-14">
      <div className="text-center mb-8 px-6">
        <h2 className="text-3xl font-serif text-stone-800">Our Collection</h2>
        <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
      </div>
      <div className="relative overflow-hidden border-y border-stone-200 py-6">

        <button
          onClick={() => applyBoost('left')}
          aria-label="Scroll left"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9
            bg-white/90 border border-stone-200 shadow-md rounded-full
            flex items-center justify-center text-stone-500 hover:text-stone-900
            transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div ref={trackRef} className="flex will-change-transform">
          {[0, 1].map(copy => (
            <div key={copy} className="flex gap-5 pr-5 flex-shrink-0 items-end">
              {products.map((product, idx) => {
                const w = cardWidth(product);
                return (
                  <Link
                    key={idx}
                    href={`/gallery/${product._id}`}
                    style={{ width: w, height: CARD_HEIGHT, flexShrink: 0 }}
                    className="group"
                  >
                    <div
                      style={{ width: w, height: CARD_HEIGHT }}
                      className="rounded-lg overflow-hidden bg-stone-100 shadow-sm group-hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={`${IMAGE_URL}/${product.images[0]?.thumbnail ?? 'default.jpg'}`}
                        alt={product.name}
                        width={product.images[0]?.width || 400}
                        height={product.images[0]?.height || 400}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <button
          onClick={() => applyBoost('right')}
          aria-label="Scroll right"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9
            bg-white/90 border border-stone-200 shadow-md rounded-full
            flex items-center justify-center text-stone-500 hover:text-stone-900
            transition-colors duration-200"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

      </div>
    </section>
  );
}
