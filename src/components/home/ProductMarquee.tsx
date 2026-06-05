'use client';

import { useEffect, useRef } from 'react';
import { resolveImageUrl } from '@/config/config';
import Image from 'next/image';
import { Product } from '@/types/Product';
import Link from 'next/link';

interface Props {
  products: Product[];
}

const BASE_SPEED      = 0.04;
const MAX_BOOST       = 2.5;
const SCROLL_GAIN     = 0.025; // how much each scroll event adds to target boost
const MAX_DELTA       = 30;    // clamp per-event dy: kills mouse-wheel spikes (~100px), passes touchpad (~5px)
const TARGET_DECAY    = 0.90;  // target boost decays toward 0 each frame
const LERP_RATE       = 0.10;  // actual boost lerps toward target (lower = smoother ramp)
const CARD_HEIGHT     = 220;   // px — all cards share this height, widths vary by aspect ratio
const REFERENCE_WIDTH = 1200;  // desktop baseline — narrower screens get proportionally slower speed

function cardWidth(product: Product): number {
  const img = product.images[0];
  const ratio = (img?.width ?? 1) / (img?.height ?? 1);
  return Math.round(CARD_HEIGHT * ratio);
}

export default function ProductMarquee({ products }: Props) {
  const trackRef     = useRef<HTMLDivElement>(null);
  const offsetRef    = useRef(0);
  const boostRef     = useRef(0);   // actual current boost — lerps toward target
  const targetRef    = useRef(0);   // desired boost — set by scroll, decays over time
  const lastScrollY  = useRef(0);
  const speedScale   = useRef(1);   // viewport-width ratio — slows marquee on narrow screens

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateScale = () => {
      speedScale.current = Math.min(window.innerWidth / REFERENCE_WIDTH, 1);
    };
    updateScale();
    window.addEventListener('resize', updateScale);

    const handleScroll = () => {
      const dy = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;
      const scale = speedScale.current;
      // Clamp individual delta so mouse-wheel clicks (dy ~100) don't spike more than touchpad swipes
      const clamped = Math.sign(dy) * Math.min(Math.abs(dy), MAX_DELTA);
      const maxBoost = MAX_BOOST * scale;
      targetRef.current = Math.max(-maxBoost, Math.min(targetRef.current + clamped * SCROLL_GAIN * scale, maxBoost));
    };

    const half = (track.firstElementChild as HTMLElement)?.offsetWidth ?? track.scrollWidth / 2;

    let rafId: number;
    let lastTs = performance.now();

    const animate = (ts: number) => {
      const delta = Math.min(ts - lastTs, 50);
      lastTs = ts;

      const t = delta / 16.67;
      // Target decays toward 0 (user stops scrolling → speed returns to base)
      targetRef.current *= Math.pow(TARGET_DECAY, t);
      // Actual boost lerps toward target → smooth acceleration, no sudden jumps
      boostRef.current += (targetRef.current - boostRef.current) * (1 - Math.pow(1 - LERP_RATE, t));

      offsetRef.current += (BASE_SPEED * speedScale.current + boostRef.current) * delta;
      if (offsetRef.current >= half) offsetRef.current -= half;
      if (offsetRef.current < 0) offsetRef.current += half;

      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScale);
      cancelAnimationFrame(rafId);
    };
  }, [products]);

  if (!products.length) return null;

  const applyBoost = (dir: 'left' | 'right') => {
    const maxBoost = MAX_BOOST * speedScale.current;
    targetRef.current = dir === 'right' ? maxBoost : -maxBoost;
  };

  return (
    <section className="w-full py-14">
      <div className="text-center mb-8 px-6">
        <h2 className="text-3xl font-serif text-stone-800">Our Collection</h2>
        <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
      </div>
      <div className="relative overflow-hidden py-6">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

        <button
          onClick={() => applyBoost('left')}
          aria-label="Scroll left"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9
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
                    style={{ width: `min(${w}px, calc(100vw - 6rem))`, height: CARD_HEIGHT, flexShrink: 0 }}
                    className="group transition-transform duration-300 hover:scale-105 hover:z-10 relative"
                  >
                    <div
                      style={{ width: '100%', height: CARD_HEIGHT }}
                      className="rounded-lg overflow-hidden bg-stone-100 shadow-sm group-hover:shadow-xl transition-shadow duration-300"
                    >
                      <Image
                        src={resolveImageUrl(product.images[0]?.thumbnail ?? 'default.jpg')}
                        alt={product.name}
                        width={product.images[0]?.width || 400}
                        height={product.images[0]?.height || 400}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-[filter] duration-300"
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
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9
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
