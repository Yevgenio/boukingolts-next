import EventPage from '@/components/events/EventPage';

export default function Page({ params }: { params: { id: string } }) {
  return <EventPage params={params} />;
}