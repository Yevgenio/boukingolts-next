'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import API_URL from '@/config/config';
import { listImages, deleteImage, ManagedImage } from '@/api/images';

const CONTENT_LABELS: Record<string, string> = {
  'home-hero': 'Hero',
  'home-product-marquee': 'Marquee',
  'home-testimonials': 'Testimonials',
  'home-events': 'Events',
  'about-boukingolts': 'About',
};

function formatSize(bytes?: number | null): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function UsedInBadge({ entry }: { entry: ManagedImage['usedIn'][0] }) {
  const label = entry.type === 'content'
    ? (CONTENT_LABELS[entry.name] ?? entry.name)
    : entry.name;
  const colour = entry.type === 'product'
    ? 'bg-blue-50 text-blue-700'
    : entry.type === 'event'
    ? 'bg-amber-50 text-amber-700'
    : 'bg-green-50 text-green-700';
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colour}`}>
      {label}
    </span>
  );
}

function ImageCard({ img, onDeleted }: { img: ManagedImage; onDeleted: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirming) { setConfirming(true); setTimeout(() => setConfirming(false), 3000); return; }
    setDeleting(true);
    try {
      await deleteImage(img._id);
      onDeleted();
    } catch {
      setDeleting(false);
      setConfirming(false);
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden flex flex-col">
      <div className="aspect-square bg-stone-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${API_URL}/api/uploads/${img.thumbnail}`}
          alt={img.url}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <p className="text-xs text-stone-500 truncate" title={img.url}>{img.url}</p>
        <div className="flex gap-3 text-xs text-stone-400">
          <span>{formatSize(img.size)}</span>
          {img.width && img.height && <span>{img.width}×{img.height}</span>}
        </div>
        <div className="flex flex-wrap gap-1 min-h-[1.5rem]">
          {img.usedIn.length === 0
            ? <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-400">Unused</span>
            : img.usedIn.map((u, i) => <UsedInBadge key={i} entry={u} />)
          }
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`mt-auto w-full text-xs py-1.5 rounded-lg border transition-colors ${
            confirming
              ? 'bg-red-600 text-white border-red-600'
              : 'border-stone-200 text-stone-500 hover:border-red-300 hover:text-red-600'
          }`}
        >
          {deleting ? 'Deleting…' : confirming ? 'Confirm delete?' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

export default function ImageManagerPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [images, setImages] = useState<ManagedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [orphanedOnly, setOrphanedOnly] = useState(false);

  const load = () => {
    setLoading(true);
    listImages().then(setImages).finally(() => setLoading(false));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  if (!isAdmin) return <div className="p-4">Unauthorized</div>;

  const visible = orphanedOnly ? images.filter(img => img.usedIn.length === 0) : images;
  const totalSize = images.reduce((acc, img) => acc + (img.size ?? 0), 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => router.push('/admin')} className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-4 block">← Back to Admin</button>
        <h1 className="text-2xl font-serif text-stone-800 mb-1">Image Library</h1>
        <div className="h-px bg-stone-200 mb-6" />

        {!loading && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-stone-500">
              {images.length} image{images.length !== 1 ? 's' : ''} · {formatSize(totalSize)} total
            </p>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-stone-600">
              <input
                type="checkbox"
                className="accent-stone-800 w-4 h-4"
                checked={orphanedOnly}
                onChange={e => setOrphanedOnly(e.target.checked)}
              />
              Show unused only
            </label>
          </div>
        )}

        {loading ? (
          <p className="text-stone-400 text-sm">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="text-stone-400 text-sm italic text-center py-16">
            {orphanedOnly ? 'No unused images found.' : 'No images found.'}
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {visible.map(img => (
              <ImageCard key={img._id} img={img} onDeleted={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
