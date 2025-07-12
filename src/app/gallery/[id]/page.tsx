// /app/gallery/page.tsx

import ProductPage from '@/components/gallery/ProductPage';

export default function Page({ params }: { params: { id: string } }) {
  return <ProductPage params={params} />;
}
