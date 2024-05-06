import NextAuth from "next-auth";

import { authConfig } from "./auth.config";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    protectedRoutes,
    publicRoutes
} from '@/routes';
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    //check if the request route is /listing/[listingId] which is a public route
    let listingRoute = /\/listing\/*/.test(nextUrl.pathname);
    if (listingRoute) {
        //further check if the request route is /listing/[listingId]/edit which is a authenticated route

        const listingEditRoute = /\/listing\/\w*\/edit/.test(nextUrl.pathname);
        console.log(listingEditRoute);
        if (listingEditRoute && !isLoggedIn) {
            return Response.redirect(new URL('/signin', nextUrl));
        }
    }

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);
    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname)



    if (isApiAuthRoute) {
        return;
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return;
    }

    if (listingRoute) return;

    if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL('/signin', nextUrl));
    }

    if (!isLoggedIn && isProtectedRoute) {
        return Response.redirect(new URL('/signin', nextUrl));
    }

    return;
})

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
    matcher: [
        // Exclude files with a "." followed by an extension, which are typically static files.
        // Exclude files in the _next directory, which are Next.js internals.
        "/((?!.+\\.[\\w]+$|_next).*)",
        // Re-include any files in the api or trpc folders that might have an extension
        "/(api|trpc)(.*)"
    ]
}