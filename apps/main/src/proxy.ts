import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Domain → Service Slug Mapping
  // Maps each service domain to its landing page slug
  const domainMap: Record<string, string> = {
    'reference-footprint.de': 'reference',
    'www.reference-footprint.de': 'reference',
    'personal-footprint.de': 'personal',
    'www.personal-footprint.de': 'personal',
    'digital-footprint.de': 'digital',
    'www.digital-footprint.de': 'digital',
    'media-footprint.de': 'media',
    'www.media-footprint.de': 'media',
    'socialmedia-footprint.de': 'social',
    'www.socialmedia-footprint.de': 'social',
    'event-footprint.de': 'event',
    'www.event-footprint.de': 'event',
    'marketing-footprint.de': 'marketing',
    'www.marketing-footprint.de': 'marketing',
  }

  // If domain matches a service domain and user is on root path,
  // rewrite to the service landing page (URL stays the same, content changes)
  const slug = domainMap[hostname]
  if (slug && request.nextUrl.pathname === '/') {
    // Use rewrite (not redirect) to keep the URL clean
    return NextResponse.rewrite(new URL(`/services/${slug}`, request.url))
  }

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true'

    // Allow login page
    if (request.nextUrl.pathname === '/admin/login') {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.next()
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*'],
}
