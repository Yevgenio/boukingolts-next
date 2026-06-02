import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  let artist = 'all';
  if (host.startsWith('elena.')) artist = 'elena';
  else if (host.startsWith('alexey.')) artist = 'alexey';
  else if (host.startsWith('archive.')) artist = 'archive';

  if (artist === 'archive') {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('https://alexey.boukingolts.art/auth/login'));
    }
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      if (payload.role !== 'admin') throw new Error('not admin');
    } catch {
      return NextResponse.redirect(new URL('https://alexey.boukingolts.art/auth/login'));
    }
  }

  const headers = new Headers(req.headers);
  headers.set('x-artist', artist);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
