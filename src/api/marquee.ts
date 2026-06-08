import API_URL from '@/config/config';

function qs(artist?: string) {
  return artist && artist !== 'all' ? `?artist=${artist}` : '';
}

export async function getMarqueeProducts(artist?: string) {
  const res = await fetch(`${API_URL}/products/marquee${qs(artist)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch marquee products');
  return res.json();
}

export async function getMarqueeProductIds(artist?: string) {
  const res = await fetch(`${API_URL}/products/marquee/ids${qs(artist)}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch marquee ids');
  return res.json();
}

export async function updateMarqueeProductIds(ids: string[], artist?: string) {
  const res = await fetch(`${API_URL}/products/marquee/ids${qs(artist)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(ids),
  });
  if (!res.ok) throw new Error('Failed to update marquee ids');
}