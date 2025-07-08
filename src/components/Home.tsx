'use client';

import ProductMarquee from '@/components/home/ProductMarquee';
// import Link from 'next/link';
import { useEffect, useState } from 'react';
import API_URL from '@/config/config';
import { Product } from '@/types/Product';
import TileParagraph from '@/components/tiles/TileParagraph';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${API_URL}/api/products/search?sort=recent&limit=10`, { cache: 'no-store' });
      const data = await res.json();
      setProducts(data.data);
    };
    fetchProducts();
  }, []);

  return (
    <main className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section
        className="relative w-full h-[40vh] bg-cover bg-center text-white"
        style={{ backgroundImage: "url('/img1.jpg')" }}
      >
        {/* Orange overlay tint */}
        <div className="absolute inset-0 bg-slate-800/70 z-0"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Boukingolts Flowers
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Discover our curated selection of fresh-cut flowers and unique floral designs.
              Whether you&apos;re celebrating something special or just want to brighten your day,
              we&apos;re here to help — with delivery and market pickup available.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`/gallery`}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 border-2 text-sm font-semibold"
              >
                Explore Shop
              </a>
              <a
                href={`/gallery`}
                className="bg-transparent hover:bg-white hover:text-black border-2 px-6 py-3 text-sm font-semibold"
              >
                Future Events
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Product Marquee */}
      <section className="w-full">
        <ProductMarquee products={products} />
      </section>

      {/* Event Highlights */}
      <section className="w-full max-w-5xl px-4 py-12 text-center">
        <h2 className="text-3xl font-semibold mb-4">Where to Find Us</h2>
        <p className="text-lg mb-4">We sell flowers at Carmel Market every Friday and pop-up events across Tel Aviv. Reach out to book us for your event!</p>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 w-full py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-6">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <blockquote className="bg-white p-6 rounded shadow">“Stunning flowers and amazing service!”</blockquote>
            <blockquote className="bg-white p-6 rounded shadow">“Always fresh and beautifully arranged.”</blockquote>
            <blockquote className="bg-white p-6 rounded shadow">“They made our wedding day perfect!”</blockquote>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full max-w-5xl px-4 py-12 flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold mb-4">About Boukingolts</h2>
        <div className="w-full flex flex-col items-center">
          <TileParagraph />
          {/* <p className="text-lg">Founded from a love of nature and community, Boukingolts brings floral joy to people all over Tel Aviv. From hand-picked bouquets to custom arrangements, we&apos;re here to make every day beautiful.</p> */}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-black text-white w-full py-12 text-center">
        <h2 className="text-2xl mb-4">Ready to order flowers?</h2>
        <p className="mb-6">Send us a WhatsApp or give us a call — we&apos;ll be happy to help!</p>
        <div className="flex gap-4 justify-center">
          <a href="https://wa.me/972547932924" target="_blank" className="bg-green-600 text-white px-6 py-3 rounded-full">WhatsApp Us</a>
          <a href="tel:+972547932924" className="bg-white text-black px-6 py-3 rounded-full">Call Us</a>
        </div>
      </section>
    </main>
  );
}
