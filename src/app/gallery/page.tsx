// /app/gallery/page.tsx

import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';

export default async function GalleryPage() {
  const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
  const products: Product[] = await res.json();

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>
      
      <GalleryAdminControls />

      {/* Masonry layout using columns and break-inside */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {products.map((product) => (
          <div key={product._id} className="break-inside-avoid">
            <GalleryItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
