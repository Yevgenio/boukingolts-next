'use client';
import { useEffect, useState, useRef } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { AboutContent } from '@/types/HomeContent';
import { Image } from '@/types/Image';
import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useRouter } from 'next/navigation';
import AboutSection from '@/components/home/AboutSection';

const REAL_W = 900;

const INPUT = 'border border-stone-300 rounded-lg w-full px-3 py-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-800';
const LABEL = 'block text-sm font-medium text-stone-700';

export default function AboutAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<AboutContent | null>(null);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewW, setPreviewW] = useState(450);
  const [previewImages, setPreviewImages] = useState<Image[]>([]);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPreviewW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const blobUrls: string[] = [];
    const next: Image[] = images.map((img, i) => {
      const url = img.isNew && img.file ? (blobUrls.push(URL.createObjectURL(img.file)), blobUrls[blobUrls.length - 1]) : (img.url ?? '');
      return { _id: `preview-${i}`, url, thumbnail: url };
    });
    setPreviewImages(next);
    return () => { blobUrls.forEach(u => URL.revokeObjectURL(u)); };
  }, [images]);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/content/about-boukingolts`)
      .then(res => res.json())
      .then(data => {
        setForm(data);
        if (Array.isArray(data.images))
          setImages(data.images.map((img: Image) => ({ url: img.url, id: img._id, isNew: false })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    const formData = new FormData();
    ['enabled', 'order', 'name', 'address', 'email', 'phone', 'whatsapp', 'instagram', 'comment'].forEach(k =>
      formData.append(k, String(form[k as keyof AboutContent]))
    );
    if (images.length) {
      formData.append('sortedImages', JSON.stringify(
        images.map(img => img.isNew && img.file ? { new: true, filename: img.file.name } : { new: false, id: img.id })
      ));
      images.filter(img => img.isNew && img.file).forEach(img => formData.append('images', img.file as File));
    }
    try {
      const res = await fetch(`${API_URL}/content/about-boukingolts`, { method: 'PUT', credentials: 'include', body: formData });
      if (res.ok) showToast('About section saved!', true);
      else showToast('Failed to save', false);
    } catch { showToast('Failed to save', false); }
    finally { setSaving(false); }
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">← Back to Admin</button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Edit About Section</h1>
        <div className="h-px bg-stone-200 mb-6" />


        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="accent-stone-800 w-4 h-4" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
              <span className="text-sm font-medium text-stone-700">Section enabled</span>
            </label>
            <div>
              <label className={LABEL}>Display order</label>
              <input type="number" className={INPUT} value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
            </div>
            <div>
              <label className={LABEL}>Name</label>
              <input type="text" className={INPUT} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Address</label>
              <input type="text" className={INPUT} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Email</label>
              <input type="text" className={INPUT} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Phone</label>
              <input type="text" className={INPUT} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>WhatsApp</label>
              <input type="text" className={INPUT} value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Instagram</label>
              <input type="text" className={INPUT} value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Profile photo</label>
              <div className="mt-1"><ImageUploadList images={images} setImages={setImages} /></div>
            </div>
            <div>
              <label className={LABEL}>Comment</label>
              <div className="mt-1"><RichTextEditor value={form.comment} onChange={v => setForm({ ...form, comment: v })} /></div>
            </div>
            <button className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {toast && (
              <p className={`text-sm ${toast.ok ? 'text-green-700' : 'text-red-600'}`}>{toast.msg}</p>
            )}
          </div>

          {/* Preview */}
          <div ref={previewRef} className="lg:sticky lg:top-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Live Preview — {Math.round(previewW / REAL_W * 100)}% scale</p>
            <div className="rounded-xl overflow-hidden border border-stone-200" style={{ height: 380 }}>
              <div style={{ width: REAL_W, transformOrigin: 'top left', transform: `scale(${previewW / REAL_W})`, pointerEvents: 'none' }}>
                <AboutSection content={{ ...form, images: previewImages }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
