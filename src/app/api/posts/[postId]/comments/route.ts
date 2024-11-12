import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { CommentsPage, getCommentDataInclude } from '@/types/types'
import { NextRequest } from 'next/server'

export async function GET(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 5

    const user = await currentUser()

    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const comments = await db.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: 'asc' },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined
    })

    const previousCursor = comments.length > pageSize ? comments[0].id : null

    const data: CommentsPage = {
      comments: comments.length > pageSize ? comments.slice(1) : comments,
      previousCursor
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
