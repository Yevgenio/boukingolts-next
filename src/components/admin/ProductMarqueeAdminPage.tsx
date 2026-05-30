'use client';
import { useEffect, useState, useRef } from 'react';
import API_URL, { resolveImageUrl } from '@/config/config';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MarqueeContent, EventsContent } from '@/types/HomeContent';
import { Product } from '@/types/Product';
import { getMarqueeProducts, updateMarqueeProductIds } from '@/api/marquee';
import ProductMarquee from '@/components/home/ProductMarquee';

const REAL_W = 900;

const INPUT = 'border border-stone-300 rounded-lg w-full px-3 py-2.5 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 text-stone-800';
const LABEL = 'block text-sm font-medium text-stone-700';


export default function ProductMarqueeAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  const previewRef = useRef<HTMLDivElement>(null);
  const [previewW, setPreviewW] = useState(450);
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setPreviewW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [marquee, setMarquee] = useState<MarqueeContent | null>(null);
  const [events, setEvents] = useState<EventsContent | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newId, setNewId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([
      fetch(`${API_URL}/api/content/home-product-marquee`).then(r => r.json()),
      fetch(`${API_URL}/api/content/home-events`).then(r => r.json()),
      getMarqueeProducts(),
    ]).then(([marqueeData, eventsData, productData]) => {
      setMarquee(marqueeData);
      setEvents(eventsData);
      setProducts(productData);
    }).finally(() => setLoading(false));
  }, [isAdmin]);

  const save = async () => {
    if (!marquee || !events) return;
    setSaving(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch(`${API_URL}/api/content/home-product-marquee`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify(marquee),
        }),
        fetch(`${API_URL}/api/content/home-events`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
          body: JSON.stringify(events),
        }),
        updateMarqueeProductIds(products.map(p => p._id)),
      ]);
      if (r1.ok && r2.ok) { showToast('Saved!', true); setTimeout(() => router.push('/admin'), 1500); }
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
  if (loading || !marquee || !events) return <div className="p-4">Loading…</div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">
          ← Back to Admin
        </button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Homepage Sections</h1>
        <div className="h-px bg-stone-200 mb-6" />

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="space-y-4">

            {/* Product Marquee */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Product Marquee</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-stone-800 w-4 h-4" checked={marquee.enabled} onChange={e => setMarquee({ ...marquee, enabled: e.target.checked })} />
                <span className="text-sm font-medium text-stone-700">Section enabled</span>
              </label>
              <div>
                <label className={LABEL}>Display order</label>
                <input type="number" className={INPUT} value={marquee.order} onChange={e => setMarquee({ ...marquee, order: parseInt(e.target.value) })} />
              </div>
            </div>

            {/* Product list */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3">
              <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Products in Marquee</h2>
              {products.length === 0 && <p className="text-sm text-stone-400 italic">No products added yet</p>}
              {products.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 border border-stone-100 rounded-lg p-2 bg-stone-50">
                  {p.images?.[0]?.thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveImageUrl(p.images[0].thumbnail)} alt={p.name} className="w-10 h-10 object-cover rounded" />
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

            {/* Upcoming Events */}
            <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
              <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase">Upcoming Events</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="accent-stone-800 w-4 h-4" checked={events.enabled} onChange={e => setEvents({ ...events, enabled: e.target.checked })} />
                <span className="text-sm font-medium text-stone-700">Section enabled</span>
              </label>
              <div>
                <label className={LABEL}>Display order</label>
                <input type="number" className={INPUT} value={events.order} onChange={e => setEvents({ ...events, order: parseInt(e.target.value) })} />
              </div>
            </div>

            <button
              className="bg-stone-800 hover:bg-stone-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 transition-colors w-full"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            {toast && (
              <p className={`text-sm text-center ${toast.ok ? 'text-green-700' : 'text-red-600'}`}>{toast.msg}</p>
            )}
          </div>

          {/* Preview */}
          <div ref={previewRef} className="lg:sticky lg:top-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Marquee Preview — {Math.round(previewW / REAL_W * 100)}% scale</p>
            <div className="rounded-xl overflow-hidden border border-stone-200" style={{ height: 240 }}>
              <div style={{ width: REAL_W, transformOrigin: 'top left', transform: `scale(${previewW / REAL_W})`, pointerEvents: 'none' }}>
                <ProductMarquee products={products} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
