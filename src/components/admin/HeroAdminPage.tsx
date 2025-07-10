'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { HeroContent } from '@/types/HomeContent';
import { Image } from '@/types/Image';
import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';

export default function HeroAdminPage() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<HeroContent | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/home-hero`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        if (Array.isArray(data.images)) {
          setImages(data.images.map((img: Image) => ({ url: img.url, id: img._id, isNew: false })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const handleSave = async () => {
    if (!form) return;
    const formData = new FormData();
    formData.append('enabled', String(form.enabled));
    formData.append('order', String(form.order));
    formData.append('title', form.title);
    formData.append('paragraph', form.paragraph);
    formData.append('tint', form.tint);

    if (images.length) {
      const sorted = images.map(img =>
        img.isNew && img.file ? { new: true, filename: img.file.name } : { new: false, id: img.id }
      );
      formData.append('sortedImages', JSON.stringify(sorted));
      images.filter(img => img.isNew && img.file).forEach(img => formData.append('images', img.file as File));
    }

    await fetch(`${API_URL}/api/content/home-hero`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Hero Section</h1>
      <label className="flex items-center gap-2">
        <span>Enabled</span>
        <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
      </label>
      <label className="block">
        Order
        <input type="number" className="border w-full p-2" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
      </label>
      <label className="block">
        Title
        <input type="text" className="border w-full p-2" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      </label>
      <label className="block">
        Paragraph
        <textarea className="border w-full p-2" value={form.paragraph} onChange={e => setForm({ ...form, paragraph: e.target.value })} />
      </label>
      <label className="block">
        Images
        <ImageUploadList images={images} setImages={setImages} />
      </label>
      <label className="block">
        Tint Class
        <input type="text" className="border w-full p-2" value={form.tint} onChange={e => setForm({ ...form, tint: e.target.value })} />
      </label>
      <button className="bg-black text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
    </div>
  );
}