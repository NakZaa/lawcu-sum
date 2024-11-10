'use client'

import { FaUser } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  Search,
  Inbox,
  Activity,
  Settings,
  LogOut,
  Lock,
  UserIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from './logout-button'
import Link from 'next/link'
import { Button } from '../ui/button'
import { RoleGate } from './role-gate'
import { UserRole } from '@prisma/client'
import { cn } from '@/lib/utils'

interface UserButtonProps {
  className?: string
}

export const UserButton = ({ className }: UserButtonProps) => {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn('flex-none rounded-full', className)}>
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
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuLabel className="truncate">{user?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button asChild variant="ghost">
            <Link href={`/users/${user?.username}`}>
              <UserIcon />
              <span>Profile</span>
            </Link>
          </Button>
        </DropdownMenuItem>

        <RoleGate allowedRole={UserRole.ADMIN} adminOnly>
          <DropdownMenuItem>
            <Button asChild variant="ghost">
              <Link href="/admin">
                <Lock />
                <span>Admin</span>
              </Link>
            </Button>
          </DropdownMenuItem>
        </RoleGate>
        <DropdownMenuItem className="cursor-pointer">
          <LogoutButton>
            <span>
              <LogOut />
              <span>Logout</span>
            </span>
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
