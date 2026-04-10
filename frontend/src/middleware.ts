import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/signIn", "/signUp"];

function isPublicPath(pathname: string): boolean {
    if (PUBLIC_PATHS.includes(pathname)) {
        return true;
    }

    if (pathname.startsWith("/api/auth")) {
        return true;
    }

    if (pathname.startsWith("/_next")) {
        return true;
    }

    if (pathname === "/favicon.ico") {
        return true;
    }

    // Allow requests for files from /public or generated assets.
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
        return true;
    }

    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (PUBLIC_PATHS.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const signInUrl = new URL("/signIn", request.url);
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
