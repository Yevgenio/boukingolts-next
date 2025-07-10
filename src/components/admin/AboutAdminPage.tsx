'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { AboutContent } from '@/types/HomeContent';

export default function AboutAdminPage() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/about-boukingolts`)
      .then(res => res.json())
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const save = async () => {
    if (!form) return;
    await fetch(`${API_URL}/api/content/about-boukingolts`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit About Section</h1>
      <label className="flex items-center gap-2">
        <span>Enabled</span>
        <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
      </label>
      <label className="block">
        Order
        <input type="number" className="border w-full p-2" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
      </label>
      <label className="block">
        Name
        <input type="text" className="border w-full p-2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
      </label>
      <label className="block">
        Address
        <input type="text" className="border w-full p-2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      </label>
      <label className="block">
        Email
        <input type="text" className="border w-full p-2" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </label>
      <label className="block">
        Phone
        <input type="text" className="border w-full p-2" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      </label>
      <label className="block">
        WhatsApp
        <input type="text" className="border w-full p-2" value={form.whatsapp} onChange={e => setForm({ ...form, whatsapp: e.target.value })} />
      </label>
      <label className="block">
        Instagram
        <input type="text" className="border w-full p-2" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
      </label>
      <label className="block">
        Image URL
        <input type="text" className="border w-full p-2" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
      </label>
      <label className="block">
        Comment
        <textarea className="border w-full p-2" value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} />
      </label>
      <button className="bg-black text-white px-4 py-2 rounded" onClick={save}>Save</button>
    </div>
  );
}