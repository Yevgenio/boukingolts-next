import Image from 'next/image';
import API_URL from '@/config/config';
import EventPageAdminControls from './EventPageAdminControls';
import { Event } from '@/types/Event';

export default async function EventPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API_URL}/api/events/id/${params.id}`, { cache: 'no-store' });
  if (!res.ok) {
    return <div className="p-6 text-center">Event not found</div>;
  }
  const event: Event = await res.json();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <EventPageAdminControls eventId={params.id} />
      <h1 className="text-3xl font-bold">{event.name}</h1>
      <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
      {event.location && <p className="text-gray-600">{event.location}</p>}
      {event.images && event.images[0] && (
        <Image
          src={`${API_URL}/api/uploads/${event.images[0].url}`}
          alt={event.name}
          width={event.images[0].width || 500}
          height={event.images[0].height || 500}
          className="w-full h-auto object-cover rounded"
        />
      )}
      {event.description && (
        <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: event.description }} />
      )}
    </div>
  );
}