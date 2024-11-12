import { Bookmark, Home, Settings } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import NotificationsButton from './NotificationsButton'
import { HomeIcon, BookmarkIcon } from '@heroicons/react/24/outline'

interface MenuBarProps {
  className?: string
}

export default async function MenuBar({ className }: MenuBarProps) {
  const user = await currentUser()

  if (!user || !user.id) {
    return null
  }

  const unreadNotificationCount = await db.notification.count({
    where: {
      recipientId: user.id,
      read: false
    }
  })

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/home">
          <HomeIcon />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationCount }}
      />
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Create Post"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  )
}
