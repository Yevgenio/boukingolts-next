'use client';
import { useEffect, useState, useRef } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { TestimonialItem } from '@/types/HomeContent';
import { useRouter } from 'next/navigation';
import Testimonials from '@/components/home/Testimonials';

const REAL_W = 900;

const INPUT = 'border border-stone-300 rounded-lg w-full px-3 py-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-800';
const LABEL = 'block text-sm font-medium text-stone-700';


export default function TestimonialsAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewW, setPreviewW] = useState(450);
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPreviewW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    fetch(`${API_URL}/content/home-testimonials`)
      .then(res => res.json())
      .then(data => { setComments(data.testimonials || []); setEnabled(data.enabled ?? false); setOrder(data.order ?? 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [isAdmin]);

  const updateComments = async (updated: TestimonialItem[]) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/content/home-testimonials`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ enabled, order, testimonials: updated }),
      });
      if (res.ok) { setComments(updated); setEditingIndex(null); setEditedItem({ comment: '', author: '' }); setNewComment({ comment: '', author: '' }); showToast('Отзывы обновлены!', true); }
      else showToast('Ошибка обновления', false);
    } catch { showToast('Ошибка обновления', false); }
    finally { setSaving(false); }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/content/home-testimonials`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ enabled, order, testimonials: comments }),
      });
      if (res.ok) showToast('Настройки сохранены!', true); else showToast('Ошибка сохранения', false);
    } catch { showToast('Ошибка сохранения', false); }
    finally { setSaving(false); }
  };

  const handleDelete = (i: number) => updateComments(comments.filter((_, j) => j !== i));
  const handleEdit = (i: number) => { setEditingIndex(i); setEditedItem(comments[i]); };
  const handleEditSave = () => {
    if (editingIndex === null) return;
    const updated = [...comments]; updated[editingIndex] = editedItem; updateComments(updated);
  };
  const handleAdd = () => {
    if (!newComment.comment.trim() || !newComment.author.trim()) return;
    updateComments([...comments, { ...newComment }]);
  };

  const previewComments = editingIndex !== null
    ? comments.map((c, i) => (i === editingIndex ? editedItem : c))
    : newComment.comment || newComment.author ? [...comments, newComment] : comments;

  if (!isAdmin) return <div className="p-4">Доступ запрещён</div>;
  if (loading) return <div className="p-4">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">← Назад</button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Управление отзывами</h1>
        <div className="h-px bg-stone-200 mb-6" />


        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="space-y-4">
            {/* Settings card */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Настройки раздела</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-stone-800 w-4 h-4" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
                <span className="text-sm font-medium text-stone-700">Раздел включён</span>
              </label>
              <div>
                <label className={LABEL}>Порядок отображения</label>
                <input type="number" className={INPUT} value={order} onChange={e => setOrder(parseInt(e.target.value))} />
              </div>
              <div className="flex items-center gap-3">
                <button className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50 transition-colors" onClick={saveSettings} disabled={saving}>
                  {saving ? 'Сохранение…' : 'Сохранить настройки'}
                </button>
                {toast && (
                  <p className={`text-sm ${toast.ok ? 'text-green-700' : 'text-red-600'}`}>{toast.msg}</p>
                )}
              </div>
            </div>

            {/* Existing testimonials */}
            {comments.map((testimonial, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 space-y-3">
                {editingIndex === i ? (
                  <>
                    <div>
                      <label className={LABEL}>Автор</label>
                      <input type="text" className={INPUT} value={editedItem.author} onChange={e => setEditedItem({ ...editedItem, author: e.target.value })} placeholder="Имя автора" />
                    </div>
                    <div>
                      <label className={LABEL}>Отзыв</label>
                      <textarea className={INPUT} rows={3} value={editedItem.comment} onChange={e => setEditedItem({ ...editedItem, comment: e.target.value })} placeholder="Текст отзыва" />
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm disabled:opacity-50" onClick={handleEditSave} disabled={saving}>
                        {saving ? 'Сохранение…' : 'Сохранить'}
                      </button>
                      <button className="bg-stone-100 text-stone-600 px-4 py-1.5 rounded-lg text-sm" onClick={() => setEditingIndex(null)}>Отмена</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-stone-800">{testimonial.author}</p>
                    <p className="text-stone-600 text-sm">{testimonial.comment}</p>
                    <div className="flex gap-2">
                      <button className="bg-stone-800 text-white px-4 py-1.5 rounded-lg text-sm" onClick={() => handleEdit(i)}>Редактировать</button>
                      <button className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm" onClick={() => handleDelete(i)}>Удалить</button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Add new */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Добавить отзыв</h2>
              <div>
                <label className={LABEL}>Автор</label>
                <input type="text" className={INPUT} value={newComment.author} onChange={e => setNewComment({ ...newComment, author: e.target.value })} placeholder="Имя автора" />
              </div>
              <div>
                <label className={LABEL}>Отзыв</label>
                <textarea className={INPUT} rows={3} value={newComment.comment} onChange={e => setNewComment({ ...newComment, comment: e.target.value })} placeholder="Текст отзыва" />
              </div>
              <button className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors" onClick={handleAdd} disabled={saving}>
                {saving ? 'Добавление…' : 'Добавить'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div ref={previewRef} className="lg:sticky lg:top-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Предпросмотр — {Math.round(previewW / REAL_W * 100)}% масштаб</p>
            <div className="rounded-xl overflow-hidden border border-stone-200" style={{ height: 320 }}>
              <div style={{ width: REAL_W, transformOrigin: 'top left', transform: `scale(${previewW / REAL_W})`, pointerEvents: 'none' }}>
                <Testimonials content={{ enabled: true, order: 0, testimonials: previewComments }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
