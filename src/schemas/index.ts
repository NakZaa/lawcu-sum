import { UserRole } from '@prisma/client'
import * as z from 'zod'
export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  role: z.enum([UserRole.ADMIN, UserRole.USER])
})

export const createPostSchema = z.object({
  content: z.string().trim().min(1, 'Required'),
  mediaIds: z.optional(
    z.array(z.string()).max(5, 'Cannot upload more than 5 attachments')
  )
})

export const updateUserProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, 'Display name cannot be shorter than 3 characters')
    .max(80, 'Display Name must be less than 80 characters'),
  bio: z.optional(
    z.string().trim().max(1000, 'Bio must be less than 1000 characters')
  )
})

export type updateUserProfileValues = z.infer<typeof updateUserProfileSchema>

export const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'Required')
})
