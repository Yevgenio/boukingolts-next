import API_URL from '@/config/config';
import { Event } from '@/types/Event';

export async function getUpcomingEvents(count = 5): Promise<Event[]> {
  const res = await fetch(`${API_URL}/api/events/search`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch events');
  const result = await res.json();
  const events = (result.data as Event[])
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, count);
  return events;
}