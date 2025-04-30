// src/app/(admin)/admin/layout.tsx
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a href="/admin" className="hover:text-gray-400">Dashboard</a>
          <a href="/admin/users" className="hover:text-gray-400">Users</a>
          <a href="/admin/products" className="hover:text-gray-400">Products</a>
          {/* Add more links */}
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-8">
        {children}
      </main>
    </div>
  );
}
// This layout component provides a sidebar for the admin panel and a main content area.