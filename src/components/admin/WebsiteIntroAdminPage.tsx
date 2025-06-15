'use client';

import React, { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';

export default function WebsiteIntroAdminPage() {
  const { isAdmin } = useAuth();

  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newParagraph, setNewParagraph] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');

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
    } else {
      alert('Failed to update');
    }
  };

  const handleDelete = (index: number) => {
    const updated = paragraphs.filter((_, i) => i !== index);
    updateParagraphs(updated);
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
      <h1 className="text-2xl font-bold mb-4">Manage Website Introduction</h1>

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
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={handleEditSave}
                >
                  Save
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
              <p>{text}</p>
              <div className="flex gap-2">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                  onClick={() => handleEdit(i)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded"
                  onClick={() => handleDelete(i)}
                >
                  Delete
                </button>
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
          className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={handleAdd}
        >
          Add Paragraph
        </button>
      </div>
    </div>
  );
}
