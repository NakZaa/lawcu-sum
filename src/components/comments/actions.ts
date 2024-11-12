'use server'

import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createCommentSchema } from '@/schemas'
import { getCommentDataInclude, PostData } from '@/types/types'

export default async function submitComment({
  post,
  content
}: {
  post: PostData
  content: string
}) {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: 'Unauthorized' }
  }

  const { content: contentValidated } = createCommentSchema.parse({ content })

  const [newComment] = await db.$transaction([
    db.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        authorId: user.id
      },
      include: getCommentDataInclude(user.id)
    }),
    ...(post.user.id !== user.id
      ? [
          db.notification.create({
            data: {
              issuerId: user.id,
              recipientId: post.user.id,
              postId: post.id,
              type: 'COMMENT'
            }
          })
        ]
      : [])
  ])

  return newComment
}

export async function deleteComment(id: string) {
  const user = await currentUser()

  if (!user || !user.id) {
    return { error: 'Unauthorized' }
  }

  const comment = await db.comment.findUnique({
    where: { id }
  })

  if (!comment) throw new Error('Comment not found')

  if (comment.authorId !== user.id) throw new Error('Unauthorized')

  const deletedComment = await db.comment.delete({
    where: { id },
    include: getCommentDataInclude(user.id)
  })

  return deletedComment
}
