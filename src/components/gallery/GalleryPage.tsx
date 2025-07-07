'use client';

import { useEffect, useState , useCallback } from 'react';
import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/api/products/categories`);
    const data = await res.json();
    setCategories(data);
  };


  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    const url = new URL(`${API_URL}/api/products/search`);
    if (query) url.searchParams.set('query', query);
    if (selectedCategory) url.searchParams.set('category', selectedCategory);
    const res = await fetch(url.toString());
    const result = await res.json();
    setProducts(result.data);
  }, [query, selectedCategory]);

  useEffect(() => {
    fetchProducts();
  }, [query, selectedCategory]);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Gallery</h1>
        <GalleryAdminControls />
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name, description or category..."
        className="w-full border px-4 py-2 mb-4 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Category Buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1 rounded border ${selectedCategory === '' ? 'bg-black text-white' : ''}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded border ${selectedCategory === cat ? 'bg-black text-white' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {products.map((product) => (
          <div key={product._id} className="break-inside-avoid">
            <GalleryItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
