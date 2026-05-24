'use client';
import { AboutContent } from '@/types/HomeContent';
import { CallIcon, WhatsappIcon } from '@/components/icons';

interface Props {
  contact: AboutContent | null;
}

export default function ContactSection({ contact }: Props) {
  if (!contact) return null;
  return (
    <section className="bg-stone-900 text-white w-full py-16 text-center">
      <div className="max-w-xl mx-auto px-6">
        <h2 className="text-3xl font-serif font-light mb-3">Ready to order?</h2>
        <p className="text-stone-400 text-sm mb-10 leading-relaxed">
          Send us a WhatsApp or give us a call — we&apos;ll be happy to help.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {contact.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp}`}
              target="_blank"
              className="flex items-center gap-2.5 bg-white text-stone-900 px-7 py-3 text-sm font-medium hover:bg-stone-100 transition-colors"
            >
              <WhatsappIcon className="w-5 h-5" />
              WhatsApp Us
            </a>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-2.5 border border-white text-white px-7 py-3 text-sm font-medium hover:bg-white hover:text-stone-900 transition-colors"
            >
              <CallIcon className="w-5 h-5" />
              Call Us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
