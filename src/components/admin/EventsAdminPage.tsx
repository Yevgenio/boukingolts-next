'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { EventsContent } from '@/types/HomeContent';
import { useRouter } from 'next/navigation';

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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (res.ok) showToast('Saved!', true);
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
      <h1 className="text-2xl font-bold">Edit Where to Find Us</h1>

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
        Text
        <textarea className="border w-full p-2" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} />
      </label>
      <button
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={save}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
}
