'use client';

import React, { useState, useEffect } from 'react';
import API_URL from '@/config/config';
import { useRouter } from 'next/navigation';
import { Image } from '@/types/Image';

interface ImageItem {
  file?: File;
  url?: string;
  id?: string;
  isNew?: boolean;
}

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  // const [images, setImages] = useState<FileList | null>(null);

  const [images, setImages] = useState<ImageItem[]>([]);
  const [rank, setRank] = useState<number | ''>('');
  const [featured, setFeatured] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePercent, setSalePercent] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');

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

        setRank(data.rank ?? '');
        setFeatured(data.featured ?? '');
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setPrice(data.price ?? '');
        setSalePercent(data.salePercent ?? '');
        if (data.price && data.salePercent) {
          setSalePrice(Number(data.price) - (Number(data.price) * Number(data.salePercent)) / 100);
        }
        if (Array.isArray(data.images)) {
          setImages(
            data.images.map((img: Image) => ({
              url: img.url,
              id: img._id,
              isNew: false,
            }))
          );
        }
      };
      fetchProduct();
    }
  }, [mode, productId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((file) => ({
        file,
        isNew: true,
      }));
      setImages((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleSalePercentChange = (value: string) => {
    if (value === '') {
      setSalePercent('');
      setSalePrice('');
      return;
    }
    const perc = Number(value);
    setSalePercent(perc);
    if (price !== '') {
      const p = Number(price);
      setSalePrice(Number((p - (p * perc) / 100).toFixed(2)));
    }
  };

  const handleSalePriceChange = (value: string) => {
    if (value === '') {
      setSalePrice('');
      setSalePercent('');
      return;
    }
    const sp = Number(value);
    setSalePrice(sp);
    if (price !== '') {
      const p = Number(price);
      setSalePercent(Number(((1 - sp / p) * 100).toFixed(2)));
    }
  };

  useEffect(() => {
    if (price !== '' && salePercent !== '') {
      const p = Number(price);
      const perc = Number(salePercent);
      setSalePrice(Number((p - (p * perc) / 100).toFixed(2)));
    }
  }, [price, salePercent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    if (rank !== '') formData.append('rank', String(rank));
    formData.append('featured', String(featured));
    if (tags.trim()) formData.append('tags', tags);
    if (price !== '') formData.append('price', String(price));
    if (salePercent !== '') formData.append('salePercent', String(salePercent));

 if (images.length) {
      const sortedImages = images.map((img) => {
        if (img.isNew && img.file) {
          return { new: true, filename: img.file.name };
        }
        return { new: false, id: img.id };
      });
      formData.append('sortedImages', JSON.stringify(sortedImages));

      images
        .filter((img) => img.isNew && img.file)
        .forEach((img) => {
          formData.append('images', img.file as File);
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
          <label className="block text-sm font-medium">Rank</label>
          <input
            type="number"
            value={rank}
            onChange={(e) =>
              setRank(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={rank}
            onChange={(e) =>
              setFeatured(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full mt-1 border rounded px-3 py-2"
          />
          <label htmlFor="featured" className="text-sm font-medium">
            Featured
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) =>
              setPrice(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Sale</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.01"
              placeholder="%"
              value={salePercent}
              onChange={(e) => handleSalePercentChange(e.target.value)}
              className="w-1/3 border rounded px-3 py-2"
            />
            <span>-</span>
            <input
              type="number"
              step="0.01"
              placeholder="Final"
              value={salePrice}
              onChange={(e) => handleSalePriceChange(e.target.value)}
              className="w-1/3 border rounded px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full mt-1"
          />
          {images.length > 0 && (
            <ul className="mt-2 space-y-2">
              {images.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      item.isNew && item.file
                        ? URL.createObjectURL(item.file)
                        : `${API_URL}/api/uploads/${item.url}`
                    }
                    alt="preview"
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 text-sm">
                    <p>{item.isNew ? item.file?.name : item.url}</p>
                    {item.isNew && item.file && (
                      <p className="text-xs text-gray-500">
                        {(item.file.size / 1024).toFixed(1)} KB
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(index, index - 1)}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs border rounded"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, index + 1)}
                      disabled={index === images.length - 1}
                      className="px-2 py-1 text-xs border rounded"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="px-2 py-1 text-xs border rounded text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
