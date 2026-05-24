import API_URL from '@/config/config';

export interface ManagedImage {
  _id: string;
  url: string;
  thumbnail: string;
  width?: number;
  height?: number;
  createdAt: string;
  size?: number;
  usedIn: Array<{ type: 'product' | 'event' | 'content'; name: string; id: string }>;
}

export async function listImages(): Promise<ManagedImage[]> {
  const res = await fetch(`${API_URL}/api/images`, { credentials: 'include', cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch images');
  return res.json();
}

export async function deleteImage(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/images/id/${id}`, { method: 'DELETE', credentials: 'include' });
  if (!res.ok) throw new Error('Failed to delete image');
}
