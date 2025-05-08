'use client'; 

import API_URL from '@/config/config';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function GalleryItemPage() {
  const { id } = useParams();
  interface Product {
    name: string;
    description: string;
    images: { url: string }[];
  }

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const res = await fetch(`${API_URL}/api/products/id/${id}`, { cache: 'no-store' });
      const data = await res.json();
      setProduct(data);
      setSelectedImage(data.images[0]?.url || null);
    }
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-4">
        <div className="w-full aspect-square border rounded-lg overflow-hidden">
          <img
            src={`${API_URL}/api/uploads/${selectedImage}`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {product.images.map((img: { url: string }, i: number) => (
            <button
              key={i}
              onClick={() => setSelectedImage(img.url)}
              className={`w-20 h-20 border rounded overflow-hidden flex-shrink-0 ${
                selectedImage === img.url ? 'ring-2 ring-black' : ''
              }`}
            >
              <img
                src={`${API_URL}/api/uploads/${img.url}`}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 text-lg">{product.description}</p>
      </div>
    </div>
  );
}
