// /src/components/Gallery/GalleryItem.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import API_URL from '@/config/config';
import Image from 'next/image';

interface Image {
  url: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: Image[];
}

export default function GalleryItem({
  product,
  isAdmin,
  onEdit,
  onDelete,
}: {
  product: Product;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link href={`/gallery/${product._id}`}>
      <div
        className="relative aspect-[2/3] border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={`${API_URL}/api/uploads/${product.images[0]?.url}`}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
    
        {/* Gradient overlay with text */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-4">
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="text-sm">{product.description}</p>
          <p className="text-sm">{product._id}</p>
        </div>
    
        {isAdmin && (
          <div
            className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
              hovered ? 'opacity-100 scale-80' : 'opacity-0 scale-75'
            }`}
          >
            <button
              onClick={() => onEdit(product._id)}
              className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="8"
                  y1="8"
                  x2="16"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <line
                  x1="16"
                  y1="8"
                  x2="8"
                  y2="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </Link>
  );
  
}
