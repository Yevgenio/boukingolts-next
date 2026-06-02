'use client';
import { createContext, useContext } from 'react';

export type Artist = 'elena' | 'alexey' | 'archive' | 'all';

const ArtistContext = createContext<Artist>('all');

export function ArtistProvider({ children, initialArtist }: { children: React.ReactNode; initialArtist: Artist }) {
  return <ArtistContext.Provider value={initialArtist}>{children}</ArtistContext.Provider>;
}

export function useArtist(): Artist {
  return useContext(ArtistContext);
}

export function artistParam(artist: Artist): string {
  return artist !== 'all' ? `?artist=${artist}` : '';
}

export function artistQs(artist: Artist, existing?: Record<string, string>): string {
  const params = new URLSearchParams(existing);
  if (artist !== 'all') params.set('artist', artist);
  const s = params.toString();
  return s ? `?${s}` : '';
}
