import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isHomePage = pathname === '/';
    const isAuthPage = pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
    const isApiAuth = pathname.startsWith('/api/auth');
    const isNextAsset = pathname.startsWith('/_next') || pathname.includes('.');

    if (isHomePage || isAuthPage || isApiAuth || isNextAsset) {
        return NextResponse.next();
    }

    const sessionToken =
        request.cookies.get('better-auth.session_token')?.value ??
        request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
        const signInURL = new URL('/sign-in', request.url);
        signInURL.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInURL);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/text|_next/static|_next/image|favicon.ico).*)",
    ]
};
