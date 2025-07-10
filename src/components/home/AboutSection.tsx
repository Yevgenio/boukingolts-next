'use client';
import Image from 'next/image';
import API_URL from '@/config/config';
import { AboutContent } from '@/types/HomeContent';

interface Props {
  content: AboutContent;
}

export default function AboutSection({ content }: Props) {
  return (
    <section className="w-full max-w-5xl px-4 py-12 flex flex-col items-center text-center">
      <h2 className="text-3xl font-semibold mb-4">About Boukingolts</h2>
      <div className="w-full flex flex-col items-center space-y-4">
        {content.images?.[0] && (
          <Image src={`${API_URL}/api/uploads/${content.images[0].thumbnail}`}
            alt={content.name}
            width={300}
            height={200}
            className="rounded" />
        )}
        <p>{content.comment}</p>
        <div className="space-y-1">
          <p>{content.name}</p>
          <p>{content.address}</p>
          <p>{content.email}</p>
          <p>{content.instagram}</p>
        </div>
      </div>
    </section>
  );
}