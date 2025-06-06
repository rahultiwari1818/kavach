// middleware.ts (at root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;

  const protectedRoutes = ['/home', '/settings','/profile']; // Add all routes to protect
  const isProtected = protectedRoutes.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
