import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { NotificationData } from '@/types/types'
import { NotificationType } from '@prisma/client'
import { Heart, MessageCircle, User2 } from 'lucide-react'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa6'

interface NotificationProps {
  notification: NotificationData
}

export default function Notification({ notification }: NotificationProps) {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.name} started following you.`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`
    },
    COMMENT: {
      message: `${notification.issuer.name} commented on your post.`,
      icon: <MessageCircle className="size-7 text-primary fill-primary" />,
      href: `/posts/${notification.postId}`
    },
    LIKE: {
      message: `${notification.issuer.name} liked your post.`,
      icon: <Heart className="size-7 text-red-500 fill-red-500" />,
      href: `/posts/${notification.postId}`
    }
  }

  const { message, icon, href } = notificationTypeMap[notification.type]

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          'flex gap-3 rounded-2xl bg-card p-5 shadow-sm hover:bg-card/70',
          !notification.read && 'bg-primary/10 transition-colors'
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <Avatar className="size-[36px]">
            <AvatarImage
              src={notification.issuer.image || ''}
              referrerPolicy="no-referrer"
              alt="profile-picture"
            />
            <AvatarFallback className="bg-[#D95F8C]">
              <FaUser className="text-white" />
            </AvatarFallback>
          </Avatar>
          <div>
            <span className="font-bold">
              {notification.issuer.displayName || notification.issuer.name}
            </span>{' '}
            <span>{message}</span>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
