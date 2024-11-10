import { UserRole } from '@prisma/client'
import NextAuth, { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole
  username: string
  bio: string
  displayName: string
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
