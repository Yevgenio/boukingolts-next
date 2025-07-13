'use client';
import { useEffect, useState } from 'react';
import { Event } from '@/types/Event';
import EventCard from '@/components/events/EventCard';
import { getUpcomingEvents } from '@/api/events';

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

  return (
    <div
      className="flex w-full h-56 md:h-64 overflow-hidden gap-2"
      onMouseLeave={() => setHover(false)}
    >
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
          <EventCard event={event} />
        </div>
      ))}
    </div>
  );
}