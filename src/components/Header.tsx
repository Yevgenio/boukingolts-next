'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiMenu, FiX, FiChevronDown, FiUser } from 'react-icons/fi';

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Events', href: '/events' },
];

export default function Header() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const accountRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      setOffset(0);
      return;
    }
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;
      const height = headerRef.current?.offsetHeight ?? 64;
      setOffset(prev => Math.min(0, Math.max(-height, prev - delta)));
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white border-b border-stone-200" style={{ transform: `translateY(${offset}px)` }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">

        {/* Brand */}
        <Link
          href="/home"
          className="font-serif text-2xl text-stone-900 tracking-tight hover:text-stone-600 transition-colors flex-shrink-0"
        >
          Boukingolts
        </Link>

        {/* Desktop nav — centred */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-wide transition-colors ${
                pathname.startsWith(link.href)
                  ? 'text-stone-900 font-medium'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: admin pill + account dropdown */}
        <div className="hidden md:flex items-center gap-5 flex-shrink-0">
          {isAdmin && (
            <Link
              href="/admin"
              className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors"
            >
              Admin
            </Link>
          )}

          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen(p => !p)}
              className={`flex items-center gap-1.5 text-sm transition-colors ${
                accountOpen ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-label="Account menu"
            >
              <FiUser className="w-4 h-4" />
              <FiChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${accountOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-full mt-3 w-44 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/settings"
                      className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      onClick={() => setAccountOpen(false)}
                    >
                      Profile
                    </Link>
                    <div className="h-px bg-stone-100" />
                    <button
                      onClick={() => { setAccountOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      onClick={() => setAccountOpen(false)}
                    >
                      Log in
                    </Link>
                    <div className="h-px bg-stone-100" />
                    <Link
                      href="/signup"
                      className="block px-4 py-3 text-sm text-stone-500 hover:bg-stone-50 transition-colors"
                      onClick={() => setAccountOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-stone-600 hover:text-stone-900 transition-colors"
          onClick={() => setMobileOpen(p => !p)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-3 text-sm border-b border-stone-50 transition-colors ${
                  pathname.startsWith(link.href)
                    ? 'text-stone-900 font-medium'
                    : 'text-stone-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 space-y-1">
              {isLoggedIn ? (
                <>
                  <Link href="/settings" className="block py-3 text-sm text-stone-600">Profile</Link>
                  <button onClick={handleLogout} className="block py-3 text-sm text-stone-600 w-full text-left">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block py-3 text-sm text-stone-600">Log in</Link>
                  <Link href="/signup" className="block py-3 text-sm text-stone-600">Sign up</Link>
                </>
              )}
              {isAdmin && (
                <Link href="/admin" className="block py-3 text-xs uppercase tracking-widest text-stone-400">
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
