import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isApiRoute = pathname.startsWith('/api/admin')
  const isLoginRoute = pathname === '/admin/login' || pathname === '/api/admin/login'

  if (isLoginRoute) {
    return NextResponse.next()
  }

  const session = request.cookies.get('admin_session')?.value

  if (!session) {
    return redirectOrUnauthorized(request, isApiRoute)
  }

  try {
    await jwtVerify(session, secret)
    return NextResponse.next()
  } catch {
    return redirectOrUnauthorized(request, isApiRoute)
  }
}

function redirectOrUnauthorized(request: NextRequest, isApi: boolean) {
  if (isApi) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.redirect(new URL('/admin/login', request.url))
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
