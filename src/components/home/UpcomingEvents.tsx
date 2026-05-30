'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types/Event';
import { getUpcomingEvents } from '@/api/events';
import API_URL, { resolveImageUrl } from '@/config/config';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    getUpcomingEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (hover || events.length < 2) return;
    const id = setInterval(() => setActive(a => (a + 1) % events.length), 5000);
    return () => clearInterval(id);
  }, [hover, events.length]);

  if (!events.length) return null;

  return (
    <section className="w-full bg-stone-50 py-14">
      <div className="text-center mb-8 px-6">
        <h2 className="text-3xl font-serif text-stone-800">Upcoming Events</h2>
        <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
      </div>

      <div
        className="flex h-80 gap-1.5 px-6 max-w-7xl mx-auto"
        onMouseLeave={() => setHover(false)}
      >
        {events.slice(0, 5).map((event, idx) => {
          const isActive = idx === active;
          const bg = event.images?.[0]
            ? resolveImageUrl(event.images[0].thumbnail || event.images[0].url)
            : undefined;

          const d = new Date(event.date);
          const day = d.toLocaleDateString('en-GB', { day: '2-digit' });
          const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();

          return (
            <Link
              key={event._id}
              href={`/events/${event._id}`}
              className={`relative overflow-hidden rounded-xl transition-all duration-500 ${
                isActive ? 'flex-[5]' : 'flex-[1]'
              }`}
              onMouseEnter={() => { setActive(idx); setHover(true); }}
            >
              {/* background image */}
              {bg ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                  style={{ backgroundImage: `url(${bg})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-stone-300" />
              )}

              {/* overlay */}
              <div className="absolute inset-0 bg-stone-900/50" />

              {/* collapsed: vertical date label */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-1 transition-opacity duration-300 ${
                isActive ? 'opacity-0' : 'opacity-100'
              }`}>
                <span className="text-white font-serif text-lg leading-none">{day}</span>
                <span className="text-stone-300 text-[10px] tracking-widest">{month}</span>
              </div>

              {/* expanded: full content */}
              <div className={`absolute inset-0 flex flex-col justify-end p-5 transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-stone-300 text-xs tracking-widest mb-1">{day} {month}</p>
                    <h3 className="font-serif text-white text-xl leading-snug">{event.name}</h3>
                    {event.location && (
                      <p className="text-stone-300 text-sm mt-1">{event.location}</p>
                    )}
                  </div>
                  {event.description && (
                    <p
                      className="text-stone-400 text-sm leading-relaxed line-clamp-3 max-w-xs text-right hidden lg:block"
                      dangerouslySetInnerHTML={{ __html: event.description.replace(/<[^>]+>/g, '') }}
                    />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {events.length > 5 && (
        <div className="max-w-7xl mx-auto px-6 mt-4 text-right">
          <Link href="/events" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
            View all events →
          </Link>
        </div>
      )}
    </section>
  );
}
