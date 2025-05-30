// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const basicAuth = request.headers.get('authorization');

	const user = process.env.BASIC_AUTH_USER;
	const pass = process.env.BASIC_AUTH_PASS;

	if (basicAuth) {
		const authValue = basicAuth.split(' ')[1];
		const [u, p] = atob(authValue).split(':');

		if (u === user && p === pass) {
			return NextResponse.next();
		}
	}

	return new NextResponse('認証が必要です', {
		status: 401,
		headers: {
			'WWW-Authenticate': 'Basic realm="Secure Area"',
		},
	});
}
