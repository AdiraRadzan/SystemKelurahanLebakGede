import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import { UserRole } from '@/types';

const ROLES: UserRole[] = ['lurah', 'sekel', 'pemerintahan', 'ekbang', 'kesos'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static and internal Next.js assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifySession(token);

  // Check public paths
  const isLoginPage = pathname === '/login';
  const isLupaSandiPage = pathname === '/lupa-sandi';
  const isAksesDitolakPage = pathname === '/akses-ditolak';

  // If visiting root "/"
  if (pathname === '/') {
    if (session) {
      return NextResponse.redirect(new URL(`/${session.role}/beranda`, request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If already logged in and visiting login or forgot password, redirect to user's dashboard
  if (session && (isLoginPage || isLupaSandiPage)) {
    return NextResponse.redirect(new URL(`/${session.role}/beranda`, request.url));
  }

  // If visiting login, forgot password, or access denied without session, allow access
  if (isLoginPage || isLupaSandiPage || isAksesDitolakPage) {
    return NextResponse.next();
  }

  // If not logged in and visiting any other page, redirect to login
  if (!session) {
    const loginUrl = new URL('/login', request.url);
    if (!isLoginPage && !isLupaSandiPage && !isAksesDitolakPage) {
      loginUrl.searchParams.set('pesan', 'sesi_berakhir');
    }
    return NextResponse.redirect(loginUrl);
  }

  // Role-based route authorization
  // Check if pathname starts with any role slug: e.g. /lurah, /sekel, /pemerintahan, /ekbang, /kesos
  const targetRole = ROLES.find(role => pathname === `/${role}` || pathname.startsWith(`/${role}/`));

  if (targetRole) {
    if (session.role !== targetRole) {
      // User is attempting to access another role's module -> redirect to access denied
      return NextResponse.redirect(new URL('/akses-ditolak', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
