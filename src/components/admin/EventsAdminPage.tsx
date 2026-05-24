'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { EventsContent } from '@/types/HomeContent';
import { useRouter } from 'next/navigation';

const INPUT = 'border border-stone-300 rounded-lg w-full px-3 py-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-800';
const LABEL = 'block text-sm font-medium text-stone-700';

function EventsPreview({ form }: { form: EventsContent }) {
  return (
    <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-stone-600">
      {form.text
        ? <p className="whitespace-pre-wrap leading-relaxed">{form.text}</p>
        : <p className="italic text-stone-400">No content yet…</p>
      }
    </div>
  );
}

export default function EventsAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<EventsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/home-events`)
      .then(res => res.json())
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/content/home-events`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form),
      });
      if (res.ok) showToast('Saved!', true); else showToast('Failed to save', false);
    } catch { showToast('Failed to save', false); }
    finally { setSaving(false); }
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">← Back to Admin</button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Edit Where to Find Us</h1>
        <div className="h-px bg-stone-200 mb-6" />

        {toast && (
          <div className={`px-4 py-2 rounded-lg text-sm mb-6 ${toast.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {toast.msg}
          </div>
        )}

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
              <label className={LABEL}>Text</label>
              <textarea className={INPUT} rows={8} value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
            </div>
            <button className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Live Preview</p>
            <div className="border border-stone-200 rounded-xl bg-white p-4">
              <EventsPreview form={form} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
