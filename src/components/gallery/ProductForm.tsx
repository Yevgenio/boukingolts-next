'use client';

import React, { useState, useEffect } from 'react';
import API_URL from '@/config/config';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // If editing, fetch existing product data
  useEffect(() => {
    if (mode === 'edit' && productId) {
      const fetchProduct = async () => {
        const res = await fetch(`${API_URL}/api/products/id/${productId}`);
        const data = await res.json();
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
      };
      fetchProduct();
    }
  }, [mode, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);

    if (images) {
      Array.from(images).forEach((file) => {
        formData.append('images', file);
      });
    }

    try {
      let res;
      if (mode === 'create') {
        res = await fetch(`${API_URL}/api/products`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      } else if (mode === 'edit' && productId) {
        res = await fetch(`${API_URL}/api/products/id/${productId}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        });
      }

      if (!res || !res.ok) throw new Error('Failed to submit product');

      setSuccess(true);
      router.push('/gallery');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Create New Product' : 'Edit Product'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages(e.target.files)}
            className="w-full mt-1"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Product submitted successfully!</p>}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  );
}
