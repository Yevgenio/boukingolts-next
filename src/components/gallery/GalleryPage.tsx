'use client';

import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import { getGallerySettings, GallerySettings } from '@/api/gallerySettings';
import { buildRows, computeRowHeight, itemWidth } from '@/utils/galleryLayout';

const DEFAULTS: GallerySettings = { targetHeight: 280, variance: 100 };

const PILL = (active: boolean) =>
  `px-4 py-1.5 rounded-full text-sm transition-colors ${
    active
      ? 'bg-stone-800 text-white'
      : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'
  }`;

const FILTER_SELECT =
  'border border-stone-300 rounded-full px-4 py-1.5 text-sm bg-white text-stone-600 ' +
  'hover:border-stone-500 hover:text-stone-800 cursor-pointer focus:outline-none transition-colors appearance-none pr-8';

export default function GalleryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState('');
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
    fetch(`${API_URL}/api/products/series`, { cache: 'no-store' })
      .then(r => r.json()).then(setSeriesList).catch(() => {});
    getGallerySettings().then(setSettings);
  }, []);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSeries) params.set('series', selectedSeries);
    if (availableOnly) params.set('forSale', 'true');
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    const res = await fetch(`${API_URL}/api/products/search${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
    const result = await res.json();
    setProducts(result.data);
  }, [query, selectedCategory, selectedSeries, availableOnly, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const rows = useMemo(
    () => buildRows(products, containerWidth, settings.targetHeight, settings.variance),
    [products, containerWidth, settings]
  );

  const activeFilterCount = [selectedSeries, availableOnly, sort].filter(Boolean).length;

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
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => setSelectedCategory('')} className={PILL(selectedCategory === '')}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={PILL(selectedCategory === cat)}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Secondary filter bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-8 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-2 flex-wrap">

          {/* Series dropdown */}
          {seriesList.length > 0 && (
            <div className="relative">
              <select
                value={selectedSeries}
                onChange={e => setSelectedSeries(e.target.value)}
                className={FILTER_SELECT}
              >
                <option value="">All series</option>
                {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">▾</span>
            </div>
          )}

          {/* Available toggle */}
          <button
            onClick={() => setAvailableOnly(v => !v)}
            className={PILL(availableOnly)}
          >
            Available
          </button>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className={FILTER_SELECT}
            >
              <option value="">Default order</option>
              <option value="recent">Newest first</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs">▾</span>
          </div>

          {/* Clear active filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setSelectedSeries(''); setAvailableOnly(false); setSort(''); }}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>

        <span className="text-xs text-stone-400">{products.length} {products.length === 1 ? 'work' : 'works'}</span>
      </div>

      {/* Gallery */}
      <div ref={containerRef}>
        {products.length === 0 ? (
          <p className="text-center text-stone-400 italic py-16">No artworks found.</p>
        ) : (
          <div className="flex flex-col gap-2">
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
    </div>
  );
}
