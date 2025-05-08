// /src/components/Gallery/GalleryItem.tsx

import Link from 'next/link';
import Image from 'next/image';
import GalleryItemAdminControls from './GalleryItemAdminControls';
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

export default function GalleryItem({ product }: { product: Product }) {
  return (
  <div className="relative aspect-[2/3] border rounded-lg overflow-hidden shadow hover:shadow-lg transition group">
    <Link href={`/gallery/${product._id}`}>
      <Image
        src={`${API_URL}/api/uploads/${product.images[0]?.url}`}
        alt={product.name}
        fill
        className="absolute top-0 left-0 object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm">{product.description}</p>
      </div>
    </Link>
    {/* Pass the hover to child using group-hover */}
    <GalleryItemAdminControls productId={product._id} />
  </div>
  );
}
