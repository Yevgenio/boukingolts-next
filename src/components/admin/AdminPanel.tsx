'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  FiImage,
  FiSliders,
  FiMessageSquare,
  FiInfo,
  FiGrid,
  FiChevronRight,
  FiFolder,
  FiLayout,
} from 'react-icons/fi';

const HOME_ITEMS = [
  {
    label: 'Главный баннер',
    description: 'Редактировать заголовок, текст и изображения баннера',
    icon: FiImage,
    path: '/admin/hero',
  },
  {
    label: 'Разделы главной страницы',
    description: 'Управление бегущей строкой и предстоящими событиями',
    icon: FiSliders,
    path: '/admin/marquee',
  },
  {
    label: 'Отзывы',
    description: 'Добавить, редактировать или удалить отзывы',
    icon: FiMessageSquare,
    path: '/admin/testimonials',
  },
  {
    label: 'Раздел «О нас»',
    description: 'Редактировать контакты, описание и фотографии',
    icon: FiInfo,
    path: '/admin/about',
  },
];

const GALLERY_ITEMS = [
  {
    label: 'Управление работами',
    description: 'Добавлять, редактировать и упорядочивать работы',
    icon: FiGrid,
    path: '/admin/products',
  },
  {
    label: 'Макет галереи',
    description: 'Настроить расположение работ в строках',
    icon: FiLayout,
    path: '/admin/gallery-layout',
  },
];

const MEDIA_ITEMS = [
  {
    label: 'Библиотека изображений',
    description: 'Просматривать, изучать и удалять загруженные изображения',
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

  if (!isAdmin) return <p className="p-4">Доступ запрещён</p>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-1">Boukingolts</p>
          <h1 className="text-3xl font-serif text-stone-800">Панель администратора</h1>
          <div className="mt-3 h-px bg-stone-200" />
        </div>

        {/* Home Page section */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Главная страница</h2>
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
          <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Галерея</h2>
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
          <h2 className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">Медиа</h2>
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
