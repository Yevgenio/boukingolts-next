'use client';
import React, { useState, useCallback } from 'react';
import API_URL, { IMAGE_URL } from '@/config/config';
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

export default function ImageUploadList({ images, setImages }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [library, setLibrary] = useState<ManagedImage[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryError, setLibraryError] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(file => ({ file, isNew: true }));
      setImages(prev => [...prev, ...files]);
    }
  };

  const remove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

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
        const imgs = await listImages();
        setLibrary(imgs);
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

  return (
    <div>
      <div className="flex gap-2 items-center">
        <label className="flex-1 cursor-pointer border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-600 bg-white hover:bg-stone-50 transition-colors">
          Upload new image{images.length > 0 ? 's' : ''}
          <input type="file" multiple accept="image/*" onChange={handleChange} className="hidden" />
        </label>
        <button
          type="button"
          onClick={openPicker}
          className={`px-3 py-2 rounded-lg text-sm border transition-colors ${pickerOpen ? 'bg-stone-800 text-white border-stone-800' : 'border-stone-300 text-stone-600 bg-white hover:bg-stone-50'}`}
        >
          Browse library {pickerOpen ? '▴' : '▾'}
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
                    : item.url
                    ? `${IMAGE_URL}/${item.url}`
                    : `${IMAGE_URL}/default.jpg`
                }
                alt="preview"
                className="w-12 h-12 object-cover rounded flex-shrink-0"
              />
              <div className="flex-1 min-w-0 text-sm">
                <p className="truncate text-stone-700">{item.isNew ? item.file?.name : item.url}</p>
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
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">Image library</p>
            {selected.size > 0 && (
              <button
                type="button"
                onClick={addSelected}
                className="bg-stone-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-stone-700"
              >
                Add {selected.size} selected
              </button>
            )}
          </div>
          {libraryLoading ? (
            <p className="text-sm text-stone-400 text-center py-6">Loading…</p>
          ) : libraryError ? (
            <p className="text-sm text-red-500 text-center py-6">Failed to load image library.</p>
          ) : library.length === 0 ? (
            <p className="text-sm text-stone-400 italic text-center py-6">No images in library</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-64 overflow-y-auto">
              {library.map(img => {
                const isSelected = selected.has(img._id);
                const isAdded = alreadyAddedIds.has(img._id);
                return (
                  <button
                    key={img._id}
                    type="button"
                    onClick={() => !isAdded && toggleSelect(img._id)}
                    title={img.url}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      isAdded
                        ? 'border-stone-200 opacity-40 cursor-not-allowed'
                        : isSelected
                        ? 'border-stone-800 ring-2 ring-stone-800'
                        : 'border-transparent hover:border-stone-400'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`${IMAGE_URL}/${img.thumbnail}`} alt={img.url} className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">✓</span>
                      </div>
                    )}
                    {isAdded && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="text-stone-500 text-xs font-medium">Added</span>
                      </div>
                    )}
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
