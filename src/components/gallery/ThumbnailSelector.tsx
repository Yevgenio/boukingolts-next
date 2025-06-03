'use client';

import API_URL from '@/config/config';
import { useState, useEffect } from 'react';
// import Image from 'next/image';

interface ImageType {
  url: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: ImageType[];
}

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
            <img
              src={`${API_URL}/api/uploads/${img.url}`}
              alt={`Thumbnail ${index + 1}`}
              className={`w-20 h-20 ${index === activeIndex ? 'ring-2 ring-black' : ''}`}
            />
          </button>
        ))}
      </div>
    );
  }
