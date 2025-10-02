"use client";

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BackIcon } from '@/components/icons';

interface Props {
  title?: string;
}

export default function PageHeader({ title }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = ['home', ...segments.filter((s) => s !== 'home')];

  const format = (seg: string) => seg.charAt(0).toUpperCase() + seg.slice(1);

  const pathForIndex = (i: number) => {
    if (i === 0) return '/home';
    const joined = breadcrumbs.slice(1, i + 1).join('/');
    return `/${joined}`;
  };

  const pageTitle = title || format(breadcrumbs[breadcrumbs.length - 1]);

  return (
    <div className="mb-4">
      <nav className="text-sm text-gray-600 mb-1">
        {breadcrumbs.map((seg, idx) => (
          <span key={idx}>
            {idx > 0 && ' > '}
            <Link href={pathForIndex(idx)} className="hover:underline">
              {format(seg)}
            </Link>
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} aria-label="Go back">
          <BackIcon className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">{pageTitle}</h1>
      </div>
    </div>
  );
}