import Link from 'next/link';
import Image from 'next/image';
import GalleryItemAdminControls from './GalleryItemAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';

export default function GalleryItem({ product }: { product: Product }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group bg-stone-100">
      <Link href={`/gallery/${product._id}`}>
        <Image
          src={`${API_URL}/api/uploads/${product.images[0]?.thumbnail}`}
          alt={product.name}
          width={product.images[0]?.width || 400}
          height={product.images[0]?.height || 500}
          className="w-full h-auto object-cover"
          placeholder="blur"
          blurDataURL={`${API_URL}/api/uploads/default.jpg`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-full p-4">
          <h2 className="text-white font-serif text-lg leading-snug drop-shadow">{product.name}</h2>
          {(product.tags?.length ?? 0) > 0 && (
            <p className="text-stone-300 text-xs mt-1 tracking-wide">
              {product.tags!.slice(0, 3).join(' · ')}
            </p>
          )}
        </div>
      </Link>
      <GalleryItemAdminControls productId={product._id} />
    </div>
  );
}
