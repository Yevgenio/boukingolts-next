'use client';

import { useEffect, useState, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import { getGallerySettings, GallerySettings } from '@/api/gallerySettings';
import { useArtist } from '@/context/ArtistContext';
import { buildRows, computeRowHeight, itemWidth } from '@/utils/galleryLayout';

const DEFAULTS: GallerySettings = { targetHeight: 280, variance: 100 };

type DropdownOption = { value: string; label: string };

function FilterDropdown({
  placeholder,
  options,
  selected,
  onSelect,
}: {
  placeholder: string;
  options: DropdownOption[];
  selected: string;
  onSelect: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = !!selected;
  const displayLabel = options.find(o => o.value === selected)?.label ?? placeholder;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm transition-colors whitespace-nowrap ${
          active
            ? 'bg-stone-800 text-white'
            : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'
        }`}
      >
        {displayLabel}
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className={`transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[160px] max-w-[220px] bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-20">
          {active && (
            <button
              onClick={() => { onSelect(''); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs text-stone-400 hover:bg-stone-50 transition-colors border-b border-stone-100"
            >
              Clear
            </button>
          )}
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-stone-50 truncate ${
                selected === opt.value ? 'text-stone-900 font-medium' : 'text-stone-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryPageInner({ initialProducts }: { initialProducts?: Product[] }) {
  const searchParams = useSearchParams();
  const artist = useArtist();
  const artistQs = artist !== 'all' ? `artist=${artist}&` : '';
  const [products, setProducts] = useState<Product[]>(initialProducts ?? []);
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesList, setSeriesList] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '');
  const [selectedSeries, setSelectedSeries] = useState(searchParams.get('series') ?? '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') ?? '');

  // Sync URL params → state when navigating here from the header dropdown
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') ?? '');
    setSelectedSeries(searchParams.get('series') ?? '');
    setSelectedTag(searchParams.get('tag') ?? '');
  }, [searchParams]);
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
    fetch(`${API_URL}/products/categories?${artistQs}`, { cache: 'no-store' })
      .then(r => r.json()).then(setCategories).catch(() => {});
    fetch(`${API_URL}/products/series?${artistQs}`, { cache: 'no-store' })
      .then(r => r.json()).then(setSeriesList).catch(() => {});
    getGallerySettings().then(setSettings);
  }, [artist]);

  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams();
    if (artist !== 'all') params.set('artist', artist);
    if (query) params.set('query', query);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedSeries) params.set('series', selectedSeries);
    if (selectedTag) params.set('tag', selectedTag);
    if (availableOnly) params.set('forSale', 'true');
    if (sort) params.set('sort', sort);
    const qs = params.toString();
    const res = await fetch(`${API_URL}/products/search${qs ? `?${qs}` : ''}`, { cache: 'no-store' });
    const result = await res.json();
    setProducts(result.data);
  }, [artist, query, selectedCategory, selectedSeries, selectedTag, availableOnly, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const rows = useMemo(
    () => buildRows(products, containerWidth, settings.targetHeight, settings.variance),
    [products, containerWidth, settings]
  );

  const activeFilterCount = [selectedCategory, selectedSeries, selectedTag, availableOnly, sort].filter(Boolean).length;
  const clearFilters = () => { setSelectedCategory(''); setSelectedSeries(''); setSelectedTag(''); setAvailableOnly(false); setSort(''); };

  const categoryOptions: DropdownOption[] = categories.map(c => ({ value: c, label: c }));
  const seriesOptions: DropdownOption[] = seriesList.map(s => ({ value: s, label: s }));
  const sortOptions: DropdownOption[] = [{ value: 'recent', label: 'Newest first' }];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <div className="flex items-end justify-between mb-2">
        <h1 className="text-4xl font-serif text-stone-800 tracking-tight">Gallery</h1>
        <GalleryAdminControls />
      </div>
      <div className="h-px bg-stone-200 mb-8" />

      <input
        type="text"
        placeholder="Search artworks…"
        className="w-full border border-stone-300 rounded-lg px-4 py-2.5 mb-5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-400 text-sm"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {/* Compact single-row filter bar */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {categoryOptions.length > 0 && (
          <FilterDropdown
            placeholder="Category"
            options={categoryOptions}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}
        {seriesOptions.length > 0 && (
          <FilterDropdown
            placeholder="Series"
            options={seriesOptions}
            selected={selectedSeries}
            onSelect={setSelectedSeries}
          />
        )}
        {selectedTag && (
          <button
            onClick={() => setSelectedTag('')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm bg-stone-800 text-white"
          >
            #{selectedTag}
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
        <button
          onClick={() => setAvailableOnly(v => !v)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            availableOnly
              ? 'bg-stone-800 text-white'
              : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'
          }`}
        >
          Available
        </button>
        <FilterDropdown
          placeholder="Sort"
          options={sortOptions}
          selected={sort}
          onSelect={setSort}
        />

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-stone-400">
            {products.length} {products.length === 1 ? 'work' : 'works'}
          </span>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Gallery grid */}
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

export default function GalleryPage({ initialProducts }: { initialProducts?: Product[] }) {
  return (
    <Suspense>
      <GalleryPageInner initialProducts={initialProducts} />
    </Suspense>
  );
}
