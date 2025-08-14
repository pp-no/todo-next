import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const IS_AUTH_ENABLED = process.env.IS_BASIC_AUTH_ENABLED === 'true'
const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER
const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS

export function middleware(request: NextRequest) {
  // 認証を無効化する条件（本番など）
  if (!IS_AUTH_ENABLED) {
    return NextResponse.next()
  }

  const auth = request.headers.get('authorization')

  if (auth) {
    const value = auth.split(' ')[1]
    const [u, p] = Buffer.from(value, 'base64').toString().split(':')

    if (u === BASIC_AUTH_USER && p === BASIC_AUTH_PASS) {
      return NextResponse.next()
    }
  }

  return new NextResponse('認証が必要です', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: ['/', '/((?!_next|favicon.ico|api).*)'],
}
