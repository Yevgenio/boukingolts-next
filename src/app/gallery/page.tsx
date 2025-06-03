// /app/gallery/page.tsx

import GalleryItem from '@/components/gallery/GalleryItem';
import GalleryAdminControls from '@/components/gallery/GalleryAdminControls'; 
import API_URL from '@/config/config';

interface Image {
  url: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: Image[];
}

export default async function GalleryPage() {
  const res = await fetch(`${API_URL}/api/products`, { cache: 'no-store' });
  const products: Product[] = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Gallery</h1>

      {/* Admin button hydration */}
      <GalleryAdminControls />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <GalleryItem
            key={product._id}
            product={product}
          />        
        ))}
      </div>
    </div>
  );
}