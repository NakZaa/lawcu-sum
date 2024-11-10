import NextAuth from 'next-auth'

import authConfig from './auth.config'
import {
  adminRoutesPrefix,
  apiAuthPrefix,
  apiPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  INSUFFICIENT_PERMISSIONS,
  publicRoutes
} from './routes'
import { UserRole } from '@prisma/client'

const { auth } = NextAuth(authConfig)

export default auth(req => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
  const isAuthRoute = authRoutes.includes(nextUrl.pathname)
  const isAdminRoute = nextUrl.pathname.startsWith(adminRoutesPrefix)
  const isApiRoute = nextUrl.pathname.startsWith(apiPrefix)

  if (isApiAuthRoute) {
    return
  }

  if (isApiRoute) {
    return
  }

  if (isAdminRoute && isLoggedIn) {
    if (UserRole.ADMIN) {
      return
    }
    return Response.redirect(new URL(INSUFFICIENT_PERMISSIONS, nextUrl))
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl))
  }

  return
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)'
  ]
}
