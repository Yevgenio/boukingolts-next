'use client';
import { TestimonialsContent } from '@/types/HomeContent';

interface Props {
  content: TestimonialsContent;
}

export default function Testimonials({ content }: Props) {
  return (
    <section className="bg-gray-100 w-full py-12">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-semibold mb-6">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.testimonials.map((t: { comment: string; author: string }, i: number) => (
            <blockquote key={i} className="bg-white p-6 rounded shadow">
              {t.comment}
              <div className="italic mt-2">- {t.author}</div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}