import EventForm from '@/components/events/EventForm';

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventForm mode="edit" eventId={id} />;
}
