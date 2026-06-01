'use client';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import API_URL from '@/config/config';
import EventCard from './EventCard';
import EventsAdminControls from './EventsAdminControls';
import { Event } from '@/types/Event';

function EventsPageInner({ initialEvents }: { initialEvents?: Event[] }) {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState<Event[]>(initialEvents ?? []);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') ?? '');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') ?? '');
  }, [searchParams]);

  useEffect(() => {
    fetch(`${API_URL}/events/categories`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : []).then(setCategories).catch(() => {});
  }, []);

  const fetchEvents = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (selectedCategory) params.set('category', selectedCategory);
    const qs = params.toString();
    const url = `${API_URL}/events/search${qs ? `?${qs}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    const result = await res.json();
    const sorted = (result.data as Event[]).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sorted);
  }, [query, selectedCategory]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      <div className="flex items-end justify-between mb-2">
        <h1 className="text-4xl font-serif text-stone-800 tracking-tight">Events</h1>
        <EventsAdminControls />
      </div>
      <div className="h-px bg-stone-200 mb-8" />

      <input
        type="text"
        placeholder="Search events…"
        className="w-full border border-stone-300 rounded-lg px-4 py-2.5 mb-5 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200 placeholder:text-stone-400 text-sm"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-1.5 rounded-full text-sm transition-colors ${selectedCategory === '' ? 'bg-stone-800 text-white' : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'}`}
          >
            All
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors max-w-[160px] truncate ${selectedCategory === cat ? 'bg-stone-800 text-white' : 'border border-stone-300 text-stone-600 hover:border-stone-500 hover:text-stone-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {events.length === 0 ? (
        <p className="text-center text-stone-400 italic py-16">No upcoming events.</p>
      ) : (
        <div className="space-y-4">
          {events.map(event => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
}

export default function EventsPage({ initialEvents }: { initialEvents?: Event[] }) {
  return (
    <Suspense>
      <EventsPageInner initialEvents={initialEvents} />
    </Suspense>
  );
}
