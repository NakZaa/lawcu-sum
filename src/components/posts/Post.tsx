'use client'

import Link from 'next/link'
import { Avatar } from '../ui/avatar'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { FaUser } from 'react-icons/fa6'
import { PostData } from '@/types/types'
import { cn, formatRelativeDate } from '@/lib/utils'
import { useCurrentUser } from '@/hooks/use-current-user'
import PostMoreButton from './PostMoreButton'
import Linkify from '../Linkify'
import UserTooltip from '../UserTooltip'
import { Media } from '@prisma/client'
import Image from 'next/image'
import LikeButton from './LikeButton'
import BookmarkButton from './BookmarkButton'

interface PostProps {
  post: PostData
}

export default function Post({ post }: PostProps) {
  const user = useCurrentUser()

  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm group/post">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <Avatar>
                <AvatarImage
                  src={post.user.image || ''}
                  referrerPolicy="no-referrer"
                  alt="profile-picture"
                />
                <AvatarFallback className="bg-[#D95F8C]">
                  <FaUser className="text-white" />
                </AvatarFallback>
              </Avatar>
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName !== null
                  ? post.user.displayName
                  : post.user.name}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <LikeButton
          postId={post.id}
          initialState={{
            likes: post._count.likes,
            isLikedByUser: post.likes.some(like => like.userId === user?.id)
          }}
        />
        <BookmarkButton
          postId={post.id}
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              bookmark => bookmark.userId === user?.id
            )
          }}
        />
      </div>
    </article>
  )
}

interface MediaPreviewsProps {
  attachments: Media[]
}

function MediaPreviews({ attachments }: MediaPreviewsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        attachments.length > 1 && 'sm:grid sm:grid-cols-2'
      )}
    >
      {attachments.map(m => (
        <MediaPreview key={m.id} media={m} />
      ))}
    </div>
  )
}

interface MediaPreviewProps {
  media: Media
}

function MediaPreview({ media }: MediaPreviewProps) {
  if (media.type === 'IMAGE') {
    return (
      <Image
        src={media.url}
        alt="Attachment"
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    )
  }

  if (media.type === 'VIDEO') {
    return (
      <div>
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    )
  }

  return <p className="text-destructive">Unsupported Media Type</p>
}