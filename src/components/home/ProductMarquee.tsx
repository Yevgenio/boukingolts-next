
import { useEffect, useRef } from 'react';
import API_URL from '@/config/config';
import Image from 'next/image';
import { Product } from '@/types/Product';
import Link from 'next/link';

interface Props {
  products: Product[];
}

export default function ProductMarquee({ products }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBoostRef = useRef(0);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY.current;
      lastScrollY.current = currentY;

      // Scroll down = positive boost, up = negative boost
      scrollBoostRef.current += deltaY * 0.5; // adjust sensitivity
    };

    let animationFrameId: number;
    // let lastTimestamp = performance.now();
    const baseSpeed = 0.6;

    const animate = () => {
      // const delta = timestamp - lastTimestamp;
      // lastTimestamp = timestamp;

      const scrollBoost = scrollBoostRef.current;
      scrollBoostRef.current *= 0.9; // decay

      const totalSpeed = baseSpeed + scrollBoost * 0.2;

      const track = trackRef.current;
      if (!track) return;

      track.scrollLeft += totalSpeed;

      if (track.scrollLeft >= track.scrollWidth / 2) {
        track.scrollLeft = 0;
      } else if (track.scrollLeft < 0) {
        track.scrollLeft = track.scrollWidth / 2;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [products]);

  const doubled = [...products, ...products];

  if (!products.length) return null;

  return (
    <section className="w-full py-14">
      <div className="text-center mb-8 px-6">
        <h2 className="text-3xl font-serif text-stone-800">Our Collection</h2>
        <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
      </div>
      <div className="relative overflow-hidden border-y border-stone-200 py-6">
        <div
          ref={trackRef}
          className="flex gap-5 whitespace-nowrap overflow-x-hidden"
          style={{ willChange: 'transform' }}
        >
          {doubled.map((product, idx) => (
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
      </div>
    </section>
  );
}
