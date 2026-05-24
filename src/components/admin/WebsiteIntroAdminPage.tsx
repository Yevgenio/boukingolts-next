'use client';

import React, { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WebsiteIntroAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newParagraph, setNewParagraph] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/website-introduction`)
      .then(res => res.json())
      .then(data => {
        setParagraphs(data.paragraphs || []);
        setLoading(false);
      });
  }, [isAdmin]);

  const updateParagraphs = async (updated: string[]) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/content/website-introduction`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paragraphs: updated }),
      });
      if (res.ok) {
        setParagraphs(updated);
        setEditingIndex(null);
        setEditedText('');
        setNewParagraph('');
        showToast('Saved!', true);
      } else {
        showToast('Failed to update', false);
      }
    } catch {
      showToast('Failed to update', false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (index: number) => {
    updateParagraphs(paragraphs.filter((_, i) => i !== index));
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditedText(paragraphs[index]);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const updated = [...paragraphs];
    updated[editingIndex] = editedText;
    updateParagraphs(updated);
  };

  const handleAdd = () => {
    if (!newParagraph.trim()) return;
    updateParagraphs([...paragraphs, newParagraph.trim()]);
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button onClick={() => router.push('/admin')} className="text-sm text-gray-500 hover:underline">← Back to Admin</button>
      <h1 className="text-2xl font-bold">Manage Website Introduction</h1>

      {toast && (
        <div className={`px-4 py-2 rounded text-sm ${toast.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {toast.msg}
        </div>
      )}

      {paragraphs.map((text, i) => (
        <div key={i} className="border rounded p-4 space-y-2">
          {editingIndex === i ? (
            <>
              <textarea
                className="w-full p-2 border rounded"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50"
                  onClick={handleEditSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button className="bg-gray-300 px-4 py-1 rounded" onClick={() => setEditingIndex(null)}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p>{text}</p>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => handleEdit(i)}>Edit</button>
                <button className="bg-red-600 text-white px-4 py-1 rounded" onClick={() => handleDelete(i)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="pt-4 border-t">
        <h2 className="font-semibold mb-2">Add New Paragraph</h2>
        <textarea
          className="w-full p-2 border rounded"
          value={newParagraph}
          onChange={(e) => setNewParagraph(e.target.value)}
          rows={3}
        />
        <button
          className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          onClick={handleAdd}
          disabled={saving}
        >
          {saving ? 'Adding...' : 'Add Paragraph'}
        </button>
      </div>
    </div>
  );
}
