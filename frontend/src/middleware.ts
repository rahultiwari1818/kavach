import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const role = request.cookies.get('role')?.value;
  const pathname = request.nextUrl.pathname;

  const publicRoutes = ['/', '/login', '/register'];
  const isPublic = publicRoutes.includes(pathname);

  const userProtectedRoutes = ['/public/home','/profile','/public/crime-report','/public/my-reported-crimes'];
  const adminProtectedRoutes = [ '/admin/home', '/admin/users','/profile','/admin/verified-crimes','/super-admin/home','/super-admin/manage-users','/super-admin/manage-admins'];


  // const commonRoutes = ['/profile'];

  const isUserRoute = userProtectedRoutes.some(path => pathname.startsWith(path));
  const isAdminRoute = adminProtectedRoutes.some(path => pathname.startsWith(path));

  // 🔐 Not logged in but trying to access protected area
  if ((isUserRoute || isAdminRoute) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 🔁 Already logged in but accessing login/register — redirect to role-specific home
  if (isPublic && token) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/home', request.url));
    }
    else if(role === 'super-admin'){
            return NextResponse.redirect(new URL('/super-admin/home', request.url));
    }
    else {
      return NextResponse.redirect(new URL('/public/home', request.url));
    }
  }

  //  Admin trying to access user area — block
  if (isUserRoute && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/home', request.url));
  }


  //  User trying to access admin area — block
  if (isAdminRoute && role === 'public') {
    return NextResponse.redirect(new URL('/public/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', '/login', '/register',
    '/home', '/profile', '/settings',
    '/admin/:path*'
  ],
};
