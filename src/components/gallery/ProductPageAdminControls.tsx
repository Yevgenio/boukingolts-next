'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { getMarqueeProductIds, updateMarqueeProductIds } from '@/api/marquee';
import { useEffect, useState } from 'react';

export default function ProductPageAdminControls({ productId }: { productId: string }) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [inList, setInList] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    getMarqueeProductIds().then(ids => setInList(ids.includes(productId))).catch(() => {});
  }, [isAdmin, productId]);

  if (!isAdmin) return null;

  const toggleMarquee = async () => {
    const ids = await getMarqueeProductIds().catch(() => [] as string[]);
    const updated = ids.includes(productId)
      ? ids.filter((id: string) => id !== productId)
      : [...ids, productId];
    setInList(!ids.includes(productId));
    await updateMarqueeProductIds(updated);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
    const res = await fetch(`${API_URL}/products/id/${productId}`, { method: 'DELETE', credentials: 'include' });
    if (res.ok) { router.push('/gallery'); router.refresh(); }
    else { setConfirmDelete(false); setDeleteError(true); setTimeout(() => setDeleteError(false), 4000); }
  };

  return (
    <div className="flex flex-wrap gap-4 items-center text-xs text-stone-400 border-b border-stone-100 pb-4">
      <button onClick={() => router.push(`/gallery/edit/${productId}`)} className="hover:text-stone-700 underline underline-offset-2">
        Edit
      </button>
      <button
        onClick={handleDelete}
        className={`underline underline-offset-2 transition-colors ${confirmDelete ? 'text-red-500 hover:text-red-700' : 'hover:text-stone-700'}`}
      >
        {confirmDelete ? 'Confirm delete?' : 'Delete'}
      </button>
      <button onClick={toggleMarquee} className="hover:text-stone-700 underline underline-offset-2">
        {inList ? 'Remove from marquee' : 'Add to marquee'}
      </button>
      {deleteError && <span className="text-red-500">Failed to delete.</span>}
    </div>
  );
}
