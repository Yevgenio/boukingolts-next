'use client';
import { AboutContent } from '@/types/HomeContent';

interface Props {
  contact: AboutContent | null;
}

export default function ContactSection({ contact }: Props) {
  if (!contact) return null;
  return (
    <section className="bg-black text-white w-full py-12 text-center">
      <h2 className="text-2xl mb-4">Ready to order flowers?</h2>
      <p className="mb-6">Send us a WhatsApp or give us a call — we&apos;ll be happy to help!</p>
      <div className="flex gap-4 justify-center">
        <a
          href={`https://wa.me/${contact.whatsapp}`}
          target="_blank"
          className="bg-green-600 text-white px-6 py-3 rounded-full"
        >
          WhatsApp Us
        </a>
        <a href={`tel:${contact.phone}`} className="bg-white text-black px-6 py-3 rounded-full">
          Call Us
        </a>
      </div>
    </section>
  );
}