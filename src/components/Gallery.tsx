'use client';

import { useEffect, useState } from 'react';
import API_URL from '@/config/config';

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

export default function Gallery() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product._id} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
          <img
            src={`https://boukingolts.art/api/uploads/${product.images[0]?.url}`}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
