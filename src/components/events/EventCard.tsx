'use client';
import Link from 'next/link';
import API_URL, { resolveImageUrl } from '@/config/config';
import { Event } from '@/types/Event';
import EventItemAdminControls from './EventItemAdminControls';

export default function EventCard({ event, className = '' }: { event: Event; className?: string }) {
  const bgImage = event.images?.[0]
    ? resolveImageUrl(event.images[0].thumbnail || event.images[0].url)
    : undefined;

  const d = new Date(event.date);
  const day = d.toLocaleDateString('en-GB', { day: '2-digit' });
  const month = d.toLocaleDateString('en-GB', { month: 'short' }).toUpperCase();
  const year = d.getFullYear();

  return (
    <div className={`relative group ${className}`}>
      <Link href={`/events/${event._id}`} className="block">
        <div className="flex rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 h-44">

          {/* Date column */}
          <div className="flex-shrink-0 w-24 bg-stone-800 text-white flex flex-col items-center justify-center gap-0.5 group-hover:bg-stone-700 transition-colors">
            <span className="text-2xl font-serif font-semibold leading-none">{day}</span>
            <span className="text-xs tracking-widest text-stone-300">{month}</span>
            <span className="text-xs text-stone-500 mt-1">{year}</span>
          </div>

          {/* Content */}
          <div
            className="flex-1 relative overflow-hidden"
            style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {bgImage && <div className="absolute inset-0 bg-stone-900/65" />}
            <div className={`relative z-10 h-full flex flex-col p-5 ${bgImage ? 'text-white' : 'text-stone-800 bg-stone-50'}`}>
              <div className="flex-shrink-0 min-w-0">
                <h2 className="font-serif text-xl leading-snug mb-1 line-clamp-2">{event.name}</h2>
                {event.location && (
                  <p className={`text-sm truncate ${bgImage ? 'text-stone-300' : 'text-stone-500'}`}>{event.location}</p>
                )}
              </div>
              {event.description && (
                <div className="flex-1 min-h-0 overflow-hidden mt-2">
                  <p
                    className={`text-sm leading-relaxed ${bgImage ? 'text-stone-300' : 'text-stone-500'}`}
                    dangerouslySetInnerHTML={{ __html: event.description.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ') }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
      <EventItemAdminControls eventId={event._id} />
    </div>
  );
}
