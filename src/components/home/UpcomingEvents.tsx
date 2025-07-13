'use client';
import { useEffect, useState } from 'react';
import { Event } from '@/types/Event';
import EventCard from '@/components/events/EventCard';
import { getUpcomingEvents } from '@/api/events';
import API_URL from '@/config/config';

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    getUpcomingEvents().then(setEvents).catch(() => setEvents([]));
  }, []);

  useEffect(() => {
    if (hover || events.length < 2) return;
    const id = setInterval(() => {
      setActive((a) => (a + 1) % events.length);
    }, 5000);
    return () => clearInterval(id);
  }, [hover, events.length]);

  if (!events.length) return null;

  const bgImage =
    events[active]?.images && events[active].images[0]
      ? `${API_URL}/api/uploads/${
          events[active].images[0].thumbnail || events[active].images[0].url
        }`
      : undefined;

  return (
    <div className="relative w-full h-56 md:h-64" onMouseLeave={() => setHover(false)}>
      {bgImage && (
        <div
          className="absolute inset-0 bg-center bg-cover blur-sm scale-110"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}
      <div className="relative flex w-full max-w-5xl h-full overflow-hidden gap-2 mx-auto justify-center">
        {events.map((event, idx) => (
          <div
        key={event._id}
        className={`overflow-hidden transition-all duration-[600ms] ${
          idx === active ? 'flex-auto basis-full' : 'flex-none basis-[90px]'
        }`}
        onMouseEnter={() => {
          setActive(idx);
          setHover(true);
        }}
          >
        <EventCard event={event} className="w-[700px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
