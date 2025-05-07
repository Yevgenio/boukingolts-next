'use client';

import React, { useState } from 'react';
import API_URL from '@/config/config';
import { useRouter } from 'next/navigation';

export default function CreateProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

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
    console.log('FormData:', formData); // Debugging line
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create product');

      setSuccess(true);
      router.push('/gallery'); // Redirect or refresh
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
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
        {success && <p className="text-green-600">Product created successfully!</p>}
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Create
        </button>
      </form>
    </div>
  );
}
