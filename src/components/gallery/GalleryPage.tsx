'use client';

import { useEffect, useState, useCallback } from 'react';
import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import { getGalleryColumns } from '@/api/gallerySettings';

const ROW_HEIGHT: Record<2 | 3 | 4, number> = { 2: 450, 3: 260, 4: 180 };

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [columns, setColumns] = useState<2 | 3 | 4>(3);

  useEffect(() => {
    fetch(`${API_URL}/api/products/categories`, { cache: 'no-store' })
      .then(r => r.json()).then(setCategories).catch(() => {});
    getGalleryColumns().then(setColumns);
  }, []);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (selectedCategory) params.set('category', selectedCategory);
    const qs = params.toString();
    const url = `${API_URL}/api/products/search${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    const result = await res.json();
    setProducts(result.data);
  }, [query, selectedCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="flex items-end justify-between mb-2">
        <h1 className="text-4xl font-serif text-stone-800 tracking-tight">Gallery</h1>
        <GalleryAdminControls />
      </div>
      <div className="h-px bg-stone-200 mb-8" />

      {/* Search */}
      <input
        type="text"
        placeholder="Search artworks…"
        className="w-full border border-stone-300 rounded-lg px-4 py-2.5 mb-5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-400 text-sm"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
              selectedCategory === ''
                ? 'bg-stone-800 text-white'
                : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-800 text-white'
                  : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Masonry grid */}
      {products.length === 0 ? (
        <p className="text-center text-stone-400 italic py-16">No artworks found.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {products.map(p => {
            const w = p.images[0]?.width ?? 4;
            const h = p.images[0]?.height ?? 3;
            const ratio = w / h;
            const rowHeight = ROW_HEIGHT[columns];
            return (
              <div
                key={p._id}
                style={{ flexGrow: ratio, flexBasis: `${ratio * rowHeight}px`, height: `${rowHeight}px` }}
              >
                <GalleryItem product={p} />
              </div>
            );
          })}
          <div aria-hidden style={{ flexGrow: 999, flexBasis: 0 }} />
        </div>
      )}
    </div>
  );
}
