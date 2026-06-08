'use client';

import React, { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LABEL = 'block text-xs font-medium text-stone-500 uppercase tracking-wide mb-1';
const INPUT = 'w-full border border-stone-200 rounded-lg px-3 py-2.5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-sm placeholder:text-stone-400';

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
    fetch(`${API_URL}/content/website-introduction`)
      .then(res => res.json())
      .then(data => {
        setParagraphs(data.paragraphs || []);
        setLoading(false);
      });
  }, [isAdmin]);

  const updateParagraphs = async (updated: string[]) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/content/website-introduction`, {
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
        showToast('Сохранено!', true);
      } else {
        showToast('Ошибка обновления', false);
      }
    } catch {
      showToast('Ошибка обновления', false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (index: number) => updateParagraphs(paragraphs.filter((_, i) => i !== index));

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

  if (!isAdmin) return <div className="p-4">Доступ запрещён</div>;
  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">
          ← Назад
        </button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Введение на сайте</h1>
        <div className="h-px bg-stone-200 mb-6" />

        <div className="space-y-3 mb-8">
          {paragraphs.length === 0 && (
            <p className="text-sm text-stone-400 italic">Абзацев ещё нет.</p>
          )}
          {paragraphs.map((text, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
              {editingIndex === i ? (
                <>
                  <textarea
                    className={INPUT}
                    rows={3}
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleEditSave}
                      disabled={saving}
                      className="bg-stone-800 hover:bg-stone-700 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Сохранение…' : 'Сохранить'}
                    </button>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-stone-700 leading-relaxed">{text}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(i)}
                      className="text-xs text-stone-400 hover:text-stone-700 underline underline-offset-2 transition-colors"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => handleDelete(i)}
                      className="text-xs text-red-400 hover:text-red-600 underline underline-offset-2 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
          <label className={LABEL}>Добавить абзац</label>
          <textarea
            className={INPUT}
            rows={3}
            value={newParagraph}
            onChange={(e) => setNewParagraph(e.target.value)}
            placeholder="Введите текст абзаца…"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={saving || !newParagraph.trim()}
              className="bg-stone-800 hover:bg-stone-700 text-white text-sm px-5 py-2.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? 'Добавление…' : 'Добавить'}
            </button>
            {toast && (
              <p className={`text-sm ${toast.ok ? 'text-green-700' : 'text-red-600'}`}>{toast.msg}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
