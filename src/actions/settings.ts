'use server'

import { getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { SettingsSchema } from '@/schemas'
import * as z from 'zod'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const dbUser = user.id ? await getUserById(user.id) : null

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  await db.user.update({
    where: { id: user.id },
    data: { ...values }
  })

  return { success: 'Settings updated' }
}
