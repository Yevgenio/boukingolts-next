// /src/components/Header.tsx
"use client"; // mark the file as a client component 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check if the access token exists in localStorage after component mounts
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    } else {
      setIsLoggedIn(false); // User is not logged in
    }

    const userRole = document.cookie.split('; ').find(row => row.startsWith('user_role='))?.split('=')[1];
    setRole(userRole || null);
  }, []); // Empty dependency array to run only on mount

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout API failed', err);
    }
    
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
    setIsLoggedIn(false);
    const router = useRouter();
    router.push('/login');
  };

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl">Painter's Gallery</h1>
      <nav className="space-x-4 flex items-center">
        {/* Only for admins */}
        {role === 'admin' && <a href="/admin" className="ml-4 font-bold text-red-500">Admin Panel</a>}
        
        <Link href="/home" className="hover:underline">Home</Link>
        <Link href="/gallery" className="hover:underline">Gallery</Link>

        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          <>
        <Link href="/settings" className="hover:underline">Settings</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
          Logout
        </button>
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
