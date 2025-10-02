// /app/gallery/[id]/page.tsx

// import GalleryItemPage from '@/components/gallery/GalleryItemPage';

// export default function GalleryIDPage() {
//   return (
//     <GalleryItemPage />
//   );
// }
import Image from 'next/image';
import API_URL from '@/config/config';
import ProductPageAdminControls from '@/components/gallery/ProductPageAdminControls';
import ThumbnailSelector from '@/components/gallery/ThumbnailSelector';
import { Product } from '@/types/Product';
import PageHeader from '@/components/common/PageHeader';

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
        <PageHeader title={product.name} />
        <ProductPageAdminControls productId={params.id} />
        {product.tags && product.tags.length > 0 && (
          
            <div className="flex flex-wrap gap-2 mb-2">
                {product.tags.map((tag: string) => (
                    <div
                        key={tag}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                        #{tag}
                    </div>
                ))}
            </div>
        )}
        {/* <h1 className="text-3xl font-bold">{product.name}</h1> */}
        {/* <p className="text-gray-600 text-lg">{product.description}</p> */}
        <div className="text-gray-600 text-lg" dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>
    </div>
  );
}
