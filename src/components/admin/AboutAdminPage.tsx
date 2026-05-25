'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { AboutContent } from '@/types/HomeContent';
import { Image } from '@/types/Image';
import ImageUploadList, { ImageItem } from '@/components/common/ImageUploadList';
import RichTextEditor from '@/components/common/RichTextEditor';
import { useRouter } from 'next/navigation';
import { LocationIcon, CallIcon, EmailIcon, WhatsappIcon, InstagramIcon } from '@/components/icons';

const INPUT = 'border border-stone-300 rounded-lg w-full px-3 py-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-800';
const LABEL = 'block text-sm font-medium text-stone-700';

function getImageUrl(item: ImageItem): string | null {
  if (item.isNew && item.file) return URL.createObjectURL(item.file);
  if (item.url) return `${API_URL}/api/uploads/${item.url}`;
  return null;
}

function AboutPreview({ form, images }: { form: AboutContent; images: ImageItem[] }) {
  const avatarUrl = images.length ? getImageUrl(images[0]) : null;
  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="flex items-center gap-4">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="profile" className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-stone-200 flex-shrink-0" />
        )}
        <div>
          <p className="font-semibold text-stone-800">{form.name || <span className="text-stone-300 italic">Name…</span>}</p>
          {form.address && (
            <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
              <LocationIcon className="w-3 h-3" /> {form.address}
            </p>
          )}
        </div>
      </div>
      {form.comment && (
        <div className="text-sm text-stone-600 leading-relaxed prose prose-sm prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: form.comment.replace(/&nbsp;/g, ' ') }} />
      )}
      <div className="flex gap-3 pt-1">
        {form.phone && <CallIcon className="w-5 h-5 text-stone-500" />}
        {form.whatsapp && <WhatsappIcon className="w-5 h-5 text-stone-500" />}
        {form.instagram && <InstagramIcon className="w-5 h-5 text-stone-500" />}
        {form.email && <EmailIcon className="w-5 h-5 text-stone-500" />}
      </div>
    </div>
  );
}

export default function AboutAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<AboutContent | null>(null);
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
    fetch(`${API_URL}/api/content/about-boukingolts`)
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
      const res = await fetch(`${API_URL}/api/content/about-boukingolts`, { method: 'PUT', credentials: 'include', body: formData });
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
          <div className="lg:sticky lg:top-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Live Preview</p>
            <div className="border border-stone-200 rounded-xl bg-white p-4">
              <AboutPreview form={form} images={images} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
