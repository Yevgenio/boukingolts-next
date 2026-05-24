import EventPage from '@/components/events/EventPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <EventPage params={resolvedParams} />;
}
