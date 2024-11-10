import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { BookmarkInfo, LikeInfo } from '@/types/types'

export async function GET(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const loggedInUser = await currentUser()

    if (!loggedInUser || !loggedInUser.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookmark = await db.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId
        }
      }
    })

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const loggedInUser = await currentUser()
    if (!loggedInUser || !loggedInUser.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.bookmark.upsert({
      where: {
        userId_postId: {
          userId: loggedInUser.id,
          postId
        }
      },
      create: {
        userId: loggedInUser.id,
        postId
      },
      update: {}
    })

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    const loggedInUser = await currentUser()
    if (!loggedInUser) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await db.bookmark.deleteMany({
      where: {
        userId: loggedInUser.id,
        postId
      }
    })

    return new Response()
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
