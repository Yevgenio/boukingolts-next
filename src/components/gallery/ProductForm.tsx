'use client';

import React, { useState, useEffect, useRef } from 'react';
import API_URL from '@/config/config';
import { useRouter } from 'next/navigation';
import { useArtist } from '@/context/ArtistContext';
import { Image as ImageType } from '@/types/Image';
import { Product, ProductSpec } from '@/types/Product';

import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import ArtistDropdown from '@/components/common/ArtistDropdown';
import RichTextEditor from '@/components/common/RichTextEditor';
import ProductImageViewer from '@/components/gallery/ProductImageViewer';
import GalleryItem from '@/components/gallery/GalleryItem';

interface ProductFormProps {
  mode: 'create' | 'edit';
  productId?: string;
}

const LABEL = 'block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1';
const INPUT = 'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-sm placeholder:text-stone-400';
const DIM_INPUT = 'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-sm placeholder:text-stone-400 text-center';

// Width at which we render the preview content before scaling
const PRODUCT_REAL_W = 900;

export default function ProductForm({ mode, productId }: ProductFormProps) {
  const contextArtist = useArtist();
  const [selectedArtist, setSelectedArtist] = useState<'elena' | 'alexey' | 'archive'>(
    contextArtist !== 'all' ? contextArtist as 'elena' | 'alexey' | 'archive' : 'alexey'
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [rank, setRank] = useState<number | ''>('');
  const [featured, setFeatured] = useState<number | ''>('');
  const [tags, setTags] = useState('');
  const [series, setSeries] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [forSale, setForSale] = useState(false);
  const [dimW, setDimW] = useState('');
  const [dimH, setDimH] = useState('');
  const [dimD, setDimD] = useState('');
  const [dimUnit, setDimUnit] = useState('cm');
  const [specs, setSpecs] = useState<ProductSpec[]>([]);
  const [price, setPrice] = useState<number | ''>('');
  const [salePercent, setSalePercent] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Preview state
  const [previewTab, setPreviewTab] = useState<'page' | 'card'>('page');
  const [previewImages, setPreviewImages] = useState<ImageType[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewW, setPreviewW] = useState(500);

  // Measure preview column width for dynamic scale
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPreviewW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Build synthetic Image objects from upload state, manage blob URL lifecycle
  useEffect(() => {
    const blobUrls: string[] = [];
    const next: ImageType[] = images.map((img, i) => {
      let url: string;
      if (img.isNew && img.file) {
        url = URL.createObjectURL(img.file);
        blobUrls.push(url);
      } else {
        url = img.url ?? '';
      }
      return { _id: `preview-${i}`, url, thumbnail: url, width: 800, height: 800 };
    });
    setPreviewImages(next);
    return () => { blobUrls.forEach(u => URL.revokeObjectURL(u)); };
  }, [images]);

  useEffect(() => {
    if (mode === 'edit' && productId) {
      fetch(`${API_URL}/products/id/${productId}`)
        .then(r => { if (!r.ok) throw new Error('Failed to load artwork'); return r.json(); })
        .then(data => {
          setName(data.name || '');
          setDescription(data.description || '');
          setCategory(data.category || '');
          setRank(data.rank ?? '');
          setFeatured(data.featured ?? '');
          setTags(Array.isArray(data.tags) ? data.tags.join(', ') : '');
          setSeries(data.series ?? '');
          setYear(data.year || '');
          setForSale(data.forSale ?? false);
          if (Array.isArray(data.dimensions) && data.dimensions.length >= 2) {
            setDimW(String(data.dimensions[0] ?? ''));
            setDimH(String(data.dimensions[1] ?? ''));
            setDimD(data.dimensions[2] != null ? String(data.dimensions[2]) : '');
          }
          if (data.dimensionUnit) setDimUnit(data.dimensionUnit);
          if (Array.isArray(data.specs)) setSpecs(data.specs);
          setPrice(data.price ?? '');
          setSalePercent(data.salePercent ?? '');
          if (data.artist) setSelectedArtist(data.artist);
          if (Array.isArray(data.images))
            setImages(data.images.map((img: ImageType & { _id: string }) => ({ url: img.url, id: img._id, isNew: false })));
        })
        .catch(err => setError(err instanceof Error ? err.message : 'Failed to load artwork'));
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
    if (price !== '' && salePercent !== '' && Number(salePercent) > 0) {
      const p = Number(price); const perc = Number(salePercent);
      setSalePrice(Number((p - (p * perc) / 100).toFixed(2)));
    } else if (salePercent === '' || Number(salePercent) === 0) {
      setSalePrice('');
    }
  }, [price, salePercent]);

  const addSpec = () => setSpecs(s => [...s, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(s => s.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
    setSpecs(s => s.map((spec, idx) => idx === i ? { ...spec, [field]: val } : spec));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const formData = new FormData();
    formData.append('artist', selectedArtist);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    if (rank !== '') formData.append('rank', String(rank));
    formData.append('featured', String(featured));
    if (tags.trim()) formData.append('tags', tags);
    formData.append('series', series);
    if (year !== '') formData.append('year', String(year));
    formData.append('forSale', String(forSale));
    const dimValues = [dimW, dimH, dimD].filter(v => v.trim() !== '' && !isNaN(Number(v)));
    if (dimValues.length >= 2) { formData.append('dimensions', dimValues.join(',')); formData.append('dimensionUnit', dimUnit); }
    const cleanSpecs = specs.filter(s => s.key.trim() && s.value.trim());
    if (cleanSpecs.length) formData.append('specs', JSON.stringify(cleanSpecs));
    if (price !== '') formData.append('price', String(price));
    if (salePercent !== '') formData.append('salePercent', String(salePercent));
    if (images.length) {
      const sortedImages = images.map(img => img.isNew && img.file ? { new: true, filename: img.file.name } : { new: false, id: img.id });
      formData.append('sortedImages', JSON.stringify(sortedImages));
      images.filter(img => img.isNew && img.file).forEach(img => formData.append('images', img.file as File));
    }
    try {
      let res;
      if (mode === 'create') res = await fetch(`${API_URL}/products`, { method: 'POST', credentials: 'include', body: formData });
      else if (mode === 'edit' && productId) res = await fetch(`${API_URL}/products/id/${productId}`, { method: 'PUT', credentials: 'include', body: formData });
      if (!res || !res.ok) throw new Error('Failed to submit product');
      router.push('/gallery');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  // Derived preview values
  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
  const dimsArray = [dimW, dimH, dimD].filter(v => v.trim() !== '' && !isNaN(Number(v)) && v !== '');
  const dimsPreview = dimsArray.length >= 2 ? `${dimsArray.join(' × ')} ${dimUnit}` : '';
  const cleanSpecsPreview = specs.filter(s => s.key.trim() && s.value.trim());
  const finalPrice = price !== '' && Number(price) > 0 && salePercent !== '' && Number(salePercent) > 0
    ? (Number(price) * (1 - Number(salePercent) / 100)).toFixed(0)
    : null;

  const previewProduct: Product = {
    _id: 'preview',
    name: name || '',
    category,
    tags: tagList,
    series: series || undefined,
    year: year !== '' ? Number(year) : undefined,
    forSale,
    dimensions: dimsArray.map(Number),
    dimensionUnit: dimUnit,
    specs,
    price: price !== '' ? Number(price) : undefined,
    salePercent: salePercent !== '' ? Number(salePercent) : undefined,
    description,
    images: previewImages,
    rank: rank !== '' ? Number(rank) : undefined,
    featured: featured !== '' ? Number(featured) : undefined,
  } as Product;

  // Scale for product page preview: render at PRODUCT_REAL_W, scale to fit preview column
  const productScale = previewW / PRODUCT_REAL_W;
  // Height of outer window = scaled height of image (square, half column) + metadata
  const colW = (PRODUCT_REAL_W - 48) / 2; // gap-12 = 48px
  const productPreviewH = Math.round((colW + 280) * productScale);

  // Card preview: fill preview width at image aspect ratio (default portrait 3:4)
  const imgW = previewImages[0]?.width ?? 3;
  const imgH = previewImages[0]?.height ?? 4;
  const cardPreviewH = Math.round(previewW * (imgH / imgW));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-stone-800 mb-2">
        {mode === 'create' ? 'Add Artwork' : 'Edit Artwork'}
      </h1>
      <div className="h-px bg-stone-200 mb-8" />

      <div className="grid lg:grid-cols-2 gap-10 items-start">

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">

          {/* Artist assignment */}
          <div>
            <label className={LABEL}>Artist</label>
            <ArtistDropdown value={selectedArtist} onChange={setSelectedArtist} />
          </div>

          {/* Images — first so you can upload before filling metadata */}
          <div>
            <label className={LABEL}>Images</label>
            <ImageUploadList images={images} setImages={setImages} />
          </div>

          <div>
            <label className={LABEL}>Name *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className={INPUT} placeholder="Artwork title" />
          </div>

          <div>
            <label className={LABEL}>Category *</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} required className={INPUT} placeholder="e.g. Painting, Sculpture" />
          </div>

          <div>
            <label className={LABEL}>Tags</label>
            <input type="text" value={tags} onChange={e => setTags(e.target.value)} className={INPUT} placeholder="oil, landscape, blue — comma separated" />
          </div>

          <div>
            <label className={LABEL}>Series</label>
            <input type="text" value={series} onChange={e => setSeries(e.target.value)} className={INPUT} placeholder="e.g. Mediterranean Coast" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Year</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value === '' ? '' : Number(e.target.value))} className={INPUT} placeholder="e.g. 2023" />
            </div>
            <div className="flex flex-col">
              <label className={LABEL}>For Sale</label>
              <button
                type="button"
                onClick={() => setForSale(v => !v)}
                className={`mt-1 flex items-center gap-3 px-4 py-2.5 rounded-lg border text-sm transition-colors ${forSale ? 'bg-stone-800 border-stone-800 text-white' : 'bg-white border-stone-200 text-stone-500'}`}
              >
                <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${forSale ? 'bg-white border-white' : 'border-stone-400'}`} />
                {forSale ? 'Available for purchase' : 'Not for sale'}
              </button>
            </div>
          </div>

          <div>
            <label className={LABEL}>Dimensions</label>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <input type="number" step="0.1" value={dimW} onChange={e => setDimW(e.target.value)} className={DIM_INPUT} placeholder="W" />
                <p className="text-center text-[10px] text-stone-400 mt-0.5">Width</p>
              </div>
              <span className="text-stone-400 text-sm pb-4">×</span>
              <div className="flex-1">
                <input type="number" step="0.1" value={dimH} onChange={e => setDimH(e.target.value)} className={DIM_INPUT} placeholder="H" />
                <p className="text-center text-[10px] text-stone-400 mt-0.5">Height</p>
              </div>
              <span className="text-stone-400 text-sm pb-4">×</span>
              <div className="flex-1">
                <input type="number" step="0.1" value={dimD} onChange={e => setDimD(e.target.value)} className={DIM_INPUT} placeholder="D" />
                <p className="text-center text-[10px] text-stone-400 mt-0.5">Depth (opt.)</p>
              </div>
              <select value={dimUnit} onChange={e => setDimUnit(e.target.value)} className="border border-stone-200 rounded-lg px-2 py-2.5 text-stone-700 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 self-start mt-0">
                <option>cm</option><option>mm</option><option>in</option><option>m</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={LABEL}>Specifications</label>
              <button type="button" onClick={addSpec} className="text-xs text-stone-500 hover:text-stone-800 transition-colors">+ Add row</button>
            </div>
            {specs.length === 0 && <p className="text-sm text-stone-400 italic py-2">No specs yet — click &quot;Add row&quot; to start.</p>}
            <div className="space-y-2">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={spec.key} onChange={e => updateSpec(i, 'key', e.target.value)} className="w-2/5 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-400" placeholder="e.g. Material" />
                  <input type="text" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-400" placeholder="e.g. Oil on canvas" />
                  <button type="button" onClick={() => removeSpec(i)} className="text-stone-300 hover:text-red-400 transition-colors text-lg leading-none px-1" aria-label="Remove">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Price (₪)</label>
              <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className={INPUT} placeholder="0.00" />
            </div>
            <div>
              <label className={LABEL}>Sale (%)</label>
              <input type="number" step="0.01" value={salePercent} onChange={e => handleSalePercentChange(e.target.value)} className={INPUT} placeholder="0" />
              {salePrice !== '' && <p className="text-xs text-stone-500 mt-1.5">Final price: ₪{salePrice}</p>}
            </div>
          </div>

          <div>
            <label className={LABEL}>Sale price override (₪)</label>
            <input type="number" step="0.01" placeholder="Or enter final price directly" value={salePrice} onChange={e => handleSalePriceChange(e.target.value)} className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Description</label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={submitting} className="w-full bg-stone-800 text-white py-3 rounded-xl text-sm tracking-wide hover:bg-stone-700 transition-colors disabled:opacity-60">
            {submitting ? (mode === 'create' ? 'Creating…' : 'Saving…') : (mode === 'create' ? 'Create Artwork' : 'Save Changes')}
          </button>
        </form>

        {/* ── Preview ── */}
        <div ref={previewRef} className="lg:sticky lg:top-24 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Live Preview</p>
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1">
              {(['page', 'card'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPreviewTab(tab)}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${previewTab === tab ? 'bg-white text-stone-800 shadow-sm font-medium' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  {tab === 'page' ? 'Product page' : 'Gallery card'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 overflow-hidden bg-white shadow-sm">
            {previewTab === 'page' ? (
              // Product page: render two-column layout at PRODUCT_REAL_W, scale to fit
              <div style={{ height: productPreviewH, overflow: 'hidden' }}>
                <div style={{ width: PRODUCT_REAL_W, transformOrigin: 'top left', transform: `scale(${productScale})`, pointerEvents: 'none' }}>
                  <div className="grid grid-cols-2 gap-12 p-8 items-start">
                    {/* Left: actual ProductImageViewer component */}
                    <ProductImageViewer images={previewImages} name={name || 'Artwork title'} />

                    {/* Right: metadata — mirrors ProductPage.tsx layout */}
                    <div className="flex flex-col gap-5 pt-2">
                      <div>
                        <h1 className="text-4xl font-serif text-stone-900 leading-tight">
                          {name || <span className="text-stone-300 italic text-2xl font-sans font-normal">Artwork title</span>}
                        </h1>
                        <div className="h-px bg-stone-200 mt-5" />
                      </div>
                      <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5">
                        {category && <span className="text-xs text-stone-400 uppercase tracking-widest">{category}</span>}
                        {year !== '' && <span className="text-xs text-stone-400">{year}</span>}
                        {series && <span className="text-xs text-stone-500 underline underline-offset-2">{series}</span>}
                        {forSale && <span className="text-[10px] font-semibold tracking-widest uppercase bg-stone-800 text-white px-2.5 py-1 rounded-full">Available</span>}
                      </div>
                      {tagList.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tagList.map(tag => (
                            <span key={tag} className="border border-stone-300 text-stone-600 text-xs px-3 py-1 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                      {dimsPreview && <p className="text-sm text-stone-600 tracking-wide">{dimsPreview}</p>}
                      {description && (
                        <div className="prose prose-sm prose-stone max-w-none text-stone-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: description.replace(/&nbsp;/g, ' ') }} />
                      )}
                      {cleanSpecsPreview.length > 0 && (
                        <div className="border-t border-stone-100 pt-4">
                          <table className="w-full text-sm">
                            <tbody>
                              {cleanSpecsPreview.map((s, i) => (
                                <tr key={i} className="border-b border-stone-100 last:border-0">
                                  <td className="py-2 pr-6 text-stone-400 text-xs uppercase tracking-wide w-2/5">{s.key}</td>
                                  <td className="py-2 text-stone-700 text-sm">{s.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {price !== '' && Number(price) > 0 && (
                        <div className="pt-2 border-t border-stone-100">
                          {finalPrice ? (
                            <div className="flex items-baseline gap-3">
                              <span className="text-2xl font-medium text-stone-900">₪{finalPrice}</span>
                              <span className="text-sm text-stone-400 line-through">₪{price}</span>
                              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">{salePercent}% off</span>
                            </div>
                          ) : (
                            <span className="text-2xl font-medium text-stone-900">₪{price}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Gallery card: actual GalleryItem at preview width, correct aspect ratio
              <div style={{ width: previewW, height: cardPreviewH, position: 'relative' }}>
                <GalleryItem product={previewProduct} previewMode />
              </div>
            )}
          </div>

          <p className="text-[10px] text-stone-400 text-center">
            {previewTab === 'page' ? `${Math.round(productScale * 100)}% scale` : 'actual card ratio'}
          </p>
        </div>

      </div>
    </div>
  );
}
