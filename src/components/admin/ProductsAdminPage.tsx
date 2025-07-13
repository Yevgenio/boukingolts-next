'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types/Product';
import { getMarqueeProductIds, updateMarqueeProductIds } from '@/api/marquee';
import { AddIcon, RemoveIcon, EditIcon, DeleteIcon } from '@/components/icons';

export default function ProductsAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [marqueeIds, setMarqueeIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/products`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => {});
    getMarqueeProductIds().then(setMarqueeIds).catch(() => {});
    setLoading(false);
  }, [isAdmin]);

  const toggleMarquee = async (id: string) => {
    let updated: string[];
    if (marqueeIds.includes(id)) {
      updated = marqueeIds.filter(m => m !== id);
    } else {
      updated = [...marqueeIds, id];
    }
    setMarqueeIds(updated);
    await updateMarqueeProductIds(updated);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const res = await fetch(`${API_URL}/api/products/id/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    } else {
      alert('Failed to delete product');
    }
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <button
        className="bg-gray-200 px-3 py-2 rounded mb-4"
        onClick={() => router.push('/gallery/create')}
      >
        + Add New
      </button>
      <div className="space-y-2">
        {products.map(p => (
          <div key={p._id} className="flex items-center gap-2 border p-2 rounded">
            {p.images?.[0] && (
              <img
                src={`${API_URL}/api/uploads/${p.images[0].thumbnail}`}
                alt={p.name}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <span className="flex-1">{p.name}</span>
            <button onClick={() => router.push(`/gallery/${p._id}`)} className="px-2 underline">View</button>
            <button onClick={() => router.push(`/gallery/edit/${p._id}`)} className="px-2">
              <EditIcon className="w-5 h-5" />
            </button>
            <button onClick={() => handleDelete(p._id)} className="px-2">
              <DeleteIcon className="w-5 h-5" />
            </button>
            <button onClick={() => toggleMarquee(p._id)} className="px-2">
              {marqueeIds.includes(p._id) ? (
                <RemoveIcon className="w-5 h-5" />
              ) : (
                <AddIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}