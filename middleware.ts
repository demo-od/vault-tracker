import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (pathname === '/' || pathname === '/login' || pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Protect dashboard routes - check for session cookie
    if (pathname.startsWith('/dashboard')) {
        const cookies = request.cookies.getAll();
        const hasSession = cookies.some(cookie => 
            cookie.name.includes('session') || cookie.name.includes('token')
        );
        
        if (!hasSession) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
