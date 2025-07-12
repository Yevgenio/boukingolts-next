'use client';
import Image from 'next/image';
import API_URL from '@/config/config';
import { AboutContent } from '@/types/HomeContent';

interface Props {
  content: AboutContent;
}

export default function AboutSection({ content }: Props) {
  return (
    <section className="w-full px-4 py-12 flex justify-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center md:items-start gap-8">
        {content.images?.[0] && (
          <Image
            src={`${API_URL}/api/uploads/${content.images[0].thumbnail}`}
            alt={content.name}
            width={256}
            height={256}
            className="rounded-full object-cover w-40 h-40 md:w-64 md:h-64"
          />
        )}
        <div className="flex flex-col space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-semibold">{content.name}</h2>
          
          <div className="space-y-1">

            <h2>{content.address}</h2>       
            {/* <p>{content.email}</p> */}
            {/* <p>{content.instagram}</p> */}
          </div>
          <p>{content.comment}</p>
          
        </div>
      </div>
    </section>
  );
}