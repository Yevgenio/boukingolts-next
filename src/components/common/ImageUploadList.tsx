'use client';
import React, { useState, useCallback } from 'react';
import API_URL, { resolveImageUrl } from '@/config/config';
import { listImages, ManagedImage } from '@/api/images';

export interface ImageItem {
  file?: File;
  url?: string;
  id?: string;
  isNew?: boolean;
}

interface Props {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function basename(url: string): string {
  return url.split('/').pop() ?? url;
}

export default function ImageUploadList({ images, setImages }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [library, setLibrary] = useState<ManagedImage[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({ file, isNew: true }));
      setImages(prev => [...prev, ...files]);
    }
  };

  const remove = (index: number) => setImages(prev => prev.filter((_, i) => i !== index));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages(prev => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const openPicker = useCallback(async () => {
    setPickerOpen(prev => !prev);
    if (!pickerOpen && library.length === 0) {
      setLibraryLoading(true);
      setLibraryError(false);
      try {
        setLibrary(await listImages());
      } catch {
        setLibraryError(true);
      } finally {
        setLibraryLoading(false);
      }
    }
  }, [pickerOpen, library.length]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const addSelected = () => {
    const alreadyAdded = new Set(images.map(img => img.id).filter(Boolean));
    const toAdd = library
      .filter(img => selected.has(img._id) && !alreadyAdded.has(img._id))
      .map(img => ({ isNew: false, id: img._id, url: img.url }));
    setImages(prev => [...prev, ...toAdd]);
    setSelected(new Set());
    setPickerOpen(false);
  };

  const alreadyAddedIds = new Set(images.map(img => img.id).filter(Boolean));

  const filtered = library.filter(img =>
    !search.trim() || basename(img.url).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex gap-2 items-center">
        <label className="flex-1 cursor-pointer border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white hover:bg-stone-50 transition-colors">
          {images.length > 0 ? 'Загрузить ещё' : 'Загрузить изображение'}
          <input type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
        </label>
        <button
          type="button"
          onClick={openPicker}
          className={`px-3 py-2 rounded-lg text-sm border transition-colors ${pickerOpen ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 bg-white hover:bg-stone-50'}`}
        >
          Библиотека {pickerOpen ? '▴' : '▾'}
        </button>
      </div>

      {images.length > 0 && (
        <ul className="mt-3 space-y-2">
          {images.map((item, index) => (
            <li key={index} className="flex items-center gap-3 border border-stone-100 rounded-lg p-2 bg-stone-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  item.isNew && item.file
                    ? URL.createObjectURL(item.file)
                    : resolveImageUrl(item.url ?? 'default.jpg')
                }
                alt="preview"
                className="w-12 h-12 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0 text-sm">
                <p className="truncate text-stone-700">{item.isNew ? item.file?.name : basename(item.url ?? '')}</p>
                {item.isNew && item.file && (
                  <p className="text-xs text-stone-400">{formatSize(item.file.size)}</p>
                )}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0} className="px-2 py-1 text-xs border border-stone-200 rounded text-stone-500 disabled:opacity-30">↑</button>
                <button type="button" onClick={() => move(index, index + 1)} disabled={index === images.length - 1} className="px-2 py-1 text-xs border border-stone-200 rounded text-stone-500 disabled:opacity-30">↓</button>
                <button type="button" onClick={() => remove(index)} className="px-2 py-1 text-xs border border-stone-200 rounded text-red-500 hover:text-red-700">✕</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pickerOpen && (
        <div className="mt-3 border border-stone-200 rounded-xl bg-white p-3">
          {/* Header row */}
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest flex-1">Библиотека изображений</p>
            {/* Grid / List toggle */}
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              title="Сетка"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-700'}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              title="Список"
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-stone-800 text-white' : 'text-stone-400 hover:text-stone-700'}`}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                <circle cx="3" cy="6" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </button>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={addSelected}
                className="bg-stone-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-stone-700"
              >
                Добавить: {selected.size}
              </button>
            )}
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Поиск по имени файла…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mb-3 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-700 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-400"
          />

          {libraryLoading ? (
            <p className="text-sm text-stone-400 text-center py-6">Загрузка…</p>
          ) : libraryError ? (
            <p className="text-sm text-red-500 text-center py-6">Ошибка загрузки библиотеки.</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-stone-400 italic text-center py-6">{library.length === 0 ? 'Библиотека пуста' : 'Нет результатов'}</p>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
              {filtered.map(img => {
                const isSelected = selected.has(img._id);
                const isAdded = alreadyAddedIds.has(img._id);
                return (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => !isAdded && toggleSelect(img._id)}
                    title={basename(img.url)}
                    className={`relative w-full rounded-lg overflow-hidden border-2 transition-all ${
                      isAdded ? 'border-stone-200 opacity-40 cursor-not-allowed'
                        : isSelected ? 'border-stone-800 ring-2 ring-stone-800'
                        : 'border-transparent hover:border-stone-400'
                    }`}
                    style={{ paddingBottom: '100%' }}
                  >
                    <div className="absolute inset-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveImageUrl(img.thumbnail)} alt={img.url} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
                          <span className="text-white text-lg font-bold">✓</span>
                        </div>
                      )}
                      {isAdded && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <span className="text-stone-500 text-xs font-medium">Добавлено</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
              {filtered.map(img => {
                const isSelected = selected.has(img._id);
                const isAdded = alreadyAddedIds.has(img._id);
                const name = basename(img.url);
                const usedCount = img.usedIn?.length ?? 0;
                return (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => !isAdded && toggleSelect(img._id)}
                    className={`flex items-center gap-3 w-full px-2 py-1.5 rounded-lg text-left transition-colors ${
                      isAdded ? 'opacity-40 cursor-not-allowed bg-stone-50'
                        : isSelected ? 'bg-stone-100 ring-1 ring-stone-400'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded flex-shrink-0 overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resolveImageUrl(img.thumbnail)} alt={name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-stone-800 truncate font-medium">{name}</p>
                      <p className="text-[10px] text-stone-400">
                        {img.size ? formatSize(img.size) : ''}
                        {img.size && usedCount > 0 ? ' · ' : ''}
                        {usedCount > 0 ? `используется: ${usedCount}` : ''}
                        {img.width && img.height ? `${img.size || usedCount > 0 ? ' · ' : ''}${img.width}×${img.height}` : ''}
                      </p>
                    </div>
                    {isSelected && (
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="text-stone-700 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {isAdded && <span className="text-[10px] text-stone-400 flex-shrink-0">Добавлено</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
