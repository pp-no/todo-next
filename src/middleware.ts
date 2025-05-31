import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const auth = request.headers.get('authorization');
	const user = process.env.BASIC_AUTH_USER;
	const pass = process.env.BASIC_AUTH_PASS;

	if (auth) {
		const base64 = auth.split(' ')[1];
		const [u, p] = Buffer.from(base64, 'base64').toString().split(':');
		if (user && pass && u === user && p === pass) {
			return NextResponse.next();
		}
	}

	return new NextResponse('Auth required', {
		status: 401,
		headers: { 'WWW-Authenticate': 'Basic realm="Secure Area"' },
	});
}

export const config = {
	matcher: ['/', '/((?!_next|favicon.ico|api).*)'],
};
// export function middleware(request: NextRequest) {
// 	console.log('✅ middleware is running'); // ← ログが出るかチェック

// 	return new NextResponse('認証チェック', {
// 		status: 401,
// 		headers: {
// 			'WWW-Authenticate': 'Basic realm="Test Area"',
// 		},
// 	});
// }

// export const config = {
// 	matcher: ['/', '/(.*)'],
// };
