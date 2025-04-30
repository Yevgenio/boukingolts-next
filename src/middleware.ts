// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  // If no access_token cookie, redirect to login
  if (!accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const { pathname } = request.nextUrl;

  // If trying to access /admin but not an admin, redirect to home
  if (adminPaths.some((path) => pathname.startsWith(path)) && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

//   try {
//     const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
//     // You could even check payload roles here (like admin/user)
//   } catch (err) {
//     // Token invalid
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

  // Otherwise, allow the user to continue
  return NextResponse.next();
}

// Tell Next.js which paths to protect
export const config = {
  matcher: [
    //'/home/:path*', // protect /home and all subpaths
    // '/dashboard/:path*',
    // '/profile/:path*', // protect /profile and all subpaths
    '/settings/:path*', // protect /settings and all subpaths
  ],
};

// List of paths that only admins can access
const adminPaths = ['/admin', '/admin/:path*'];
