import type { Metadata } from 'next';
import { headers } from 'next/headers';
import EventsPage from '@/components/events/EventsPage';
import API_URL from '@/config/config';
import { Event } from '@/types/Event';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming exhibitions and art events by Boukingolts.',
  openGraph: {
    title: 'Events | Boukingolts',
    description: 'Upcoming exhibitions and art events by Boukingolts.',
  },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function str(v: string | string[] | undefined): string {
  return typeof v === 'string' ? v : '';
}

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  const artist = (await headers()).get('x-artist');
  if (artist && artist !== 'all') qs.set('artist', artist);
  if (str(params.category)) qs.set('category', str(params.category));
  if (str(params.query)) qs.set('query', str(params.query));

  let initialEvents: Event[] = [];
  try {
    const res = await fetch(`${API_URL}/events/search${qs.size ? `?${qs}` : ''}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      initialEvents = (data.data as Event[]).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }
  } catch { /* render client-only if fetch fails */ }

  return <EventsPage initialEvents={initialEvents} />;
}
