import API_URL from '@/config/config';

export async function getMarqueeProducts() {
  const res = await fetch(`${API_URL}/api/products/marquee`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch marquee products');
  return res.json();
}

export async function getMarqueeProductIds() {
  const res = await fetch(`${API_URL}/api/products/marquee/ids`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch marquee ids');
  return res.json();
}

export async function updateMarqueeProductIds(ids: string[]) {
  const res = await fetch(`${API_URL}/api/products/marquee/ids`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(ids),
  });
  if (!res.ok) throw new Error('Failed to update marquee ids');
}