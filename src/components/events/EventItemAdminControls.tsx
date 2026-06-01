'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { useState } from 'react';
import { EditIcon, DeleteIcon } from '@/components/icons';

export default function EventItemAdminControls({ eventId }: { eventId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isAdmin) return null;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    router.push(`/events/edit/${eventId}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); e.preventDefault();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    const res = await fetch(`${API_URL}/events/id/${eventId}`, {
      method: 'DELETE', credentials: 'include',
    });
    if (res.ok) router.refresh();
    else setConfirmDelete(false);
  };

  return (
    <div className={`absolute top-3 right-3 flex items-center gap-0.5
        bg-black/55 backdrop-blur-sm rounded-full px-1.5 py-1.5
        opacity-0 scale-90 pointer-events-none
        transition-all duration-200
        group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto`}
    >
      <button
        onClick={handleEdit}
        title="Edit"
        className="p-1.5 rounded-full text-white/75 hover:text-white hover:bg-white/15 transition-colors"
      >
        <EditIcon />
      </button>
      <button
        onClick={handleDelete}
        title={confirmDelete ? 'Confirm delete' : 'Delete'}
        className={`p-1.5 rounded-full transition-colors ${
          confirmDelete
            ? 'text-red-400 hover:text-red-300 bg-red-500/20 hover:bg-red-500/30'
            : 'text-white/75 hover:text-white hover:bg-white/15'
        }`}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
