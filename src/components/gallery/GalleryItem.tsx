import Link from 'next/link';
import Image from 'next/image';
import GalleryItemAdminControls from './GalleryItemAdminControls';
import { IMAGE_URL } from '@/config/config';
import { Product } from '@/types/Product';

function formatDims(product: Product): string | null {
  const d = product.dimensions;
  if (!d || d.length < 2) return null;
  const unit = product.dimensionUnit ?? 'cm';
  return d.length >= 3
    ? `${d[0]} × ${d[1]} × ${d[2]} ${unit}`
    : `${d[0]} × ${d[1]} ${unit}`;
}

export default function GalleryItem({ product }: { product: Product }) {
  const dims = formatDims(product);

  return (
    <div className="relative w-full h-full rounded-xl shadow-sm hover:shadow-2xl transition-shadow duration-500 group">
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-100">
        <Link href={`/gallery/${product._id}`} className="block h-full">
          <Image
            src={`${IMAGE_URL}/${product.images[0]?.thumbnail ?? 'default.jpg'}`}
            alt={product.name}
            width={product.images[0]?.width || 400}
            height={product.images[0]?.height || 500}
            className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            placeholder="blur"
            blurDataURL={`${IMAGE_URL}/default.jpg`}
          />

          {/* Gradient — subtle by default, deepens on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

          {/* For sale badge */}
          {product.forSale && (
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-700 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Available
            </div>
          )}

          {/* Info panel — slides up on hover */}
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <h2 className="text-white font-serif text-lg leading-snug drop-shadow">{product.name}</h2>
            {(product.tags?.length ?? 0) > 0 && (
              <p className="text-stone-300 text-xs mt-1 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.tags!.slice(0, 3).join(' · ')}
              </p>
            )}
            {dims && (
              <p className="text-stone-400 text-[11px] mt-1.5 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                {dims}
              </p>
            )}
          </div>
        </Link>
      </div>
      <GalleryItemAdminControls productId={product._id} />
    </div>
  );
}
