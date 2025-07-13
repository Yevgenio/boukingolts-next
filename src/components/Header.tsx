// /src/components/Header.tsx
"use client"; // mark the file as a client component 

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Header = () => {
  // const { isLoggedIn, isAdmin, setAuthState } = useAuth();
  const { logout } = useAuth();
  const { isLoggedIn, isAdmin } = useAuth(); // Assuming you have a way to get auth state
  const router = useRouter();

  const handleLogout = async () => {
    logout(); // Call the logout function from context
    router.push('/login');
  };

  return (
    <header className="p-2 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-3xl"><Link href="/home">Boukingolts</Link></h1>
      <nav className="space-x-4 flex items-center">
        {isAdmin && <Link href="/admin" className="font-bold text-red-500">Admin</Link>}
        <Link href="/home" className="hover:underline">Home</Link>
        {/* <Link href="/grid" className="hover:underline">Grid</Link> */}
        {/* <Link href="/plane" className="hover:underline">Plane</Link> */}
        {/* <Link href="/box" className="hover:underline">Box</Link> */}
        <Link href="/gallery" className="hover:underline">Gallery</Link>
        <Link href="/events" className="hover:underline">Events</Link>
        {isLoggedIn ? (
          <>
            <Link href="/settings" className="hover:underline">Profile</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
