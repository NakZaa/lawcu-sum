'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateUserProfileSchema, updateUserProfileValues } from '@/schemas'
import { getUserDataSelect } from '@/types/types'

export async function UpdateUserProfile(values: updateUserProfileValues) {
  const validatedValues = updateUserProfileSchema.parse(values)

  const user = await currentUser()

  if (!user || !user.id) throw new Error('Unauthorized')

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: validatedValues,
    select: getUserDataSelect(user.id)
  })

  return updatedUser
}
