import FollowButton from '@/components/FollowButton'
import FollowerCount from '@/components/FollowerCount'
import TrendsSidebar from '@/components/TrendsSidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatNumber } from '@/lib/utils'
import { FollowerInfo, getUserDataSelect, UserData } from '@/types/types'
import { formatDate } from 'date-fns'
import { Metadata } from 'next'
import { notFound, useParams } from 'next/navigation'
import { cache } from 'react'
import { FaUser } from 'react-icons/fa6'
import UserPosts from './UserPosts'
import Linkify from '@/components/Linkify'
import EditProfileButton from './EditProfileButton'

interface PageProps {
  params: { username: string }
}

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await db.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      }
    },
    select: getUserDataSelect(loggedInUserId)
  })

  if (!user) notFound()

  return user
})

export async function generateMetadata({
  params: { username }
}: PageProps): Promise<Metadata> {
  const loggedInUser = await currentUser()

  if (!loggedInUser || !loggedInUser.id) return {}

  const user = await getUser(username, loggedInUser.id)

  return {
    title: `${user.name} (@${user.username})`
  }
}

export default async function Page({ params: { username } }: PageProps) {
  const loggedInUser = await currentUser()

  if (!loggedInUser || !loggedInUser.id)
    return (
      <p className="text-destructive">
        You must be logged in to view this page
      </p>
    )

  const user = await getUser(username, loggedInUser.id)

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-xl font-bold">
            {user.name}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={user.id} />
      </div>
      <TrendsSidebar />
    </main>
  )
}

interface UserProfileProps {
  user: UserData
  loggedInUserId: string
}

async function UserProfile({ user, loggedInUserId }: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId
    )
  }

  return (
    <div className="h-fit w-full space-y-5 p-5 rounded-2xl bg-card shadow-sm">
      <Avatar className="aspect-square h-fit flex-none bg-secondary object-cover mx-auto size-full max-h-24 max-w-24 rounded-full">
        <AvatarImage
          src={user.image || ''}
          referrerPolicy="no-referrer"
          alt="profile-picture"
        />
        <AvatarFallback className="bg-[#D95F8C]">
          <FaUser className="text-white" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          {user.displayName !== null ? (
            <div>
              <h1 className="text-3xl font-bold">{user.displayName}</h1>
              <div className="text-muted-foreground">{user.name}</div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold">{user.name}</h1>
            </div>
          )}
          <div>Member since {formatDate(user.createdAt, 'd MMM, yyyy')}</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              <span>Posts: </span>
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </div>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <EditProfileButton user={user} />
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </div>
      {user.bio && (
        <>
          <hr />
          <Linkify>
            <div className="whitespace-pre-line overflow-hidden break-words">
              {user.bio}
            </div>
          </Linkify>
        </>
      )}
    </div>
  )
}
