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

  useEffect(() => {
    if (!isAdmin) return;
    getMarqueeProductIds().then((ids) => setInList(ids.includes(productId))).catch(() => {});
  }, [isAdmin, productId]);

  if (!isAdmin) return null;

  const toggleMarquee = async () => {
    const ids = await getMarqueeProductIds().catch(() => [] as string[]);
    let updated: string[];
    if (ids.includes(productId)) {
      updated = ids.filter((id: string) => id !== productId);
      setInList(false);
    } else {
      updated = [...ids, productId];
      setInList(true);
    }
    await updateMarqueeProductIds(updated);
  };

  const handleEdit = () => router.push(`/gallery/edit/${productId}`);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`${API_URL}/api/products/id/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      router.push('/gallery');
    } else {
      alert('Failed to delete product');
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={handleEdit} className="bg-gray-200 px-3 py-1 rounded">Edit</button>
      <button onClick={handleDelete} className="bg-gray-200 px-3 py-1 rounded">Delete</button>
      <button onClick={toggleMarquee} className="bg-gray-200 px-3 py-1 rounded">
        {inList ? 'Remove from Marquee' : 'Add to Marquee'}
      </button>
    </div>
  );
}