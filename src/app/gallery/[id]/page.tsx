import ProductPage from '@/components/gallery/ProductPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ProductPage params={resolvedParams} />;
}
