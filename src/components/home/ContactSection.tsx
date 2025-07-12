'use client';
import { AboutContent } from '@/types/HomeContent';
import { LocationIcon, CallIcon, EmailIcon, WhatsappIcon, InstagramIcon } from '@/components/icons';

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
          <div className='flex'>
            <WhatsappIcon className="w-6 h-6" />
            <h3 className='pl-3'>WhatsApp Us</h3>
          </div>
        </a>
        <a href={`tel:${contact.phone}`} className="bg-white text-black px-6 py-3 rounded-full">
          <div className='flex'>
            <CallIcon className="w-6 h-6" />
            <h3 className='pl-3'>Call Us</h3>
          </div>
        </a>
      </div>
    </section>
  );
}