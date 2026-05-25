import API_URL from '@/config/config';
import { AboutContent } from '@/types/HomeContent';
import { CallIcon, WhatsappIcon, InstagramIcon, EmailIcon, LocationIcon } from '@/components/icons';
import Link from 'next/link';

async function getAbout(): Promise<AboutContent | null> {
  try {
    const res = await fetch(`${API_URL}/api/content/about-boukingolts`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function Footer() {
  const about = await getAbout();

  return (
    <footer className="bg-stone-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Brand */}
          <div>
            <Link href="/home" className="font-serif text-2xl text-white hover:text-stone-300 transition-colors">
              Boukingolts
            </Link>
            {about?.address && (
              <p className="flex items-center gap-1.5 text-stone-400 text-sm mt-3">
                <LocationIcon className="w-4 h-4 flex-shrink-0" />
                {about.address}
              </p>
            )}
          </div>

          {/* Nav + Contact */}
          <div className="flex gap-12 flex-wrap">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Explore</h3>
              <div className="space-y-3">
                <Link href="/home" className="block text-sm text-stone-400 hover:text-white transition-colors">Home</Link>
                <Link href="/gallery" className="block text-sm text-stone-400 hover:text-white transition-colors">Gallery</Link>
                <Link href="/events" className="block text-sm text-stone-400 hover:text-white transition-colors">Events</Link>
              </div>
            </div>

            {about && (
              <div>
                <h3 className="text-xs uppercase tracking-widest text-stone-500 mb-4">Contact</h3>
                <div className="flex gap-4">
                  {about.phone && (
                    <a href={`tel:${about.phone}`} className="text-stone-400 hover:text-white transition-colors" title="Call">
                      <CallIcon className="w-5 h-5" />
                    </a>
                  )}
                  {about.whatsapp && (
                    <a href={`https://wa.me/${about.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors" title="WhatsApp">
                      <WhatsappIcon className="w-5 h-5" />
                    </a>
                  )}
                  {about.instagram && (
                    <a href={about.instagram} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-white transition-colors" title="Instagram">
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                  )}
                  {about.email && (
                    <a href={`mailto:${about.email}`} className="text-stone-400 hover:text-white transition-colors" title="Email">
                      <EmailIcon className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 text-xs text-stone-600 text-center">
          © {new Date().getFullYear()} Boukingolts
        </div>
      </div>
    </footer>
  );
}
