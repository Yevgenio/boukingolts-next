// components/GalleryItem.tsx
'use client';

import { useState } from 'react';

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
    <div
      className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={`https://boukingolts.art/api/uploads/${product.images[0]?.url}`}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
      </div>

      {isAdmin && (
        <div
          className={`absolute top-2 right-2 flex gap-2 transition-all duration-300 ${
            hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <button
            onClick={() => onEdit(product._id)}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
