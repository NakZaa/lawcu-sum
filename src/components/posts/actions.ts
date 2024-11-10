'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPostDataInclude } from '@/types/types'

export async function deletePost(id: string) {
  const user = await currentUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  const post = await db.post.findUnique({
    where: { id }
  })

  if (!post) {
    return { error: 'Post not found' }
  }

  if (post.authorId !== user.id) {
    return { error: 'Unauthorized' }
  }

  const deletedPost = await db.post.delete({
    where: { id },
    include: getPostDataInclude(user.id)
  })

  return deletedPost
}
