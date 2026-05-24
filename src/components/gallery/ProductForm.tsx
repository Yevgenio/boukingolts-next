'use client';

import React, { useState, useEffect } from 'react';
import API_URL from '@/config/config';
import { useRouter } from 'next/navigation';
import { Image } from '@/types/Image';

import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import RichTextEditor from '@/components/common/RichTextEditor';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

const LABEL = 'block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1';
const INPUT = 'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-sm placeholder:text-stone-400';

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [rank, setRank] = useState<number | ''>('');
  const [featured, setFeatured] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [salePercent, setSalePercent] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (mode === 'edit' && productId) {
      const fetchProduct = async () => {
        const res = await fetch(`${API_URL}/api/products/id/${productId}`);
        const data = await res.json();
        setName(data.name || '');
        setDescription(data.description || '');
        setCategory(data.category || '');
        setRank(data.rank ?? '');
        setFeatured(data.featured ?? '');
        setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
        setPrice(data.price ?? '');
        setSalePercent(data.salePercent ?? '');
        if (data.price && data.salePercent) {
          setSalePrice(Number(data.price) - (Number(data.price) * Number(data.salePercent)) / 100);
        }
        if (Array.isArray(data.images)) {
          setImages(data.images.map((img: Image) => ({ url: img.url, id: img._id, isNew: false })));
        }
      };
      fetchProduct();
    }
  }, [mode, productId]);

  const handleSalePercentChange = (value: string) => {
    if (value === '') { setSalePercent(''); setSalePrice(''); return; }
    const perc = Number(value);
    setSalePercent(perc);
    if (price !== '') setSalePrice(Number((Number(price) - (Number(price) * perc) / 100).toFixed(2)));
  };

  const handleSalePriceChange = (value: string) => {
    if (value === '') { setSalePrice(''); setSalePercent(''); return; }
    const sp = Number(value);
    setSalePrice(sp);
    if (price !== '') setSalePercent(Number(((1 - sp / Number(price)) * 100).toFixed(2)));
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
      const sortedImages = images.map((img) =>
        img.isNew && img.file ? { new: true, filename: img.file.name } : { new: false, id: img.id }
      );
      formData.append('sortedImages', JSON.stringify(sortedImages));
      images.filter((img) => img.isNew && img.file).forEach((img) => formData.append('images', img.file as File));
    }

    try {
      let res;
      if (mode === 'create') {
        res = await fetch(`${API_URL}/api/products`, { method: 'POST', credentials: 'include', body: formData });
      } else if (mode === 'edit' && productId) {
        res = await fetch(`${API_URL}/api/products/id/${productId}`, { method: 'PUT', credentials: 'include', body: formData });
      }
      if (!res || !res.ok) throw new Error('Failed to submit product');
      router.push('/gallery');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const [previewTab, setPreviewTab] = useState<'card' | 'page'>('page');

  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
  const firstImage = images[0];
  const previewImageSrc = firstImage
    ? firstImage.isNew && firstImage.file
      ? URL.createObjectURL(firstImage.file)
      : `${API_URL}/api/uploads/${firstImage.url}`
    : null;

  const finalPrice = price !== '' && salePercent !== ''
    ? (Number(price) * (1 - Number(salePercent) / 100)).toFixed(0)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-stone-800 mb-2">
        {mode === 'create' ? 'Add Artwork' : 'Edit Artwork'}
      </h1>
      <div className="h-px bg-stone-200 mb-8" />

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          <div>
            <label className={LABEL}>Name *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={INPUT} placeholder="Artwork title" />
          </div>
          <div>
            <label className={LABEL}>Category *</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className={INPUT} placeholder="e.g. Painting, Sculpture" />
          </div>
          <div>
            <label className={LABEL}>Tags</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className={INPUT} placeholder="oil, landscape, blue — comma separated" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Price (₪)</label>
              <input
                type="number" step="0.01" value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className={INPUT} placeholder="0.00"
              />
            </div>
            <div>
              <label className={LABEL}>Sale (%)</label>
              <input
                type="number" step="0.01" value={salePercent}
                onChange={(e) => handleSalePercentChange(e.target.value)}
                className={INPUT} placeholder="0"
              />
              {salePrice !== '' && (
                <p className="text-xs text-stone-500 mt-1.5">Final price: ₪{salePrice}</p>
              )}
            </div>
          </div>
          <div>
            <label className={LABEL}>Sale price override (₪)</label>
            <input
              type="number" step="0.01" placeholder="Or enter final price directly"
              value={salePrice}
              onChange={(e) => handleSalePriceChange(e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label className={LABEL}>Description</label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
          <div>
            <label className={LABEL}>Images</label>
            <ImageUploadList images={images} setImages={setImages} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-stone-800 text-white py-3 rounded-xl text-sm tracking-wide hover:bg-stone-700 transition-colors"
          >
            {mode === 'create' ? 'Create Artwork' : 'Save Changes'}
          </button>
        </form>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Preview</p>
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
              {(['page', 'card'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreviewTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    previewTab === tab
                      ? 'bg-white text-stone-800 shadow-sm font-medium'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  {tab === 'page' ? 'Product page' : 'Gallery card'}
                </button>
              ))}
            </div>
          </div>

          {previewTab === 'card' ? (
            /* Gallery card preview — mirrors GalleryItem */
            <div className="relative rounded-xl overflow-hidden shadow-sm bg-stone-100 aspect-[3/4]">
              {previewImageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewImageSrc} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm italic">No image yet</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h2 className="text-white font-serif text-lg leading-snug drop-shadow">
                  {name || <span className="opacity-40 italic">Artwork title</span>}
                </h2>
                {tagList.length > 0 && (
                  <p className="text-stone-300 text-xs mt-1 tracking-wide">
                    {tagList.slice(0, 3).join(' · ')}
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Product page preview — mirrors ProductPage layout */
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="aspect-[3/4] bg-stone-100 relative">
                {previewImageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewImageSrc} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm italic">No image yet</div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <div>
                  <h2 className="font-serif text-2xl text-stone-900 leading-tight">
                    {name || <span className="text-stone-300 font-sans text-base italic">Artwork title</span>}
                  </h2>
                  <div className="h-px bg-stone-200 mt-3" />
                </div>
                {category && (
                  <p className="text-xs text-stone-400 uppercase tracking-widest">{category}</p>
                )}
                {tagList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tagList.map((tag) => (
                      <span key={tag} className="border border-stone-200 text-stone-500 text-xs px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {description && (
                  <div
                    className="prose prose-sm prose-stone max-w-none text-stone-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: description.replace(/&nbsp;/g, ' ') }}
                  />
                )}
                {price !== '' && (
                  <div className="pt-2 border-t border-stone-100">
                    {finalPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-medium text-stone-900">₪{finalPrice}</span>
                        <span className="text-sm text-stone-400 line-through">₪{price}</span>
                        <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">{salePercent}% off</span>
                      </div>
                    ) : (
                      <span className="text-lg font-medium text-stone-900">₪{price}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
