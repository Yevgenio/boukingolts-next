import API_URL from '@/config/config';

export async function getGalleryColumns(): Promise<2 | 3 | 4> {
  try {
    const res = await fetch(`${API_URL}/api/content/gallery-settings`, { cache: 'no-store' });
    if (!res.ok) return 3;
    const data = await res.json();
    const col = data.columns;
    if (col === 2 || col === 4) return col;
    return 3;
  } catch {
    return 3;
  }
}

export async function setGalleryColumns(columns: 2 | 3 | 4): Promise<void> {
  await fetch(`${API_URL}/api/content/gallery-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ columns }),
  });
}
