import Link from 'next/link';
import API_URL from '@/config/config';
import ProductPageAdminControls from '@/components/gallery/ProductPageAdminControls';
import ProductImageViewer from '@/components/gallery/ProductImageViewer';
import { Product } from '@/types/Product';

function formatDims(product: Product): string | null {
  const d = product.dimensions;
  if (!d || d.length < 2) return null;
  const unit = product.dimensionUnit ?? 'cm';
  return d.length >= 3 ? `${d[0]} × ${d[1]} × ${d[2]} ${unit}` : `${d[0]} × ${d[1]} ${unit}`;
}

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
  const dims = formatDims(product);
  const cleanSpecs = product.specs?.filter(s => s.key && s.value) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      <Link href="/gallery" className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-8 block">
        ← Gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-12 items-start">

        <ProductImageViewer images={product.images ?? []} name={product.name} />

        <div className="flex flex-col gap-5 pt-2">

          {/* Title */}
          <div>
            <h1 className="text-4xl font-serif text-stone-900 leading-tight">{product.name}</h1>
            <div className="h-px bg-stone-200 mt-5" />
          </div>

          {/* Metadata row */}
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5">
            {product.category && (
              <span className="text-xs text-stone-400 uppercase tracking-widest">{product.category}</span>
            )}
            {!!product.year && (
              <span className="text-xs text-stone-400">{product.year}</span>
            )}
            {product.forSale && (
              <span className="text-[10px] font-semibold tracking-widest uppercase bg-stone-800 text-white px-2.5 py-1 rounded-full">
                Available
              </span>
            )}
          </div>

          <ProductPageAdminControls productId={params.id} />

          {/* Tags */}
          {(product.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags!.map((tag: string) => (
                <span key={tag} className="border border-stone-300 text-stone-600 text-xs px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Dimensions */}
          {dims && (
            <p className="text-sm text-stone-600 tracking-wide">{dims}</p>
          )}

          {/* Description */}
          {product.description && (
            <div
              className="prose prose-sm prose-stone max-w-none text-stone-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description.replace(/&nbsp;/g, ' ') }}
            />
          )}

          {/* Specs table */}
          {cleanSpecs.length > 0 && (
            <div className="border-t border-stone-100 pt-4">
              <table className="w-full text-sm">
                <tbody>
                  {cleanSpecs.map((s, i) => (
                    <tr key={i} className="border-b border-stone-100 last:border-0">
                      <td className="py-2 pr-6 text-stone-400 text-xs uppercase tracking-wide w-2/5">{s.key}</td>
                      <td className="py-2 text-stone-700 text-sm">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Price */}
          {product.price != null && product.price > 0 && (
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
