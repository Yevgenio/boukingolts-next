'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { Product } from '@/types/Product';
import API_URL from '@/config/config';

export default function RelatedProductsRow({ title, products }: { title: string; products: Product[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const update = () => {
      setCanLeft(el.scrollLeft > 4);
      setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [products]);

  if (!products.length) return null;

  const scroll = (dir: 'left' | 'right') => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -el.clientWidth : el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <h3 className="text-xl font-serif text-stone-800 mb-5">{title}</h3>
      <div className="relative">

        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9
            bg-white border border-stone-200 shadow-md rounded-full
            flex items-center justify-center text-stone-500 hover:text-stone-900
            transition-all duration-200 ${canLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Scroll container */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map(p => (
            <Link key={p._id} href={`/gallery/${p._id}`} className="flex-none w-44 group">
              <div className="w-44 h-56 rounded-xl overflow-hidden bg-stone-100 shadow-sm group-hover:shadow-lg transition-shadow duration-300 mb-2.5">
                <Image
                  src={`${API_URL}/api/uploads/${p.images[0]?.thumbnail}`}
                  alt={p.name}
                  width={p.images[0]?.width || 400}
                  height={p.images[0]?.height || 500}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <p className="text-sm text-stone-800 font-medium leading-snug line-clamp-2 group-hover:text-stone-600 transition-colors">
                {p.name}
              </p>
              {p.series && (
                <p className="text-xs text-stone-400 mt-0.5 truncate">{p.series}</p>
              )}
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9
            bg-white border border-stone-200 shadow-md rounded-full
            flex items-center justify-center text-stone-500 hover:text-stone-900
            transition-all duration-200 ${canRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

      </div>
    </div>
  );
}
