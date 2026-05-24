'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { useState } from 'react';

export default function EventPageAdminControls({ eventId }: { eventId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    const res = await fetch(`${API_URL}/api/events/id/${eventId}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { router.push('/events'); router.refresh(); }
  };

  return (
    <div className="flex gap-4 text-xs text-stone-400 mb-4">
      <button onClick={() => router.push(`/events/edit/${eventId}`)} className="hover:text-stone-700 underline underline-offset-2">
        Edit
      </button>
      <button
        onClick={handleDelete}
        className={`underline underline-offset-2 transition-colors ${confirmDelete ? 'text-red-500 hover:text-red-700' : 'hover:text-stone-700'}`}
      >
        {confirmDelete ? 'Confirm delete?' : 'Delete'}
      </button>
    </div>
  );
}
