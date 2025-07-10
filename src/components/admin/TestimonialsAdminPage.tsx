'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { TestimonialsContent, TestimonialItem } from '@/types/HomeContent';

export default function TestimonialsAdminPage() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState<TestimonialsContent | null>(null);
  const [newItem, setNewItem] = useState<TestimonialItem>({ comment: '', author: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/home-testimonials`)
      .then(res => res.json())
      .then(data => { setForm(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const save = async (updated: TestimonialsContent) => {
    await fetch(`${API_URL}/api/content/home-testimonials`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
    setForm(updated);
    setNewItem({ comment: '', author: '' });
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Testimonials</h1>
      <label className="flex items-center gap-2">
        <span>Enabled</span>
        <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
      </label>
      <label className="block">
        Order
        <input type="number" className="border w-full p-2" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
      </label>
      {form.testimonials.map((t, i) => (
        <div key={i} className="border p-2 space-y-1">
          <input
            className="border w-full p-1"
            value={t.comment}
            onChange={e => {
              const arr = [...form.testimonials];
              arr[i] = { ...arr[i], comment: e.target.value };
              setForm({ ...form, testimonials: arr });
            }}
            placeholder="Comment"
          />
          <input
            className="border w-full p-1"
            value={t.author}
            onChange={e => {
              const arr = [...form.testimonials];
              arr[i] = { ...arr[i], author: e.target.value };
              setForm({ ...form, testimonials: arr });
            }}
            placeholder="Author"
          />
          <button className="text-red-600" onClick={() => {
            const arr = form.testimonials.filter((_,idx) => idx !== i);
            setForm({ ...form, testimonials: arr });
          }}>Delete</button>
        </div>
      ))}
      <div className="border-t pt-2 space-y-2">
        <h2 className="font-semibold">Add New</h2>
        <input className="border w-full p-1" value={newItem.comment} onChange={e => setNewItem({ ...newItem, comment: e.target.value })} placeholder="Comment" />
        <input className="border w-full p-1" value={newItem.author} onChange={e => setNewItem({ ...newItem, author: e.target.value })} placeholder="Author" />
        <button className="bg-black text-white px-2 py-1" onClick={() => {
          if (!newItem.comment.trim()) return;
          const updated = { ...form, testimonials: [...form.testimonials, newItem] } as TestimonialsContent;
          save(updated);
        }}>Add</button>
      </div>
      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => save(form)}>Save All</button>
    </div>
  );
}