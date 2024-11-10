import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserDataSelect } from '@/types/types'
import { error } from 'console'

export async function GET(
  req: Request,
  { params: { username } }: { params: { username: string } }
) {
  try {
    const loggedInUser = await currentUser()

    if (!loggedInUser || !loggedInUser.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await db.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive'
        }
      },
      select: getUserDataSelect(loggedInUser.id)
    })

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 })
    }

    return Response.json(user)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'An error occurred' }, { status: 500 })
  }
}
