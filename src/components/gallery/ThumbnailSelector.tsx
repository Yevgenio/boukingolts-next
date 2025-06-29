'use client';

import API_URL from '@/config/config';
import { useState, useEffect } from 'react';
import Image from 'next/image';
// import Image from 'next/image';
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
      <div className="flex gap-2 overflow-x-auto">
        {product.images.map((img, index) => (
            <button key={img._id} onClick={() => setActiveIndex(index)}>
            <Image
              src={`${API_URL}/api/uploads/${img.thumbnail}`}
              alt={`Thumbnail ${index + 1}`}
              width={80}
              height={80}
              className={`w-20 h-20 object-cover ${index === activeIndex ? 'ring-2 ring-black' : ''}`}
            />
            </button>
        ))}
      </div>
    );
  }
