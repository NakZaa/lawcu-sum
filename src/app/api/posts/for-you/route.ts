import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPostDataInclude, PostsPage } from '@/types/types'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 10

    const user = await currentUser()

    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await db.post.findMany({
      include: getPostDataInclude(user.id),
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined
    })

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null

    const data: PostsPage = {
      posts: posts.slice(0, pageSize),
      nextCursor
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
