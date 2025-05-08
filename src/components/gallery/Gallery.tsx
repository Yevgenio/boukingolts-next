// /src/components/Gallery/Gallery.tsx
'use client';

import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import GalleryItem from '@/components/gallery/GalleryItem';

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
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
        // TODO: Replace with real admin check
        const authRes = await fetch(`${API_URL}/api/auth/me`, { method: 'GET', credentials: 'include' });
        const authData = await authRes.json();
        setIsAdmin(authData.role === 'admin');
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleEdit = (id: string) => {
    console.log('Edit product:', id);
    // open modal or navigate
  };

  const handleDelete = (id: string) => {
    console.log('Delete product:', id);
    // confirm and delete logic
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      {isAdmin && (
        <div className="mb-6 text-center">
          <button
        onClick={() => window.location.href = '/gallery/create'}
        className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
          >
        + Add New
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <GalleryItem
            key={product._id}
            product={product}
            //isAdmin={isAdmin}
            //onEdit={handleEdit}
            //onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
