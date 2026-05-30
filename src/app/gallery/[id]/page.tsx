import type { Metadata } from 'next';
import ProductPage from '@/components/gallery/ProductPage';
import API_URL, { resolveImageUrl } from '@/config/config';
import { Product } from '@/types/Product';

type Props = { params: Promise<{ id: string }> };

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/api/products/id/${id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Artwork' };
    const product: Product = await res.json();
    const description = product.description
      ? stripHtml(product.description).slice(0, 160)
      : `${product.category ? product.category + ' artwork' : 'Artwork'} by Boukingolts`;
    const imageUrl = product.images?.[0]?.url
      ? resolveImageUrl(product.images[0].url)
      : undefined;
    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description,
        type: 'article',
        ...(imageUrl && { images: [{ url: imageUrl }] }),
      },
    };
  } catch {
    return { title: 'Artwork' };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  return <ProductPage params={resolvedParams} />;
}
