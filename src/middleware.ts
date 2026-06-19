import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { createServerClient } from '@supabase/ssr'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')
  const isAdminApi = pathname.startsWith('/api/admin')
  const isLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login'
  const isProtectedRoute = pathname.startsWith('/account') || pathname === '/checkout'

  // Admin JWT protection (existing)
  if (isAdminRoute || isAdminApi) {
    if (isLoginRoute) {
      return NextResponse.next()
    }

    const session = request.cookies.get('admin_session')?.value

    if (!session) {
      return redirectOrUnauthorized(request, isAdminApi, '/admin/login')
    }

    try {
      await jwtVerify(session, secret)
      return NextResponse.next()
    } catch {
      return redirectOrUnauthorized(request, isAdminApi, '/admin/login')
    }
  }

  // Supabase auth protection for /account/* and /checkout
  if (isProtectedRoute) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name) => request.cookies.get(name)?.value ?? null,
          set: () => {},
          remove: () => {},
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const url = new URL('/', request.url)
      url.searchParams.set('signin', 'true')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

function redirectOrUnauthorized(request: NextRequest, isApi: boolean, loginPath: string) {
  if (isApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL(loginPath, request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/account/:path*', '/checkout'],
}
