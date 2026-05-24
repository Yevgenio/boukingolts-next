'use client';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MarqueeContent } from '@/types/HomeContent';
import { Product } from '@/types/Product';
import { getMarqueeProducts, updateMarqueeProductIds } from '@/api/marquee';

const INPUT = 'border border-stone-300 rounded-lg w-full px-3 py-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-800';
const LABEL = 'block text-sm font-medium text-stone-700';

function MarqueePreview({ products }: { products: Product[] }) {
  if (!products.length)
    return <p className="text-sm text-stone-400 italic text-center py-6">No products selected yet</p>;
  return (
    <div className="border-y border-stone-200 py-3 overflow-x-auto">
      <div className="flex gap-3 px-2" style={{ minWidth: 'max-content' }}>
        {products.map((p) => (
          <div key={p._id} className="flex-shrink-0 w-24 text-center">
            <div className="w-24 h-32 rounded overflow-hidden shadow-sm bg-stone-200">
              {p.images?.[0]?.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`${API_URL}/api/uploads/${p.images[0].thumbnail}`} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-xs text-stone-600 mt-1 truncate">{p.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductMarqueeAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<MarqueeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newId, setNewId] = useState('');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${API_URL}/api/content/home-product-marquee`).then(res => res.json()).then(data => setForm(data)).catch(() => {});
    getMarqueeProducts().then(setProducts).finally(() => setLoading(false));
  }, [isAdmin]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const [res] = await Promise.all([
        fetch(`${API_URL}/api/content/home-product-marquee`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form),
        }),
        updateMarqueeProductIds(products.map(p => p._id)),
      ]);
      if (res.ok) { showToast('Marquee saved!', true); setTimeout(() => router.push('/admin'), 1500); }
      else showToast('Failed to save', false);
    } catch { showToast('Failed to save', false); }
    finally { setSaving(false); }
  };

  const move = (index: number, dir: number) => {
    const updated = [...products];
    const tgt = index + dir;
    if (tgt < 0 || tgt >= updated.length) return;
    const [item] = updated.splice(index, 1);
    updated.splice(tgt, 0, item);
    setProducts(updated);
  };

  const addProduct = async () => {
    if (!newId.trim()) return;
    try {
      const res = await fetch(`${API_URL}/api/products/id/${newId.trim()}`);
      if (!res.ok) throw new Error();
      const prod: Product = await res.json();
      setProducts([...products, prod]);
      setNewId('');
    } catch { showToast('Product not found', false); }
  };

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;
  if (loading || !form) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">← Back to Admin</button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Edit Product Marquee</h1>
        <div className="h-px bg-stone-200 mb-6" />


        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-stone-800 w-4 h-4" checked={form.enabled} onChange={e => setForm({ ...form, enabled: e.target.checked })} />
                <span className="text-sm font-medium text-stone-700">Section enabled</span>
              </label>
              <div>
                <label className={LABEL}>Display order</label>
                <input type="number" className={INPUT} value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Products in Marquee</h2>
              {products.length === 0 && <p className="text-sm text-stone-400 italic">No products added yet</p>}
              {products.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 border border-stone-100 rounded-lg p-2 bg-stone-50">
                  {p.images?.[0]?.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${API_URL}/api/uploads/${p.images[0].thumbnail}`} alt={p.name} className="w-10 h-10 object-cover rounded" />
                  )}
                  <span className="flex-1 text-sm text-stone-700">{p.name}</span>
                  <button onClick={() => router.push(`/gallery/${p._id}`)} className="text-xs text-stone-400 underline">View</button>
                  <button onClick={() => move(i, -1)} className="px-1.5 text-stone-400 hover:text-stone-700">↑</button>
                  <button onClick={() => move(i, 1)} className="px-1.5 text-stone-400 hover:text-stone-700">↓</button>
                  <button onClick={() => setProducts(products.filter((_, j) => j !== i))} className="px-1.5 text-red-400 hover:text-red-600">✕</button>
                </div>
              ))}

              <div className="flex gap-2 items-center pt-2">
                <input
                  value={newId} onChange={e => setNewId(e.target.value)} placeholder="Paste a Product ID here"
                  className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-200"
                  onKeyDown={e => e.key === 'Enter' && addProduct()}
                />
                <button className="bg-stone-100 border border-stone-300 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-200" onClick={addProduct}>Add</button>
                <button className="bg-white border border-stone-300 px-3 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-50 whitespace-nowrap" onClick={() => router.push('/admin/products')} type="button">
                  Browse →
                </button>
              </div>
            </div>

            <button className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors w-full" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {toast && (
              <p className={`text-sm text-center ${toast.ok ? 'text-green-700' : 'text-red-600'}`}>{toast.msg}</p>
            )}
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Live Preview</p>
            <div className="border border-stone-200 rounded-xl bg-white p-4">
              <MarqueePreview products={products} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
