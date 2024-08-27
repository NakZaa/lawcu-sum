import { UserRole } from '@prisma/client'
import * as z from 'zod'
export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  role: z.enum([UserRole.ADMIN, UserRole.USER])
})
