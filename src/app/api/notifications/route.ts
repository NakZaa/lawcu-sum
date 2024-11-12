import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { notificationsInclude, NotificationsPage } from '@/types/types'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const cursor = req.nextUrl.searchParams.get('cursor') || undefined

    const pageSize = 10

    const user = await currentUser()

    if (!user || !user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const notifications = await db.notification.findMany({
      where: {
        recipientId: user.id
      },
      include: notificationsInclude,
      orderBy: { createdAt: 'desc' },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined
    })

    const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null

    const data: NotificationsPage = {
      notifications: notifications.slice(0, pageSize),
      nextCursor
    }

    return Response.json(data)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
