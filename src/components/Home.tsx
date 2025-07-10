'use client';

import ProductMarquee from '@/components/home/ProductMarquee';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import HeroSection from '@/components/home/HeroSection';
import Testimonials from '@/components/home/Testimonials';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import { HeroContent, TestimonialsContent, AboutContent } from '@/types/HomeContent';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [testimonials, setTestimonials] = useState<TestimonialsContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${API_URL}/api/products/search?sort=recent&limit=10`, { cache: 'no-store' });
      const data = await res.json();
      setProducts(data.data);
    };
    fetchProducts();

    fetch(`${API_URL}/api/content/home-hero`).then(res => res.json()).then(setHero).catch(() => {});
    fetch(`${API_URL}/api/content/home-testimonials`).then(res => res.json()).then(setTestimonials).catch(() => {});
    fetch(`${API_URL}/api/content/about-boukingolts`).then(res => res.json()).then(setAbout).catch(() => {});
  }, []);

  const sections: { order: number; element: JSX.Element }[] = [];
  if (hero && hero.enabled) sections.push({ order: hero.order, element: <HeroSection content={hero} /> });
  if (testimonials && testimonials.enabled) sections.push({ order: testimonials.order, element: <Testimonials content={testimonials} /> });
  if (about && about.enabled) sections.push({ order: about.order, element: <AboutSection content={about} /> });

  sections.sort((a, b) => b.order - a.order);

  return (
    <main className="flex flex-col items-center w-full">
      {sections.map((s, i) => (
        <div key={i} className="w-full">
          {s.element}
        </div>
      ))}

        {/* Product Marquee */}
        <section className="w-full">
          <ProductMarquee products={products} />
        </section>

        {/* Event Highlights */}
        <section className="w-full max-w-5xl px-4 py-12 text-center">
          <h2 className="text-3xl font-semibold mb-4">Where to Find Us</h2>
          <p className="text-lg mb-4">We sell flowers at Carmel Market every Friday and pop-up events across Tel Aviv. Reach out to book us for your event!</p>
        </section>

        <ContactSection contact={about} />
      </main>
    );
  }