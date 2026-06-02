import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import API_URL from '@/config/config';
import HeroSection from '@/components/home/HeroSection';
import Testimonials from '@/components/home/Testimonials';
import AboutSection from '@/components/home/AboutSection';
import ProductMarquee from '@/components/home/ProductMarquee';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import { HeroContent, TestimonialsContent, AboutContent, MarqueeContent, EventsContent } from '@/types/HomeContent';
import { Product } from '@/types/Product';
import { Event } from '@/types/Event';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome — original paintings, sculptures, and mixed media artwork.',
  openGraph: { title: 'Home', description: 'Original artwork — paintings, sculptures, and mixed media.' },
};

async function fetchJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    return res.ok ? res.json() : fallback;
  } catch {
    return fallback;
  }
}

export default async function Page() {
  const h = await headers();
  const artist = h.get('x-artist') || 'all';
  // For combined apex, home page content falls back to 'alexey'
  const contentArtist = artist === 'all' ? 'alexey' : artist;
  const qs = `?artist=${contentArtist}`;

  const [hero, testimonials, about, marqueeSettings, eventsContent, marqueeProducts, eventsResult] =
    await Promise.all([
      fetchJson<HeroContent | null>(`${API_URL}/content/home-hero${qs}`, null),
      fetchJson<TestimonialsContent | null>(`${API_URL}/content/home-testimonials${qs}`, null),
      fetchJson<AboutContent | null>(`${API_URL}/content/about-boukingolts${qs}`, null),
      fetchJson<MarqueeContent | null>(`${API_URL}/content/home-product-marquee${qs}`, null),
      fetchJson<EventsContent | null>(`${API_URL}/content/home-events${qs}`, null),
      fetchJson<Product[]>(`${API_URL}/products/marquee${qs}`, []),
      fetchJson<{ data: Event[] }>(`${API_URL}/events/search${qs}`, { data: [] }),
    ]);

  const upcomingEvents = (eventsResult.data ?? [])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const sections: { order: number; element: ReactNode }[] = [];
  if (hero?.enabled)
    sections.push({ order: hero.order, element: <HeroSection content={hero} /> });
  if (testimonials?.enabled)
    sections.push({ order: testimonials.order, element: <Testimonials content={testimonials} /> });
  if (marqueeSettings?.enabled)
    sections.push({ order: marqueeSettings.order, element: <ProductMarquee products={marqueeProducts} /> });
  if (eventsContent?.enabled)
    sections.push({ order: eventsContent.order, element: <UpcomingEvents events={upcomingEvents} /> });
  if (about?.enabled)
    sections.push({ order: about.order, element: <AboutSection content={about} /> });
  sections.sort((a, b) => a.order - b.order);

  return (
    <main className="flex flex-col items-center w-full">
      {sections.map((s, i) => (
        <div key={i} className="w-full">{s.element}</div>
      ))}
    </main>
  );
}
