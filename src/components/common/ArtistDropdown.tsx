'use client';

import { useState, useEffect, useRef } from 'react';
import API_URL, { resolveImageUrl } from '@/config/config';
import { AboutContent } from '@/types/HomeContent';

type ArtistValue = 'elena' | 'alexey' | 'archive';

interface ArtistOption {
  value: ArtistValue;
  label: string;
  imageUrl?: string;
}

interface Props {
  value: ArtistValue;
  onChange: (artist: ArtistValue) => void;
}

export default function ArtistDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ArtistOption[]>([
    { value: 'alexey', label: 'Alexey Boukingolts' },
    { value: 'elena', label: 'Elena Boukingolts' },
    { value: 'archive', label: 'Archive' },
  ]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/content/about-boukingolts?artist=alexey`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API_URL}/content/about-boukingolts?artist=elena`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([alexeyAbout, elenaAbout]: [AboutContent | null, AboutContent | null]) => {
      setOptions(prev => prev.map(opt => {
        if (opt.value === 'alexey' && alexeyAbout?.images?.[0])
          return { ...opt, imageUrl: resolveImageUrl(alexeyAbout.images[0].url) };
        if (opt.value === 'elena' && elenaAbout?.images?.[0])
          return { ...opt, imageUrl: resolveImageUrl(elenaAbout.images[0].url) };
        return opt;
      }));
    });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative w-64">
      <button
        type="button"
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-3 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-800 hover:border-stone-400 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-200"
      >
        <ArtistAvatar option={current} size={32} />
        <span className="flex-1 text-left font-medium">{current?.label}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-30 top-full left-0 mt-1.5 w-full bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-stone-50 ${value === opt.value ? 'bg-stone-50' : ''}`}
            >
              <ArtistAvatar option={opt} size={36} />
              <span className={`flex-1 text-left font-medium ${value === opt.value ? 'text-stone-900' : 'text-stone-700'}`}>
                {opt.label}
              </span>
              {value === opt.value && (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" className="text-stone-700 flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArtistAvatar({ option, size }: { option?: ArtistOption; size: number }) {
  const s = size;

  if (option?.value === 'archive') {
    return (
      <div style={{ width: s, height: s }} className="rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" width={s * 0.5} height={s * 0.5} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-stone-500">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      </div>
    );
  }

  if (option?.imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={option.imageUrl}
        alt={option?.label ?? ''}
        style={{ width: s, height: s }}
        className="rounded-full object-cover flex-shrink-0 bg-stone-100"
      />
    );
  }

  const initials = option?.label?.split(' ').map(w => w[0]).join('').slice(0, 2) ?? '?';
  return (
    <div style={{ width: s, height: s }} className="rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
      <span className="text-stone-600 font-medium" style={{ fontSize: s * 0.35 }}>{initials}</span>
    </div>
  );
}
