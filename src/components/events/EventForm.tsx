'use client';
import React, { useState, useEffect } from 'react';
import API_URL from '@/config/config';
import { useRouter } from 'next/navigation';
import { Image } from '@/types/Image';
import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import RichTextEditor from '@/components/common/RichTextEditor';

interface EventFormProps {
  mode: 'create' | 'edit';
  eventId?: string;
}

export default function EventForm({ mode, eventId }: EventFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mode === 'edit' && eventId) {
      const fetchEvent = async () => {
        const res = await fetch(`${API_URL}/api/events/id/${eventId}`);
        const data = await res.json();
        setName(data.name);
        setDescription(data.description);
        setCategory(data.category);
        setDate(data.date ? data.date.substring(0, 10) : '');
        setLocation(data.location);
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
      fetchEvent();
    }
  }, [mode, eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('date', date);
    formData.append('location', location);

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
        res = await fetch(`${API_URL}/api/events`, {
          method: 'POST',
          credentials: 'include',
          body: formData,
        });
      } else if (mode === 'edit' && eventId) {
        res = await fetch(`${API_URL}/api/events/id/${eventId}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        });
      }

      if (!res || !res.ok) throw new Error('Failed to submit event');
      setSuccess(true);
      router.push('/events');
      router.refresh();
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
      <h1 className="text-2xl font-bold mb-6">{mode === 'create' ? 'Create New Event' : 'Edit Event'}</h1>
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
          <RichTextEditor value={description} onChange={setDescription} />
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <ImageUploadList images={images} setImages={setImages} />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Success!</p>}

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          {mode === 'create' ? 'Create' : 'Update'}
        </button>
      </form>
    </div>
  );
}