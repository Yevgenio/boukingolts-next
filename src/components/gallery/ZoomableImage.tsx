'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import API_URL from '@/config/config';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-full overflow-hidden"
    >
      <Image
        src={`${API_URL}/api/uploads/${src}`}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300"
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
          transform: 'scale(2)', // You can adjust zoom level here
        }}
      />
    </div>
  );
}
