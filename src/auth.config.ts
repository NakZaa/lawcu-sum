import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export default {
  providers: [
    Google({
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
        }
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ]
} satisfies NextAuthConfig
