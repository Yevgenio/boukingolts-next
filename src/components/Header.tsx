// /src/components/Header.tsx
"use client"; // mark the file as a client component 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import API_URL from '@/config/config';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);    
  
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
        });
  
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          setIsAdmin(data.role === 'admin');
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth check failed", err);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);  

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {             
        method: 'GET',
        credentials: 'include', 
      });
    } catch (err) {
      console.error('Logout API failed', err);
    }
    
    // document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // document.cookie = "user_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <h1 className="text-xl">Painter's Gallery</h1>
      <nav className="space-x-4 flex items-center">
        {/* Only for admins */}
        {/* {isAdmin && <a href="/admin" className="ml-4 font-bold text-red-500">Admin Panel</a>} */}
        
        <Link href="/home" className="hover:underline">Home</Link>
        <Link href="/gallery" className="hover:underline">Gallery</Link>

        {/* Conditional rendering based on login status */}
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
