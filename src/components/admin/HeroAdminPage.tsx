'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { HeroContent } from '@/types/HomeContent';
import { Image } from '@/types/Image';
import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import { useRouter } from 'next/navigation';

export default function HeroAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<HeroContent | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

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
    setSaving(true);
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

    try {
      const res = await fetch(`${API_URL}/api/content/home-hero`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });
      if (res.ok) showToast('Hero section saved!', true);
      else showToast('Failed to save', false);
    } catch {
      showToast('Failed to save', false);
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <button onClick={() => router.push('/admin')} className="text-sm text-gray-500 hover:underline">← Back to Admin</button>
      <h1 className="text-2xl font-bold">Edit Hero Section</h1>

      {toast && (
        <div className={`px-4 py-2 rounded text-sm ${toast.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.msg}
        </div>
      )}

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
      <button
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
