'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import { FollowerInfo, UserData } from '@/types/types'
import { PropsWithChildren } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { FaUser } from 'react-icons/fa6'
import FollowButton from './FollowButton'
import Linkify from './Linkify'
import FollowerCount from './FollowerCount'

interface UserTooltipProps extends PropsWithChildren {
  user: UserData
}

export default function UserTooltip({ user, children }: UserTooltipProps) {
  const loggedInUser = useCurrentUser()

  const followerState: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser?.id
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className='bg-popover text-popover-foreground shadow-md'>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <Avatar className="aspect-square h-[70] w-[70] flex-none rounded-full bg-secondary object-cover">
                  <AvatarImage
                    src={user.image || ''}
                    referrerPolicy="no-referrer"
                    alt="profile-picture"
                  />
                  <AvatarFallback className="bg-[#D95F8C]">
                    <FaUser className="text-white" />
                  </AvatarFallback>
                </Avatar>
              </Link>
              {loggedInUser?.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                {user.displayName !== null ? (
                  <div>
                    <div className="text-lg font-semibold hover:underline">
                      {user.displayName}
                    </div>
                    <div className="text-muted-foreground">{user.name}</div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-semibold hover:underline">
                      {user.name}
                    </div>
                  </div>
                )}
              </Link>
            </div>
            {user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount userId={user.id} initialState={followerState} />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
