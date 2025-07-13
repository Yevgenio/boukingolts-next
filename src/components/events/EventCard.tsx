'use client';
// import Image from 'next/image';
import Link from 'next/link';
import API_URL from '@/config/config';
import { Event } from '@/types/Event';
import EventItemAdminControls from './EventItemAdminControls';

export default function EventCard({
  event,
  className = 'w-full',
}: {
  event: Event;
  className?: string;
}) {

    const bgImage = event.images && event.images[0] ? `${API_URL}/api/uploads/${event.images[0].thumbnail || event.images[0].url}` : undefined;

  return (
    <Link
      href={`/events/${event._id}`}
      className="block focus:outline-none"
      tabIndex={-1}
      aria-label={event.name}
    >
      <div
        className={`relative flex flex-col h-56 md:flex-row border 
          overflow-hidden shadow hover:shadow-lg 
          transition cursor-pointer group ${className}`}
      >

        {/* Date of the Event */}
        <div className="flex flex-col items-center justify-center px-6 bg-white h-full border-l border-dotted border-gray-300 min-w-[100px]">
          <div className="text-3xl font-bold text-gray-800 leading-none">
            {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
          </div>
          <div className="text-lg text-gray-500 mt-1">
            {new Date(event.date).getFullYear()}
          </div>
        </div>

        {/* Image for the Event */}
        {/* {event.images && event.images[0] && (
          <Image
          src={`${API_URL}/api/uploads/${event.images[0].thumbnail || event.images[0].url}`}
          alt={event.name}
          width={event.images[0].width || 300}
          height={event.images[0].height || 300}
          className="w-full md:w-64 h-48 md:h-auto object-cover"
          />
        )} */}
        
        {/* Details about the Event */}
        <div
          className="flex-1 p-4 flex flex-col gap-2 relative text-left text-gray-200"
          style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {/* Overlay for tint */}
          {bgImage && (
            <div className="absolute inset-0 bg-slate-800/60 pointer-events-none" aria-hidden="true"></div>
          )}
          <div className="relative z-10">
            <EventItemAdminControls eventId={event._id} />
            <h2 className="text-xl font-semibold">
              {event.name}
            </h2>
            {/* <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p> */}
            {event.location && (
              <p className="text-sm text-gray-200 flex items-center gap-1">{event.location}</p>
            )}
            {event.description && (
              <p
                className="text-sm overflow-hidden"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                }}
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
          </div>
        </div>
        
        {/* <div className="flex flex-col items-center justify-center px-6 bg-gray-800 h-full border-l border-dotted border-gray-300 min-w-[90px]">
          <div className="text-3xl font-bold text-white leading-none">
            {new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
          </div>
          <div className="text-lg text-gray-400 mt-1">
            {new Date(event.date).getFullYear()}
          </div>
        </div> */}
      
      </div>
    </Link>
  );
}