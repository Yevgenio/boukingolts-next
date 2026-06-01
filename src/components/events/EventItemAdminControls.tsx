'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { EditIcon, DeleteIcon } from '@/components/icons';

export default function EventItemAdminControls({ eventId }: { eventId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (!isAdmin) return null;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    router.push(`/events/edit/${eventId}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm('Are you sure you want to delete this event?')) return;
    await fetch(`${API_URL}/events/id/${eventId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    router.refresh();
  };

  return (
    <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 scale-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
      <button
        onClick={handleEdit}
        className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
      >
        <EditIcon />
      </button>
      <button
        onClick={handleDelete}
        className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
