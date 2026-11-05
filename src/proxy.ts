import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isHomePage = pathname === '/';
    const isAuthPage = pathname.startsWith('/log-in') || pathname.startsWith('/register');
    const isApiAuth = pathname.startsWith('/api/auth');
    const isNextAsset = pathname.startsWith('/_next') || pathname.includes('.');

    // Event list and event details are public.
    // Joining an event still requires an account and is enforced in the
    // join handler on the detail page.
    const isPublicEventPage =
        pathname === '/upcoming-events' ||
        pathname.startsWith('/upcoming-events/');

    if (
        isHomePage ||
        isAuthPage ||
        isApiAuth ||
        isNextAsset ||
        isPublicEventPage
    ) {
        return NextResponse.next();
    }

    const sessionToken =
        request.cookies.get('better-auth.session_token')?.value ??
        request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
        const logInURL = new URL('/log-in', request.url);
        logInURL.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(logInURL);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/text|_next/static|_next/image|favicon.ico).*)",
    ]
};
