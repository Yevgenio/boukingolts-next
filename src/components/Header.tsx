// /src/components/Header.tsx
"use client"; // mark the file as a client component 

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import API_URL from '@/config/config';

const Header = () => {
  const { isLoggedIn, isAdmin, setAuthState } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      setAuthState({ isLoggedIn: false, isAdmin: false });
      router.push('/login');
    } catch (err) {
      console.error('Logout API failed', err);
    }
  };

  return (
    <header className="p-2 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-3xl"><Link href="/home">Boukingolts</Link></h1>
      <nav className="space-x-4 flex items-center">
        <Link href="/home" className="hover:underline">Home</Link>
        <Link href="/gallery" className="hover:underline">Gallery</Link>
        {isLoggedIn ? (
          <>
            <Link href="/settings" className="hover:underline">Profile</Link>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
            {isAdmin && <Link href="/admin" className="ml-4 font-bold text-red-500">Admin Panel</Link>}
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Signup</Link>
          </>
        )}
        <div className="ml-4">
          <LanguageSwitcher />
        </div>
      </nav>
    </header>
  );
};

export default Header;
