// /src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-5xl font-bold mb-6">404 - Page Not Found</h1>
      <p className="text-lg mb-8">Sorry, we couldn't find the page you were looking for.</p>
      <Link href="/home" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
