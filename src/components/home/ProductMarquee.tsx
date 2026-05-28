import { useEffect, useRef } from 'react';
import API_URL from '@/config/config';
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
  const ratio = (img?.width ?? 4) / (img?.height ?? 3);
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

    // Measured once on mount — items are fixed-size so this never changes
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

  return (
    <section className="w-full py-14">
      <div className="text-center mb-8 px-6">
        <h2 className="text-3xl font-serif text-stone-800">Our Collection</h2>
        <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
      </div>
      <div className="relative overflow-hidden border-y border-stone-200 py-6">
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
                        src={`${API_URL}/api/uploads/${product.images[0]?.thumbnail}`}
                        alt={product.name}
                        width={product.images[0]?.width || 400}
                        height={product.images[0]?.height || 500}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
