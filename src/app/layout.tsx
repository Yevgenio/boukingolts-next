import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ArtistProvider, type Artist } from '@/context/ArtistContext';

const ARTIST_NAMES: Record<string, string> = {
  elena: 'Elena Boukingolts',
  alexey: 'Alexey Boukingolts',
  archive: 'Boukingolts Archive',
  all: 'Boukingolts',
};

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const artist = (h.get('x-artist') || 'all') as Artist;
  const name = ARTIST_NAMES[artist] ?? 'Boukingolts';

  return {
    title: { template: `%s | ${name}`, default: name },
    description: `Original artwork by ${name} — paintings, sculptures, and mixed media.`,
    openGraph: { siteName: name, type: 'website' },
    ...(artist === 'archive' && { robots: { index: false, follow: false } }),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const artist = (h.get('x-artist') || 'all') as Artist;

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <ArtistProvider initialArtist={artist}>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
          </AuthProvider>
        </ArtistProvider>
        <Footer />
      </body>
    </html>
  );
}
