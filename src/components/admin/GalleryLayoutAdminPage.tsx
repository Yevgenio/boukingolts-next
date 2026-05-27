'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getGalleryColumns, setGalleryColumns } from '@/api/gallerySettings';

const OPTIONS: { value: 2 | 3 | 4; label: string; description: string }[] = [
  { value: 2, label: '2 per row', description: 'Large, cinematic — best for landscapes' },
  { value: 3, label: '3 per row', description: 'Balanced — works for any mix' },
  { value: 4, label: '4 per row', description: 'Dense grid — best for portraits' },
];

export default function GalleryLayoutAdminPage() {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const [columns, setColumns] = useState<2 | 3 | 4>(3);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    getGalleryColumns().then(setColumns);
  }, [isAdmin]);

  if (!isAdmin) return <p className="p-4">Unauthorized</p>;

  const handleSave = async (value: 2 | 3 | 4) => {
    setColumns(value);
    setSaving(true);
    setSaved(false);
    await setGalleryColumns(value);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <button onClick={() => router.back()} className="text-sm text-stone-400 hover:text-stone-600 mb-6 flex items-center gap-1">
          ← Back
        </button>

        <h1 className="text-3xl font-serif text-stone-800 mb-1">Gallery Layout</h1>
        <p className="text-sm text-stone-500 mb-8">Controls how many artworks appear per row. Row height adjusts automatically.</p>
        <div className="h-px bg-stone-200 mb-8" />

        <div className="space-y-3">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleSave(opt.value)}
              disabled={saving}
              className={`w-full flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-150 ${
                columns === opt.value
                  ? 'border-stone-800 bg-white shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                columns === opt.value ? 'border-stone-800' : 'border-stone-300'
              }`}>
                {columns === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-stone-800" />}
              </div>
              <div>
                <p className="font-semibold text-stone-800">{opt.label}</p>
                <p className="text-sm text-stone-500">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>

        {saved && <p className="text-sm text-green-600 mt-4">Saved.</p>}
      </div>
    </div>
  );
}
