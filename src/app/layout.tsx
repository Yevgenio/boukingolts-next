// /app/layout.tsx
import Header from '@/components/Header';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Boukingolts</title>
        {/* <link rel="icon" type="image/x-icon" href="/favicon.ico" /> */}
      </head>
      <body>
        
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
