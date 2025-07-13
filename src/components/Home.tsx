'use client';

import ProductMarquee from '@/components/home/ProductMarquee';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import HeroSection from '@/components/home/HeroSection';
import Testimonials from '@/components/home/Testimonials';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import {
  HeroContent,
  TestimonialsContent,
  AboutContent,
  MarqueeContent,
  EventsContent,
} from '@/types/HomeContent';
import { getMarqueeProducts } from '@/api/marquee';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialsContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [marquee, setMarquee] = useState<MarqueeContent | null>(null);
  const [events, setEvents] = useState<EventsContent | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getMarqueeProducts();
        setProducts(data);
      } catch {
        setProducts([]);
      }
    };
    fetchProducts();

    fetch(`${API_URL}/api/content/home-hero`).then(res => res.json()).then(setHero).catch(() => {});
    fetch(`${API_URL}/api/content/home-testimonials`).then(res => res.json()).then(setTestimonials).catch(() => {});
    fetch(`${API_URL}/api/content/about-boukingolts`).then(res => res.json()).then(setAbout).catch(() => {});
    fetch(`${API_URL}/api/content/home-product-marquee`).then(res => res.json()).then(setMarquee).catch(() => {});
    fetch(`${API_URL}/api/content/home-events`).then(res => res.json()).then(setEvents).catch(() => {});
  }, []);

  const sections: { order: number; element: JSX.Element }[] = [];
  if (hero && hero.enabled)
    sections.push({ order: hero.order, element: <HeroSection content={hero} /> });
  if (testimonials && testimonials.enabled)
    sections.push({ order: testimonials.order, element: <Testimonials content={testimonials} /> });
  if (marquee && marquee.enabled)
    sections.push({ order: marquee.order, element: <ProductMarquee products={products} /> });
  if (events && events.enabled)
    sections.push({
      order: events.order,
      element: (
        <section className="w-full px-4 py-12 flex flex-col items-center text-center">
          <div className="w-full flex flex-col items-center space-y-4">
            <h2 className="text-3xl font-semibold mb-4">Upcoming Events</h2>
            <p className="text-lg mb-4">
              {events.text ||
                'Come visit us at our location or join us at one of our events!'}
            </p>
            <UpcomingEvents />
          </div>
        </section>
      ),
    });
  if (about && about.enabled)
    sections.push({ order: about.order, element: <AboutSection content={about} /> });

  sections.sort((a, b) => a.order - b.order);

  return (
    <main className="flex flex-col items-center w-full">
      {sections.map((s, i) => (
        <div key={i} className="w-full">
          {s.element}
        </div>
      ))}

        <ContactSection contact={about} />
      </main>
    );
  }