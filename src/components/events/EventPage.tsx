import Image from 'next/image';
import Link from 'next/link';
import API_URL, { IMAGE_URL } from '@/config/config';
import EventPageAdminControls from './EventPageAdminControls';
import { Event } from '@/types/Event';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_URL}/api/events/id/${params.id}`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-stone-400 italic text-lg">Event not found.</p>
        <Link href="/events" className="text-sm text-stone-500 hover:text-stone-700 underline mt-4 inline-block">
          ← Back to events
        </Link>
      </div>
    );
  }

  const event: Event = await res.json();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <Link href="/events" className="text-sm text-stone-400 hover:text-stone-600 hover:underline mb-8 block">
        ← Events
      </Link>

      {event.images?.[0] && (
        <div className="w-full aspect-[16/7] rounded-xl overflow-hidden relative bg-stone-100 shadow-sm mb-8">
          <Image
            src={`${IMAGE_URL}/${event.images[0].url}`}
            alt={event.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="max-w-2xl">
        <h1 className="text-4xl font-serif text-stone-900 leading-tight mb-3">{event.name}</h1>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-500 mb-2">
          <span>{formatDate(event.date)}</span>
          {event.location && <span>{event.location}</span>}
        </div>

        <EventPageAdminControls eventId={params.id} />

        <div className="h-px bg-stone-200 my-6" />

        {event.description && (
          <div
            className="prose prose-stone max-w-none text-stone-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: event.description.replace(/&nbsp;/g, ' ') }}
          />
        )}
      </div>
    </div>
  );
}
