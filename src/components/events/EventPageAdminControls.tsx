'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';

export default function EventPageAdminControls({ eventId }: { eventId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (!isAdmin) return null;

  const handleEdit = () => router.push(`/events/edit/${eventId}`);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const res = await fetch(`${API_URL}/api/events/id/${eventId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      router.push('/events');
      router.refresh();
    } else {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={handleEdit} className="bg-gray-200 px-3 py-1 rounded">
        Edit
      </button>
      <button onClick={handleDelete} className="bg-gray-200 px-3 py-1 rounded">
        Delete
      </button>
    </div>
  );
}