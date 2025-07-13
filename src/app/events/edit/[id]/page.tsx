import EventForm from '@/components/events/EventForm';

export default function EditEventPage({ params }: { params: { id: string } }) {
  return <EventForm mode="edit" eventId={params.id} />;
}