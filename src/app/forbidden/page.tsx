// /src/app/forbidden/page.tsx
import Link from 'next/link';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-5xl font-bold mb-6">403 - Forbidden</h1>
      <p className="text-lg mb-8">You don&apos;t have permission to access this page.</p>
      <Link href="/home" className="text-blue-500 hover:underline">
        Go back to Home
      </Link>
    </div>
  );
}
