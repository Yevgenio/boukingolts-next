'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Event } from '@/types/Event';
import { resolveImageUrl } from '@/config/config';

export default function UpcomingEvents({ events }: { events: Event[] }) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (hover || events.length < 2) return;
    const id = setTimeout(() => setActive(a => (a + 1) % events.length), 5000);
    return () => clearTimeout(id);
  }, [active, hover, events.length]);

  if (!events.length) return null;

  const sectionHeader = (
    <div className="text-center mb-8 px-6">
      <h2 className="text-3xl font-serif text-stone-800">Upcoming Events</h2>
      <div className="h-px bg-stone-200 mt-4 max-w-[80px] mx-auto" />
    </div>
  );

  const viewAllLink = events.length > 5 && (
    <div className="max-w-7xl mx-auto px-6 mt-4 text-right">
      <Link href="/events" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
        View all events →
      </Link>
    </div>
  );

  if (isMobile) {
    return (
      <section className="w-full bg-stone-50 py-14">
        {sectionHeader}
        <div className="flex flex-col gap-1.5 px-6 max-w-7xl mx-auto">
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
                onClick={e => { if (!isActive) { e.preventDefault(); setActive(idx); } }}
                className={`relative overflow-hidden rounded-xl transition-all duration-500 block ${
                  isActive ? 'h-48' : 'h-16'
                }`}
              >
                {bg ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                    style={{ backgroundImage: `url(${bg})` }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-stone-300" />
                )}
                <div className="absolute inset-0 bg-stone-900/55" />

                {/* collapsed: date chip + title row */}
                <div className={`absolute inset-0 flex items-center px-4 gap-3 transition-opacity duration-300 ${
                  isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                  <div className="flex-shrink-0 w-9 text-center">
                    <div className="text-white font-serif text-lg leading-none">{day}</div>
                    <div className="text-stone-300 text-[9px] tracking-widest">{month}</div>
                  </div>
                  <div className="w-px h-6 bg-white/20 flex-shrink-0" />
                  <h3 className="font-serif text-white text-base truncate">{event.name}</h3>
                </div>

                {/* expanded: full content */}
                <div className={`absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <p className="text-stone-300 text-xs tracking-widest mb-1">{day} {month}</p>
                  <div className="flex items-end justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-white text-xl leading-snug line-clamp-2">{event.name}</h3>
                      {event.location && (
                        <p className="text-stone-300 text-sm mt-1 truncate">{event.location}</p>
                      )}
                      {event.description && (
                        <p
                          className="text-stone-300/70 text-xs leading-relaxed mt-1.5 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: event.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ') }}
                        />
                      )}
                    </div>
                    <span className="text-white/60 text-xl flex-shrink-0">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {viewAllLink}
      </section>
    );
  }

  return (
    <section className="w-full bg-stone-50 py-14">
      {sectionHeader}
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
              {bg ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
                  style={{ backgroundImage: `url(${bg})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-stone-300" />
              )}
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
                    <h3 className="font-serif text-white text-xl leading-snug line-clamp-2">{event.name}</h3>
                    {event.location && (
                      <p className="text-stone-300 text-sm mt-1">{event.location}</p>
                    )}
                  </div>
                  {event.description && (
                    <p
                      className="text-stone-400 text-sm leading-relaxed line-clamp-3 max-w-xs text-right"
                      dangerouslySetInnerHTML={{ __html: event.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ') }}
                    />
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {viewAllLink}
    </section>
  );
}
