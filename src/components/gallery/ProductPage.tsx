import Image from 'next/image';
import Link from 'next/link';
import API_URL from '@/config/config';
import ProductPageAdminControls from '@/components/gallery/ProductPageAdminControls';
import ThumbnailSelector from '@/components/gallery/ThumbnailSelector';
import { Product } from '@/types/Product';

export default async function GalleryItemPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_URL}/api/products/id/${params.id}`, { cache: 'no-store' });

  if (!res.ok) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-stone-400 italic">Artwork not found.</p>
        <Link href="/gallery" className="text-sm text-stone-500 hover:text-stone-700 underline mt-4 inline-block">← Back to gallery</Link>
      </div>
    );
  }

  const product: Product = await res.json();

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Back link */}
      <Link href="/gallery" className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-8 block">
        ← Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Image viewer */}
        <div className="flex flex-col gap-3">
          <div className="w-full aspect-[3/4] rounded-xl overflow-hidden relative bg-stone-100 shadow-sm">
            {product.images.map((img, index) => (
              <Image
                key={img._id}
                src={`${API_URL}/api/uploads/${img.url}`}
                alt={product.name}
                fill
                className={`object-contain transition-opacity duration-300 gallery-main-image ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
          {product.images.length > 1 && <ThumbnailSelector product={product} />}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">{product.name}</h1>
            <div className="h-px bg-stone-200 mt-4" />
          </div>

          <ProductPageAdminControls productId={params.id} />

          {(product.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags!.map((tag: string) => (
                <span
                  key={tag}
                  className="border border-stone-300 text-stone-600 text-xs px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {product.description && (
            <div
              className="prose prose-sm prose-stone max-w-none text-stone-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
