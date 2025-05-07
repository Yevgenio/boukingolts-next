// /src/components/Header.tsx
"use client"; // mark the file as a client component 

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

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
