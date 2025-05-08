'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function GalleryAdminControls() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (!isAdmin) return null;

  return (
    <div className="mb-6 text-center">
      <button
        onClick={() => router.push('/gallery/create')}
        className="bg-gray-200 hover:bg-gray-300 text-black text-sm px-3 py-3 rounded-full border-black border-1"
      >
        + Add New
      </button>
    </div>
  );
}
