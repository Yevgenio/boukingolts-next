'use client';

import API_URL from '@/config/config';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types/Product';

export default function ThumbnailSelector({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const images = document.querySelectorAll('.gallery-main-image');
    images.forEach((img, i) => {
      img.classList.toggle('opacity-100', i === activeIndex);
      img.classList.toggle('opacity-0', i !== activeIndex);
    });
  }, [activeIndex]);

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {product.images.map((img, index) => (
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
  );
}
