import { CommentData } from '@/types/types'
import UserTooltip from '../UserTooltip'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { FaUser } from 'react-icons/fa6'
import { formatRelativeDate } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/use-current-user'
import CommentMoreButton from './CommentMoreButton'

interface CommentProps {
  comment: CommentData
}

export default function Comment({ comment }: CommentProps) {
  const user = useCurrentUser()

  return (
    <div className="flex gap-3 py-3 group/comment">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <Avatar className="size-10">
              <AvatarImage
                src={comment.user.image || ''}
                referrerPolicy="no-referrer"
                alt="profile-picture"
              />
              <AvatarFallback className="bg-[#D95F8C]">
                <FaUser className="text-white" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={comment.user}>
            <Link
              href={`/users/${comment.user.username}`}
              className="font-bold hover:underline"
            >
              {comment.user.displayName !== null
                ? comment.user.displayName
                : comment.user.name}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </span>
        </div>
        <div>{comment.content}</div>
      </div>
      {comment.user.id === user?.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  )
}
