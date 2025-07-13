'use client';
import { useEffect, useState, useCallback } from 'react';
import API_URL from '@/config/config';
import { Event } from '@/types/Event';
import EventCard from './EventCard';
import EventsAdminControls from './EventsAdminControls';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/api/events/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchEvents = useCallback(async () => {
    const url = new URL(`${API_URL}/api/events/search`);
    if (query) url.searchParams.set('query', query);
    if (selectedCategory) url.searchParams.set('category', selectedCategory);
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const result = await res.json();
    const sorted = (result.data as Event[]).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEvents(sorted);
  }, [query, selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [query, selectedCategory]);

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-4xl font-bold">Upcoming Events</h1>
        <EventsAdminControls />
      </div>

      <input
        type="text"
        placeholder="Search events..."
        className="w-full border px-4 py-2 mb-4 rounded"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1 rounded border ${selectedCategory === '' ? 'bg-black text-white' : ''}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded border ${selectedCategory === cat ? 'bg-black text-white' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}