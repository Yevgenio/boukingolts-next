'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BackIcon } from '../icons';

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (!isAdmin) return <p className="p-4">Unauthorized</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      
      <div className="text-4xl font-bold flex mb-6">
        <button  className="mb-4 pr-2">
          <BackIcon onClick={() => router.back()}className="w-10 h-10" />
        </button>
        Admin Panel
      </div>
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Home Page</h2>
          {/* <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/website-introduction')}>
            Manage Website Introduction Paragraphs
          </button> */}
          <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/hero')}>
            Edit Hero Section
          </button>
          <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/marquee')}>
            Edit Product Marquee
          </button>
          <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/testimonials')}>
            Edit Testimonials
          </button>
          <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/events')}>
            Edit Where to Find Us
          </button>
          <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/about')}>
            Edit About Section
          </button>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <button className="block w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800" onClick={() => router.push('/admin/products')}>
            Manage Products
          </button>
        </div>
      </div>
    </div>
  );
}