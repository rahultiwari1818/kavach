import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ['/home', '/settings', '/profile'];
  const publicRoutes = ['/', '/register'];

  const isProtected = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );

  const isPublic = publicRoutes.includes(pathname);

  // 🔒 If trying to access a protected route without being authenticated
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 🚫 If already logged in, prevent going back to login/register
  if (isPublic && token) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}
