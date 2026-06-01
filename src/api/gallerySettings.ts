import API_URL from '@/config/config';

export interface GallerySettings {
  targetHeight: number;
  variance: number;
}

const DEFAULTS: GallerySettings = { targetHeight: 280, variance: 100 };

export async function getGallerySettings(): Promise<GallerySettings> {
  try {
    const res = await fetch(`${API_URL}/content/gallery-settings`, { cache: 'no-store' });
    if (!res.ok) return DEFAULTS;
    const data = await res.json();
    return {
      targetHeight: typeof data.targetHeight === 'number' ? data.targetHeight : DEFAULTS.targetHeight,
      variance:     typeof data.variance     === 'number' ? data.variance     : DEFAULTS.variance,
    };
  } catch {
    return DEFAULTS;
  }
}

export async function setGallerySettings(s: GallerySettings): Promise<void> {
  await fetch(`${API_URL}/content/gallery-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(s),
  });
}
