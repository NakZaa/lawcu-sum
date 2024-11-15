'use client'

import useFollowerInfo from '@/hooks/use-follower-info'
import { formatNumber } from '@/lib/utils'
import { FollowerInfo } from '@/types/types'

interface FollowerCountProps {
  userId: string
  initialState: FollowerInfo
}

export default function FollowerCount({
  userId,
  initialState
}: FollowerCountProps) {
  const { data } = useFollowerInfo(userId, initialState)

  return (
    <div className="flex items-center gap-3">
      <span>Followers: </span>
      <span className="font-semibold">{formatNumber(data.followers)}</span>
    </div>
  )
}
