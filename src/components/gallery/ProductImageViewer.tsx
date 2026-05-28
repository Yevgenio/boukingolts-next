'use client';

import Image from 'next/image';
import API_URL from '@/config/config';
import { useState, useRef, useCallback } from 'react';
import { Image as ImageType } from '@/types/Image';

interface Props {
  images: ImageType[];
  name: string;
}

const ZOOM = 2.5;

export default function ProductImageViewer({ images, name }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lensRef = useRef<HTMLDivElement>(null);

  const applyTransform = useCallback((scale: number, tx = 0, ty = 0, animated = false) => {
    if (!lensRef.current) return;
    lensRef.current.style.transition = animated ? 'transform 0.2s ease-out' : 'none';
    lensRef.current.style.transform = `scale(${scale}) translate(${tx}%, ${ty}%)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    applyTransform(ZOOM, 0, 0, true);
  }, [applyTransform]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    applyTransform(ZOOM, (0.5 - x) * 100, (0.5 - y) * 100, false);
  }, [applyTransform]);

  const handleMouseLeave = useCallback(() => {
    applyTransform(1, 0, 0, true);
  }, [applyTransform]);

  if (!images.length) {
    return (
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm flex items-center justify-center text-stone-300 text-sm italic">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="w-full aspect-square rounded-xl overflow-hidden relative bg-stone-100 shadow-sm cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <div ref={lensRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
          <Image
            src={`${API_URL}/api/uploads/${images[activeIndex].url}`}
            alt={name}
            fill
            className="object-contain"
          />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-1">
          {images.map((img, index) => (
            <button
              key={img._id}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-stone-800'
                  : 'opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={`${API_URL}/api/uploads/${img.thumbnail}`}
                alt={`View ${index + 1}`}
                width={72}
                height={72}
                className="w-16 h-16 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
