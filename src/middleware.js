import { NextResponse } from 'next/server'

export function middleware(request) {
  const access_token = request.cookies.get('access_token')
  const currentPath = request.nextUrl.pathname

  if (!access_token) {
    // Action jika user belum login
    if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/my')) {
      return NextResponse.redirect(new URL(`/auth/login`, request.url))
    }
  } else {
    // Action jika sudah login
    if (currentPath.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/my/:path*'],
}
