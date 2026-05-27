'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import { getGallerySettings, GallerySettings } from '@/api/gallerySettings';
import { buildRows, computeRowHeight, itemWidth } from '@/utils/galleryLayout';

const DEFAULTS: GallerySettings = { targetHeight: 280, variance: 100 };

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [settings, setSettings] = useState<GallerySettings>(DEFAULTS);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1232);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setContainerWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/products/categories`, { cache: 'no-store' })
      .then(r => r.json()).then(setCategories).catch(() => {});
    getGallerySettings().then(setSettings);
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

  const rows = useMemo(
    () => buildRows(products, containerWidth, settings.targetHeight, settings.variance),
    [products, containerWidth, settings]
  );

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

      {/* Gallery */}
      {products.length === 0 ? (
        <p className="text-center text-stone-400 italic py-16">No artworks found.</p>
      ) : (
        <div ref={containerRef} className="flex flex-col gap-2">
          {rows.map((row, rowIdx) => {
            const isLast = rowIdx === rows.length - 1;
            const rh = computeRowHeight(row, containerWidth, settings.targetHeight, isLast);
            return (
              <div key={rowIdx} className="flex gap-2">
                {row.map(p => (
                  <div key={p._id} style={{ width: itemWidth(p, rh), height: rh, flexShrink: 0 }}>
                    <GalleryItem product={p} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
