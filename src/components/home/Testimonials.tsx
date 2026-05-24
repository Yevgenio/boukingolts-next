'use client';
import { TestimonialsContent } from '@/types/HomeContent';

interface Props {
  content: TestimonialsContent;
}

export default function Testimonials({ content }: Props) {
  const testimonials = content.testimonials ?? [];
  if (!testimonials.length) return null;

  return (
    <section className="bg-stone-50 w-full py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif text-stone-800">What Our Customers Say</h2>
          <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <blockquote key={i} className="bg-white border border-stone-100 rounded-xl p-6 shadow-sm flex flex-col">
              <p className="text-stone-600 text-sm leading-relaxed flex-1">
                &ldquo;{t.comment}&rdquo;
              </p>
              <footer className="mt-5 text-xs text-stone-400 font-medium tracking-wide uppercase">
                — {t.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
