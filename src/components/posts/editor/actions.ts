'use server'

import { getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createPostSchema } from '@/schemas'
import { getPostDataInclude } from '@/types/types'

export const submitPost = async (input: {
  content: string
  mediaIds: string[]
}) => {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: 'Unauthorized' }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'Unauthorized' }
  }

  const { content, mediaIds = [] } = createPostSchema.parse(input)

  const newPost = await db.post.create({
    data: {
      content,
      authorId: user.id,
      attachments: {
        connect: mediaIds.map(id => ({ id }))
      }
    },
    include: getPostDataInclude(user.id)
  })

  return newPost
}
