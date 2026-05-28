import { useEffect, useRef } from 'react';
import API_URL from '@/config/config';
import Image from 'next/image';
import { Product } from '@/types/Product';
import Link from 'next/link';

interface Props {
  products: Product[];
}

const BASE_SPEED = 0.04; // px/ms — ~0.67px/frame at 60fps
const MAX_BOOST  = 3;    // cap so a fast wheel scroll doesn't cause a jump
const BOOST_GAIN = 0.03; // how much each scrolled-down px adds to boost
const DECAY_RATE = 0.88; // boost fraction remaining per 16.67ms frame

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
      if (dy > 0) boostRef.current = Math.min(boostRef.current + dy * BOOST_GAIN, MAX_BOOST);
    };

    let rafId: number;
    let lastTs = performance.now();

    const animate = (ts: number) => {
      // Cap delta so tab-switching doesn't cause a single giant jump
      const delta = Math.min(ts - lastTs, 50);
      lastTs = ts;

      boostRef.current *= Math.pow(DECAY_RATE, delta / 16.67);

      const speed = (BASE_SPEED + boostRef.current) * delta;

      // Measure the true half-width from the first copy div (includes trailing padding)
      const half = (track.firstElementChild as HTMLElement)?.offsetWidth ?? track.scrollWidth / 2;

      offsetRef.current += speed;
      if (offsetRef.current >= half) offsetRef.current -= half;

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
        {/* Two identical copies side-by-side. pr-5 on each copy adds the trailing gap so
            the right edge of copy 1 connects seamlessly with the left edge of copy 2. */}
        <div ref={trackRef} className="flex will-change-transform">
          {[0, 1].map(copy => (
            <div key={copy} className="flex gap-5 pr-5 flex-shrink-0">
              {products.map((product, idx) => (
                <Link href={`/gallery/${product._id}`} key={idx} className="flex-shrink-0 w-44 group">
                  <div className="w-44 h-60 rounded-lg overflow-hidden bg-stone-100 shadow-sm group-hover:shadow-md transition-shadow">
                    <Image
                      src={`${API_URL}/api/uploads/${product.images[0]?.thumbnail}`}
                      alt={product.name}
                      width={176}
                      height={240}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
