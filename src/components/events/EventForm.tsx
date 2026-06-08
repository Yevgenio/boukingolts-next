'use client';
import React, { useState, useEffect } from 'react';
import API_URL, { resolveImageUrl } from '@/config/config';
import { useRouter } from 'next/navigation';
import { useArtist } from '@/context/ArtistContext';
import { Image } from '@/types/Image';
import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import ArtistDropdown from '@/components/common/ArtistDropdown';
import RichTextEditor from '@/components/common/RichTextEditor';

interface EventFormProps {
  mode: 'create' | 'edit';
  eventId?: string;
}

const LABEL = 'block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1';
const INPUT = 'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-sm placeholder:text-stone-400';

function formatPreviewDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EventForm({ mode, eventId }: EventFormProps) {
  const contextArtist = useArtist();
  const [selectedArtist, setSelectedArtist] = useState<'elena' | 'alexey' | 'archive'>(
    contextArtist !== 'all' ? contextArtist as 'elena' | 'alexey' | 'archive' : 'alexey'
  );
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mode === 'edit' && eventId) {
      const fetchEvent = async () => {
        try {
          const res = await fetch(`${API_URL}/events/id/${eventId}`);
          if (!res.ok) throw new Error('Failed to load event');
          const data = await res.json();
          setName(data.name || '');
          setDescription(data.description || '');
          setCategory(data.category || '');
          setDate(data.date ? data.date.substring(0, 10) : '');
          setLocation(data.location || '');
          if (data.artist) setSelectedArtist(data.artist);
          if (Array.isArray(data.images)) {
            setImages(data.images.map((img: Image) => ({ url: img.url, id: img._id, isNew: false })));
          }
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'Failed to load event');
        }
      };
      fetchEvent();
    }
  }, [mode, eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('artist', selectedArtist);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('date', date);
    formData.append('location', location);

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
        res = await fetch(`${API_URL}/events`, { method: 'POST', credentials: 'include', body: formData });
      } else if (mode === 'edit' && eventId) {
        res = await fetch(`${API_URL}/events/id/${eventId}`, { method: 'PUT', credentials: 'include', body: formData });
      }
      if (!res || !res.ok) throw new Error('Failed to submit event');
      router.push('/events');
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  const firstImage = images[0];
  const previewImageSrc = firstImage
    ? firstImage.isNew && firstImage.file
      ? URL.createObjectURL(firstImage.file)
      : resolveImageUrl(firstImage.url ?? '')
    : null;

  const d = date ? new Date(date) : null;
  const previewDay = d ? d.toLocaleDateString('en-GB', { day: '2-digit' }) : '--';
  const previewMonth = d ? d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase() : '---';
  const previewYear = d ? d.getFullYear() : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-serif text-stone-800 mb-2">
        {mode === 'create' ? 'Добавить событие' : 'Редактировать событие'}
      </h1>
      <div className="h-px bg-stone-200 mb-8" />

      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
          {/* Artist assignment */}
          <div>
            <label className={LABEL}>Художник</label>
            <ArtistDropdown value={selectedArtist} onChange={setSelectedArtist} />
          </div>

          <div>
            <label className={LABEL}>Название *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={INPUT} placeholder="Название события" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Дата *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Категория</label>
              <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className={INPUT} placeholder="например, Выставка, Мастер-класс" />
            </div>
          </div>
          <div>
            <label className={LABEL}>Место проведения</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={INPUT} placeholder="Место или город" />
          </div>
          <div>
            <label className={LABEL}>Описание</label>
            <RichTextEditor value={description} onChange={setDescription} />
          </div>
          <div>
            <label className={LABEL}>Изображения</label>
            <ImageUploadList images={images} setImages={setImages} />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-stone-800 text-white py-3 rounded-xl text-sm tracking-wide hover:bg-stone-700 transition-colors disabled:opacity-60"
          >
            {submitting ? (mode === 'create' ? 'Создание…' : 'Сохранение…') : (mode === 'create' ? 'Создать событие' : 'Сохранить')}
          </button>
        </form>

        {/* Live preview */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">Предпросмотр</p>

          {/* Card preview (list view) */}
          <div>
            <p className="text-xs text-stone-400 mb-2">Вид в списке событий</p>
            <div className="flex rounded-xl overflow-hidden shadow-sm h-44 border border-stone-100">
              <div className="flex-shrink-0 w-24 bg-stone-800 text-white flex flex-col items-center justify-center gap-0.5">
                <span className="text-2xl font-serif font-semibold leading-none">{previewDay}</span>
                <span className="text-xs tracking-widest text-stone-300">{previewMonth}</span>
                {previewYear && <span className="text-xs text-stone-500 mt-1">{previewYear}</span>}
              </div>
              <div
                className="flex-1 relative overflow-hidden"
                style={previewImageSrc ? { backgroundImage: `url(${previewImageSrc})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              >
                {previewImageSrc && <div className="absolute inset-0 bg-stone-900/65" />}
                <div className={`relative z-10 h-full flex flex-col justify-between p-5 ${previewImageSrc ? 'text-white' : 'text-stone-800 bg-stone-50'}`}>
                  <div>
                    <h2 className="font-serif text-xl leading-snug mb-1">
                      {name || <span className={`italic font-sans text-base ${previewImageSrc ? 'text-stone-300' : 'text-stone-400'}`}>Event name</span>}
                    </h2>
                    {location && (
                      <p className={`text-sm ${previewImageSrc ? 'text-stone-300' : 'text-stone-500'}`}>{location}</p>
                    )}
                  </div>
                  {description && (
                    <p className={`text-sm leading-relaxed line-clamp-2 ${previewImageSrc ? 'text-stone-300' : 'text-stone-500'}`}>
                      {description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page preview */}
          <div>
            <p className="text-xs text-stone-400 mb-2">Вид на странице события</p>
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-sm">
              {previewImageSrc && (
                <div className="w-full aspect-[16/7] relative overflow-hidden bg-stone-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewImageSrc} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 space-y-2">
                <h2 className="font-serif text-2xl text-stone-900 leading-tight">
                  {name || <span className="text-stone-300 font-sans text-base italic">Event name</span>}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-stone-500">
                  {date && <span>{formatPreviewDate(date)}</span>}
                  {location && <span>{location}</span>}
                </div>
                {description && (
                  <div
                    className="prose prose-sm prose-stone max-w-none text-stone-600 leading-relaxed pt-2"
                    dangerouslySetInnerHTML={{ __html: description.replace(/&nbsp;/g, ' ') }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
