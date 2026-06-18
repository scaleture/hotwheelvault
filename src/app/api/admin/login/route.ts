import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { timingSafeEqual } from 'node:crypto'

const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const adminPassword = process.env.ADMIN_PASSWORD!

    if (password.length !== adminPassword.length) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const passwordBuf = Buffer.from(password)
    const adminBuf = Buffer.from(adminPassword)

    if (!timingSafeEqual(passwordBuf, adminBuf)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(secret)

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
}
