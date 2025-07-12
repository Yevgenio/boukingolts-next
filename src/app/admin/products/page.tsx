import dynamic from 'next/dynamic';

const ProductsAdminPage = dynamic(() => import('@/components/admin/ProductsAdminPage'), { ssr: false });

export default function AdminProducts() {
  return <ProductsAdminPage />;
}