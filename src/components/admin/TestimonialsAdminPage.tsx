'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { TestimonialItem } from '@/types/HomeContent';
import { useRouter } from 'next/navigation';

export default function TestimonialsAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  const [comments, setComments] = useState<TestimonialItem[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [order, setOrder] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newComment, setNewComment] = useState({ comment: '', author: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<TestimonialItem>({ comment: '', author: '' });
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/home-testimonials`)
      .then(res => res.json())
      .then(data => {
        setComments(data.testimonials || []);
        setEnabled(data.enabled ?? false);
        setOrder(data.order ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const updateComments = async (updated: TestimonialItem[]) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/content/home-testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled, order, testimonials: updated }),
      });
      if (res.ok) {
        setComments(updated);
        setEditingIndex(null);
        setEditedItem({ comment: '', author: '' });
        setNewComment({ comment: '', author: '' });
        showToast('Testimonials updated!', true);
      } else {
        showToast('Failed to update', false);
      }
    } catch {
      showToast('Failed to update', false);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/content/home-testimonials`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ enabled, order, testimonials: comments }),
      });
      if (res.ok) showToast('Settings saved!', true);
      else showToast('Failed to save', false);
    } catch {
      showToast('Failed to save', false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (index: number) => {
    const updated = comments.filter((_, i) => i !== index);
    updateComments(updated);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedItem(comments[index]);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const updated = [...comments];
    updated[editingIndex] = editedItem;
    updateComments(updated);
  };

  const handleAdd = () => {
    if (!newComment.comment.trim() || !newComment.author.trim()) return;
    updateComments([...comments, { ...newComment }]);
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button onClick={() => router.push('/admin')} className="text-sm text-gray-500 hover:underline">← Back to Admin</button>
      <h1 className="text-2xl font-bold">Manage Testimonials</h1>

      {toast && (
        <div className={`px-4 py-2 rounded text-sm ${toast.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.msg}
        </div>
      )}

      <div className="border rounded p-4 space-y-3 bg-gray-50">
        <h2 className="font-semibold text-sm text-gray-600 uppercase tracking-wide">Section Settings</h2>
        <label className="flex items-center gap-2">
          <span>Enabled</span>
          <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
        </label>
        <label className="block">
          Order
          <input type="number" className="border w-full p-2 mt-1" value={order} onChange={e => setOrder(parseInt(e.target.value))} />
        </label>
        <button
          className="bg-gray-800 text-white px-4 py-1.5 rounded text-sm disabled:opacity-50"
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {comments.map((testimonial, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
          {editingIndex === i ? (
            <>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={editedItem.author}
                    onChange={(e) => setEditedItem({ ...editedItem, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Comment</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    value={editedItem.comment}
                    onChange={(e) => setEditedItem({ ...editedItem, comment: e.target.value })}
                    rows={3}
                    placeholder="Testimonial comment"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                  onClick={handleEditSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="bg-gray-300 px-4 py-1 rounded"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <p className="font-semibold text-gray-700">{testimonial.author}</p>
                <p className="text-gray-600">{testimonial.comment}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => handleEdit(i)}>Edit</button>
                <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleDelete(i)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="pt-4 border-t space-y-2">
        <h2 className="font-semibold mb-2">Add New Testimonial</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Author</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={newComment.author}
            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
            placeholder="Author name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            className="w-full p-2 border rounded"
            value={newComment.comment}
            onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
            rows={3}
            placeholder="Testimonial comment"
          />
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          onClick={handleAdd}
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add Testimonial'}
        </button>
      </div>
    </div>
  );
}
