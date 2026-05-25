'use client';

import Image from 'next/image';
import API_URL from '@/config/config';
import { useState } from 'react';
import { Image as ImageType } from '@/types/Image';

interface Props {
  images: ImageType[];
  name: string;
}

export default function ProductImageViewer({ images, name }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 shadow-sm flex items-center justify-center text-stone-300 text-sm italic">
        No image
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative bg-stone-100 shadow-sm">
        <Image
          src={`${API_URL}/api/uploads/${images[activeIndex].url}`}
          alt={name}
          fill
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={img._id}
              onClick={() => setActiveIndex(index)}
              className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                index === activeIndex
                  ? 'ring-2 ring-stone-800 ring-offset-2'
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
