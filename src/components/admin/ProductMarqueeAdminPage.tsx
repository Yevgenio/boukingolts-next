'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MarqueeContent } from '@/types/HomeContent';
import { Product } from '@/types/Product';
import { getMarqueeProducts, updateMarqueeProductIds } from '@/api/marquee';

export default function ProductMarqueeAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<MarqueeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [newId, setNewId] = useState('');

 useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/home-product-marquee`)
      .then(res => res.json())
      .then(data => setForm(data))
      .catch(() => {});

    getMarqueeProducts()
      .then((data) => setProducts(data))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const save = async () => {
    if (!form) return;
    await fetch(`${API_URL}/api/content/home-product-marquee`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });

    await updateMarqueeProductIds(products.map(p => p._id));
  };

  const move = (index: number, dir: number) => {
    const updated = [...products];
    const tgt = index + dir;
    if (tgt < 0 || tgt >= updated.length) return;
    const [item] = updated.splice(index, 1);
    updated.splice(tgt, 0, item);
    setProducts(updated);
  };

  const remove = (index: number) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  const addProduct = async () => {
    if (!newId.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/products/id/${newId.trim()}`);
      if (!res.ok) throw new Error('Not found');
      const prod: Product = await res.json();
      setProducts([...products, prod]);
      setNewId('');
    } catch {
      alert('Product not found');
    }
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product Marquee</h1>
      <label className="flex items-center gap-2">
        <span>Enabled</span>
        <input type="checkbox" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
      </label>
      <label className="block">
        Order
        <input type="number" className="border w-full p-2" value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
      </label>

      <div className="space-y-2">
        {products.map((p, i) => (
          <div key={p._id} className="flex items-center gap-2 border p-2 rounded">
            {p.images?.[0] && (
              <img
                src={`${API_URL}/api/uploads/${p.images[0].thumbnail}`}
                alt={p.name}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <span className="flex-1">{p.name}</span>
            <button onClick={() => move(i, -1)} className="px-2">↑</button>
            <button onClick={() => move(i, 1)} className="px-2">↓</button>
            <button onClick={() => remove(i)} className="px-2 text-red-600">✕</button>
            <button onClick={() => router.push(`/gallery/${p._id}`)} className="px-2 underline">View</button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 items-center">
        <input value={newId} onChange={e => setNewId(e.target.value)} placeholder="Product ID" className="flex-1 border p-2" />
        <button className="bg-gray-200 px-3 py-2 rounded" onClick={addProduct}>Add</button>
      </div>

      <button className="bg-black text-white px-4 py-2 rounded" onClick={save}>Save</button>
    </div>
  );
}