// /app/gallery/[id]/page.tsx

// import GalleryItemPage from '@/components/gallery/GalleryItemPage';

// export default function GalleryIDPage() {
//   return (
//     <GalleryItemPage />
//   );
// }
import Image from 'next/image';
import API_URL from '@/config/config';
import ThumbnailSelector from '@/components/gallery/ThumbnailSelector';
// import ZoomableImage from '@/components/gallery/ZoomableImage';

interface ImageType {
  url: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  images: ImageType[];
}

export default async function GalleryItemPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_URL}/api/products/id/${params.id}`, { cache: 'no-store' });

  if (!res.ok) {
    return <div className="p-6 text-center">Product not found</div>;
  }

  const product: Product = await res.json();
  //const firstImage = product.images[0]?.url;

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-4">
        <div className="w-full aspect-square border rounded-lg overflow-hidden relative">
          {/* SSR all images */}
          {product.images.map((img, index) => (
              <Image
                key={img._id}
                src={`${API_URL}/api/uploads/${img.url}`}
                alt={product.name}
                fill
                className={`object-cover transition-opacity duration-300 gallery-main-image 
                  ${index === 0 ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
        </div>
        {/* Client hydration for thumbnail selection */}
        <ThumbnailSelector product={product} />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-600 text-lg">{product.description}</p>
      </div>
    </div>
  );
}
