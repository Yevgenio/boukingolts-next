import Link from 'next/link';
import API_URL from '@/config/config';
import ProductPageAdminControls from '@/components/gallery/ProductPageAdminControls';
import ProductImageViewer from '@/components/gallery/ProductImageViewer';
import { Product } from '@/types/Product';

export default async function GalleryItemPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_URL}/api/products/id/${params.id}`, { cache: 'no-store' });

  if (!res.ok) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="text-stone-400 italic text-lg">Artwork not found.</p>
        <Link href="/gallery" className="text-sm text-stone-500 hover:text-stone-700 underline mt-4 inline-block">
          ← Back to gallery
        </Link>
      </div>
    );
  }

  const product: Product = await res.json();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <Link href="/gallery" className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-8 block">
        ← Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Image viewer */}
        <ProductImageViewer images={product.images ?? []} name={product.name} />

        {/* Details */}
        <div className="flex flex-col gap-6 pt-2">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">{product.name}</h1>
            <div className="h-px bg-stone-200 mt-5" />
          </div>

          <ProductPageAdminControls productId={params.id} />

          {(product.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags!.map((tag: string) => (
                <span key={tag} className="border border-stone-300 text-stone-600 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <div
              className="prose prose-sm prose-stone max-w-none text-stone-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description.replace(/&nbsp;/g, ' ') }}
            />
          )}

          {product.price != null && (
            <div className="pt-2 border-t border-stone-100">
              {product.salePercent ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-medium text-stone-900">
                    ₪{(product.price * (1 - product.salePercent / 100)).toFixed(0)}
                  </span>
                  <span className="text-sm text-stone-400 line-through">₪{product.price}</span>
                  <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                    {product.salePercent}% off
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-medium text-stone-900">₪{product.price}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
