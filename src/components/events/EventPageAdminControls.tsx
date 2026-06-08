'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { useState } from 'react';

export default function EventPageAdminControls({ eventId }: { eventId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    const res = await fetch(`${API_URL}/events/id/${eventId}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { router.push('/events'); router.refresh(); }
    else { setConfirmDelete(false); setDeleteError(true); setTimeout(() => setDeleteError(false), 4000); }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center text-xs text-stone-400 mb-4">
      <button onClick={() => router.push(`/events/edit/${eventId}`)} className="hover:text-stone-700 underline underline-offset-2">
        Редактировать
      </button>
      <button
        onClick={handleDelete}
        className={`underline underline-offset-2 transition-colors ${confirmDelete ? 'text-red-500 hover:text-red-700' : 'hover:text-stone-700'}`}
      >
        {confirmDelete ? 'Подтвердить удаление?' : 'Удалить'}
      </button>
      {deleteError && <span className="text-red-500">Ошибка удаления.</span>}
    </div>
  );
}
