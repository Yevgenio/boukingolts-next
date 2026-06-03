import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  let artist = 'all';
  if (host.startsWith('elena.')) artist = 'elena';
  else if (host.startsWith('alexey.')) artist = 'alexey';
  else if (host.startsWith('archive.')) artist = 'archive';

  // Archive is admin-only: verify JWT and check role === 'admin'
  if (artist === 'archive') {
    const token = request.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') throw new Error('not admin');
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /settings — require login
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;

  if (protectedPaths.some(p => pathname.startsWith(p)) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Protect /admin — require admin role
  if (adminPaths.some(p => pathname.startsWith(p)) && userRole !== 'admin') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Forward x-artist header to all server components
  const headers = new Headers(request.headers);
  headers.set('x-artist', artist);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};

const protectedPaths = ['/settings'];
const adminPaths = ['/admin'];
