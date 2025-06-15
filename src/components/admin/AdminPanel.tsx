'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (!isAdmin) return <p className="p-4">Unauthorized</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      <div className="space-y-4">
        <button
          className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
          onClick={() => router.push('/admin/website-introduction')}
        >
          Manage Website Introduction Paragraphs
        </button>
      </div>
    </div>
  );
}
