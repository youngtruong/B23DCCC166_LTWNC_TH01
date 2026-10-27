import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { NextResponse } from 'next/server';
// Next.js 16 renamed middleware.ts to proxy.ts (Node runtime).
export default auth(request => {
  if (!request.auth) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  if (request.nextUrl.pathname.startsWith('/admin') && !can(request.auth.user.role, 'deadline:create')) return NextResponse.redirect(new URL('/403', request.url));
  return NextResponse.next();
});
export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
