import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { NotificationCountInfo } from '@/types/types'

export async function GET() {
  try {
    const user = await currentUser()

    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unreadCount = await db.notification.count({
      where: {
        recipientId: user.id,
        read: false
      }
    })

    const data: NotificationCountInfo = {
      unreadCount
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
