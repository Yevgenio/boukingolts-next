import type { Metadata } from 'next';
import GalleryPage from '@/components/gallery/GalleryPage';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse original artworks by Boukingolts — paintings, sculptures, and mixed media.',
  openGraph: {
    title: 'Gallery | Boukingolts',
    description: 'Browse original artworks — paintings, sculptures, and mixed media.',
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function str(v: string | string[] | undefined): string {
  return typeof v === 'string' ? v : '';
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (str(params.category)) qs.set('category', str(params.category));
  if (str(params.series)) qs.set('series', str(params.series));
  if (str(params.tag)) qs.set('tag', str(params.tag));
  if (str(params.sort)) qs.set('sort', str(params.sort));

  let initialProducts: Product[] = [];
  try {
    const res = await fetch(`${API_URL}/products/search${qs.size ? `?${qs}` : ''}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      initialProducts = data.data ?? [];
    }
  } catch { /* render client-only if fetch fails */ }

  return <GalleryPage initialProducts={initialProducts} />;
}
