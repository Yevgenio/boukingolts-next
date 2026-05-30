'use client';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getGallerySettings, setGallerySettings, GallerySettings } from '@/api/gallerySettings';
import { buildRows, computeRowHeight, itemWidth } from '@/utils/galleryLayout';
import { Product } from '@/types/Product';
import API_URL, { IMAGE_URL } from '@/config/config';

const PREVIEW_GAP = 3;

function Slider({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-sm font-medium text-stone-700">{label}</label>
        <span className="text-sm text-stone-500 tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-stone-800"
      />
      <div className="flex justify-between text-xs text-stone-400 mt-1">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

function Preview({ products, settings }: { products: Product[]; settings: GallerySettings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const rows = useMemo(
    () => width ? buildRows(products, width, settings.targetHeight, settings.variance) : [],
    [products, width, settings]
  );

  return (
    <div ref={containerRef} className="w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-50 min-h-32">
      {!products.length && (
        <p className="text-sm text-stone-400 italic text-center py-10">No artworks to preview</p>
      )}
      {products.length > 0 && width > 0 && (
        <div className="flex flex-col" style={{ gap: PREVIEW_GAP }}>
          {rows.map((row, rowIdx) => {
            const isLast = rowIdx === rows.length - 1;
            const rh = computeRowHeight(row, width, settings.targetHeight, isLast);
            return (
              <div key={rowIdx} className="flex" style={{ gap: PREVIEW_GAP, height: rh }}>
                {row.map(p => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p._id}
                    src={`${IMAGE_URL}/${p.images[0]?.thumbnail}`}
                    alt={p.name}
                    style={{ width: itemWidth(p, rh), height: rh, flexShrink: 0, objectFit: 'cover' }}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function GalleryLayoutAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<GallerySettings>({ targetHeight: 280, variance: 100 });

  useEffect(() => {
    if (!isAdmin) return;
    getGallerySettings().then(setSettings);
    fetch(`${API_URL}/api/products/search`, { cache: 'no-store' })
      .then(r => r.json()).then((d: { data: Product[] }) => setProducts(d.data ?? [])).catch(() => {});
  }, [isAdmin]);

  if (!isAdmin) return <p className="p-4">Unauthorized</p>;

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    await setGallerySettings(settings);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <button onClick={() => router.back()} className="text-sm text-stone-400 hover:text-stone-600 mb-6 flex items-center gap-1">
          ← Back
        </button>

        <h1 className="text-3xl font-serif text-stone-800 mb-1">Gallery Layout</h1>
        <p className="text-sm text-stone-500 mb-8">
          Controls how rows are formed. Target height sets the average row size. Variance controls how much rows can differ — higher variance allows 1 wide image or 5 thin ones in the same gallery.
        </p>
        <div className="h-px bg-stone-200 mb-8" />

        <div className="space-y-8 mb-10">
          <Slider
            label="Target row height"
            value={settings.targetHeight}
            min={100} max={600} unit="px"
            onChange={v => setSettings(s => ({ ...s, targetHeight: v }))}
          />
          <Slider
            label="Row height variance"
            value={settings.variance}
            min={0} max={300} unit="px"
            onChange={v => setSettings(s => ({ ...s, variance: v }))}
          />
        </div>

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Preview</p>
          <Preview products={products} settings={settings} />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          {saved && <p className="text-sm text-green-600">Saved.</p>}
        </div>

      </div>
    </div>
  );
}
