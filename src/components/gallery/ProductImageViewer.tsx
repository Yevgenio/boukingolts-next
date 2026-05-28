'use client';

import Image from 'next/image';
import API_URL from '@/config/config';
import { useState, useRef } from 'react';
import { Image as ImageType } from '@/types/Image';

interface Props {
  images: ImageType[];
  name: string;
}

export default function ProductImageViewer({ images, name }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCursor({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  if (!images.length) {
    return (
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 shadow-sm flex items-center justify-center text-stone-300 text-sm italic">
        No image
      </div>
    );
  }

  // When zoomed 2.5x, translate so the cursor point stays centred in view
  const tx = (0.5 - cursor.x) * 100;
  const ty = (0.5 - cursor.y) * 100;

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={containerRef}
        className="w-full aspect-square rounded-xl overflow-hidden relative bg-stone-100 shadow-sm cursor-crosshair"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={`${API_URL}/api/uploads/${images[activeIndex].url}`}
          alt={name}
          fill
          className="object-contain"
          style={{
            transform: zoomed ? `scale(2.5) translate(${tx}%, ${ty}%)` : 'scale(1)',
            transition: 'transform 0.15s ease-out',
          }}
        />
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
