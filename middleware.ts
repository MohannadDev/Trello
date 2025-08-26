import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
    runtime: 'experimental-edge',
  matcher: [
    // Only run on specific auth-related paths
    '/(api|trpc)/(.*)',
    '/dashboard(.*)',
    '/boards(.*)',
    '/sign-in(.*)',
    '/sign-up(.*)',
    // Exclude static files and Next.js internals
    '/((?!_next|.*\.(?:jpg|jpeg|gif|png|svg|webp|js|css|woff|woff2)).*)',
  ],
}

