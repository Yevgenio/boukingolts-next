'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  FiImage,
  FiSliders,
  FiMessageSquare,
  FiMapPin,
  FiInfo,
  FiGrid,
  FiChevronRight,
  FiFolder,
  FiLayout,
} from 'react-icons/fi';

const HOME_ITEMS = [
  {
    label: 'Hero Section',
    description: 'Edit the main banner — title, text and images',
    icon: FiImage,
    path: '/admin/hero',
  },
  {
    label: 'Product Marquee',
    description: 'Choose which products scroll across the homepage',
    icon: FiSliders,
    path: '/admin/marquee',
  },
  {
    label: 'Testimonials',
    description: 'Add, edit or remove customer reviews',
    icon: FiMessageSquare,
    path: '/admin/testimonials',
  },
  {
    label: 'Where to Find Us',
    description: 'Update event listings and locations',
    icon: FiMapPin,
    path: '/admin/events',
  },
  {
    label: 'About Section',
    description: 'Edit contact details, description and photos',
    icon: FiInfo,
    path: '/admin/about',
  },
];

const GALLERY_ITEMS = [
  {
    label: 'Manage Products',
    description: 'Add, edit and organise your artworks',
    icon: FiGrid,
    path: '/admin/products',
  },
  {
    label: 'Gallery Layout',
    description: 'Set how many artworks appear per row',
    icon: FiLayout,
    path: '/admin/gallery-layout',
  },
];

const MEDIA_ITEMS = [
  {
    label: 'Image Library',
    description: 'Browse, inspect and delete uploaded images',
    icon: FiFolder,
    path: '/admin/images',
  },
];

function AdminCard({
  label,
  description,
  icon: Icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-white border border-stone-200 rounded-xl px-5 py-4 text-left hover:border-stone-400 hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex-shrink-0 w-11 h-11 rounded-full bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
        <Icon className="w-5 h-5 text-stone-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-stone-800">{label}</p>
        <p className="text-sm text-stone-500 mt-0.5">{description}</p>
      </div>
      <FiChevronRight className="flex-shrink-0 w-5 h-5 text-stone-400 group-hover:text-stone-600 transition-colors" />
    </button>
  );
}

export default function AdminPanel() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  if (!isAdmin) return <p className="p-4">Unauthorized</p>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1">Boukingolts</p>
          <h1 className="text-3xl font-serif text-stone-800">Admin Dashboard</h1>
          <div className="mt-3 h-px bg-stone-200" />
        </div>

        {/* Home Page section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Home Page</h2>
          <div className="space-y-3">
            {HOME_ITEMS.map((item) => (
              <AdminCard
                key={item.path}
                label={item.label}
                description={item.description}
                icon={item.icon}
                onClick={() => router.push(item.path)}
              />
            ))}
          </div>
        </section>

        {/* Gallery section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Gallery</h2>
          <div className="space-y-3">
            {GALLERY_ITEMS.map((item) => (
              <AdminCard
                key={item.path}
                label={item.label}
                description={item.description}
                icon={item.icon}
                onClick={() => router.push(item.path)}
              />
            ))}
          </div>
        </section>

        {/* Media section */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Media</h2>
          <div className="space-y-3">
            {MEDIA_ITEMS.map((item) => (
              <AdminCard
                key={item.path}
                label={item.label}
                description={item.description}
                icon={item.icon}
                onClick={() => router.push(item.path)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
