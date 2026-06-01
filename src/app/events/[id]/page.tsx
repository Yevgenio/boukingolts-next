import type { Metadata } from 'next';
import EventPage from '@/components/events/EventPage';
import API_URL, { resolveImageUrl } from '@/config/config';
import { Event } from '@/types/Event';

type Props = { params: Promise<{ id: string }> };

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/events/id/${id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Event' };
    const event: Event = await res.json();
    const description = event.description
      ? stripHtml(event.description).slice(0, 160)
      : `${event.location ? 'At ' + event.location + ' — ' : ''}Art event by Boukingolts`;
    const imageUrl = event.images?.[0]?.url
      ? resolveImageUrl(event.images[0].url)
      : undefined;
    return {
      title: event.name,
      description,
      openGraph: {
        title: event.name,
        description,
        type: 'article',
        ...(imageUrl && { images: [{ url: imageUrl }] }),
      },
    };
  } catch {
    return { title: 'Event' };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  return <EventPage params={resolvedParams} />;
}
