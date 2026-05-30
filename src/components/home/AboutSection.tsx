'use client';
import Image from 'next/image';
import { IMAGE_URL } from '@/config/config';
import { LocationIcon, CallIcon, EmailIcon, WhatsappIcon, InstagramIcon } from '@/components/icons';
import { AboutContent } from '@/types/HomeContent';

interface Props {
  content: AboutContent;
}

export default function AboutSection({ content }: Props) {
  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
        {content.images?.[0] && (
          <div className="flex-shrink-0">
            <Image
              src={`${IMAGE_URL}/${content.images[0].thumbnail}`}
              alt={content.name}
              width={256}
              height={256}
              className="rounded-full object-cover w-36 h-36 md:w-52 md:h-52 shadow-sm"
            />
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl font-serif text-stone-900">{content.name}</h2>
            {content.address && (
              <p className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-stone-400 mt-2">
                <LocationIcon className="w-4 h-4 flex-shrink-0" />
                {content.address}
              </p>
            )}
          </div>

          {content.comment && (
            <div
              className="prose prose-sm prose-stone max-w-none text-stone-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.comment.replace(/&nbsp;/g, ' ') }}
            />
          )}

          <div className="flex justify-center md:justify-start gap-5 pt-1">
            {content.phone && (
              <a href={`tel:${content.phone}`} className="text-stone-400 hover:text-stone-700 transition-colors" title="Call">
                <CallIcon className="w-5 h-5" />
              </a>
            )}
            {content.whatsapp && (
              <a href={`https://wa.me/${content.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-700 transition-colors" title="WhatsApp">
                <WhatsappIcon className="w-5 h-5" />
              </a>
            )}
            {content.instagram && (
              <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-700 transition-colors" title="Instagram">
                <InstagramIcon className="w-5 h-5" />
              </a>
            )}
            {content.email && (
              <a href={`mailto:${content.email}`} className="text-stone-400 hover:text-stone-700 transition-colors" title="Email">
                <EmailIcon className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
