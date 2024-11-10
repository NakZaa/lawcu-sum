import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { db } from './lib/db'
import authConfig from './auth.config'
import { getUserById } from './data/user'
import { UserRole } from '@prisma/client'

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date()
        }
      })
    },
    async signIn({ user }) {
      await db.user.update({
        where: {
          id: user.id
        },
        data: {
          username: user.name?.trim().replace(/\s/g, '')
        }
      })
    }
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (
        account &&
        account.provider === 'google' &&
        profile?.email?.endsWith('@student.chula.ac.th')
      ) {
        return true
      }

      return false
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole
      }

      if (token.username && session.user) {
        session.user.username = token.username as string
      }

      if (session.user) {
        session.user.name = token.name
        session.user.username = token.username as string
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)

      if (!existingUser) return token

      token.name = existingUser.name
      token.username = existingUser.username
      token.role = existingUser.role
      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' },
  ...authConfig
})
