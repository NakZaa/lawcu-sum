'use client'

import { FaUser } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from './logout-button'
import { ExitIcon } from '@radix-ui/react-icons'
import { useSession } from 'next-auth/react'

export const UserButton = () => {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage
            src={user?.image || ''}
            referrerPolicy="no-referrer"
            alt="profile-picture"
          />
          <AvatarFallback className="bg-[#D95F8C]">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
