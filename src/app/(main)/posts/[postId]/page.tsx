import FollowButton from '@/components/FollowButton'
import Linkify from '@/components/Linkify'
import Post from '@/components/posts/Post'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import UserTooltip from '@/components/UserTooltip'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getPostDataInclude, UserData } from '@/types/types'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache, Suspense } from 'react'
import { FaUser } from 'react-icons/fa6'

interface PageProps {
  params: { postId: string }
}

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await db.post.findUnique({
    where: { id: postId },
    include: getPostDataInclude(loggedInUserId)
  })

  if (!post) notFound()

  return post
})

export async function generateMetadata({ params: { postId } }: PageProps) {
  const user = await currentUser()

  if (!user || !user.id) return {}

  const post = await getPost(postId, user.id)

  return {
    title: `${post.user.name}: ${post.content.slice(0, 50)}...`
  }
}

export default async function Page({ params: { postId } }: PageProps) {
  const user = await currentUser()

  if (!user || !user.id)
    return (
      <p className="text-destructive">
        You must be logged in to view this page
      </p>
    )

  const post = await getPost(postId, user.id)

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-9 space-y-5">
        <Post post={post} />
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none space-y-5 md:block">
        <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </main>
  )
}

interface UserInfoSidebarProps {
  user: UserData
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const loggedInUser = await currentUser()

  if (!loggedInUser) return

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/users/${user.username}`}
          className="flex items-center gap-3"
        >
          <Avatar className="flex-none">
            <AvatarImage
              src={user.image || ''}
              referrerPolicy="no-referrer"
              alt="profile-picture"
            />
            <AvatarFallback className="bg-[#D95F8C]">
              <FaUser className="text-white" />
            </AvatarFallback>
          </Avatar>
          {user.displayName !== null ? (
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                {user.name}
              </p>
            </div>
          ) : (
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.name}
              </p>
            </div>
          )}
        </Link>
      </UserTooltip>
      {user.bio && (
        <Linkify>
          <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
            {user.bio}
          </div>
        </Linkify>
      )}
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id
            )
          }}
        />
      )}
    </div>
  )
}
