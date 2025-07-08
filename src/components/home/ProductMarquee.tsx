
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

    const animate = (timestamp: number) => {
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

    window.addEventListener('scroll', handleScroll);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const doubled = [...products, ...products];

  return (
    <div
    className="relative overflow-hidden w-full border-y py-4"
    // style={{ transform: 'rotate(20deg)', transformOrigin: 'left center' }}
    >
      <div
        ref={trackRef}
        className="flex gap-6 whitespace-nowrap overflow-x-hidden"
        style={{ willChange: 'transform' }}
      >
        {doubled.map((product, idx) => (
          <Link
            href={`/gallery/${product._id}`}
            key={idx}
            className="flex-shrink-0 w-48"
          >
            <div className="w-48 h-64 rounded overflow-hidden shadow-md bg-white" >
              <Image
                src={`${API_URL}/api/uploads/${product.images[0]?.thumbnail}`}
                alt={product.name}
                width={192}
                height={256}
                className="w-full h-full object-cover"
              />
            </div>
            {/* <p className="text-sm mt-1 text-center">{product.name}</p> */}
          </Link>
        ))}
      </div>
    </div>
  );
}
