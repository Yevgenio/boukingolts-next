'use client';
import Image from 'next/image';
import Link from 'next/link';
import API_URL from '@/config/config';
import { Event } from '@/types/Event';
import EventItemAdminControls from './EventItemAdminControls';

export default function EventCard({ event }: { event: Event }) {
  return (
    <div className="relative flex flex-col md:flex-row border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
      <div className="flex-1 p-4 flex flex-col gap-2">
        <EventItemAdminControls eventId={event._id} />
        <h2 className="text-xl font-semibold">
          <Link href={`/events/${event._id}`}>{event.name}</Link>
        </h2>
        <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
        {event.location && <p className="text-sm text-gray-600 flex items-center gap-1">{event.location}</p>}
        {event.description && (
          <p
            className="text-sm overflow-hidden"
            style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}
      </div>
      {event.images && event.images[0] && (
        <Image
          src={`${API_URL}/api/uploads/${event.images[0].thumbnail || event.images[0].url}`}
          alt={event.name}
          width={event.images[0].width || 300}
          height={event.images[0].height || 300}
          className="w-full md:w-64 h-48 md:h-auto object-cover"
        />
      )}
    </div>
  );
}