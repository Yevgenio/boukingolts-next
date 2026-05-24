'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function GalleryAdminControls() {
  const router = useRouter();
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <button
      onClick={() => router.push('/gallery/create')}
      className="text-sm border border-stone-300 text-stone-600 px-4 py-1.5 rounded-full hover:border-stone-500 hover:text-stone-800 transition-colors"
    >
      + Add artwork
    </button>
  );
}
