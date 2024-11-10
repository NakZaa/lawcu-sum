import { getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserDataSelect } from '@/types/types'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { FaUser } from 'react-icons/fa6'
import { unstable_cache } from 'next/cache'
import { formatNumber } from '@/lib/utils'
import FollowButton from './FollowButton'
import UserTooltip from './UserTooltip'

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <TrendingTopics />
      </Suspense>
    </div>
  )
}

async function WhoToFollow() {
  const user = await currentUser()

  if (!user || !user.id) return null

  const usersToFollow = await db.user.findMany({
    where: {
      NOT: {
        id: user?.id
      },
      followers: {
        none: {
          followerId: user.id
        }
      }
    },
    select: getUserDataSelect(user.id),
    take: 5
  })

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map(user => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <Avatar className="flex-none">
                <AvatarImage
                  src={user?.image || ''}
                  referrerPolicy="no-referrer"
                  alt="profile-picture"
                />
                <AvatarFallback className="bg-[#D95F8C]">
                  <FaUser className="text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.name}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id
              )
            }}
          />
        </div>
      ))}
    </div>
  )
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await db.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
  `

    return result.map(row => ({
      hashtag: row.hashtag,
      count: Number(row.count)
    }))
  },
  ['trending_topics'],
  { revalidate: 1 * 60 * 60 }
)

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics()

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending topics</div>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split('#')[1]

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        )
      })}
    </div>
  )
}
