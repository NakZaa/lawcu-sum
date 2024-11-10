'use client'

import { signOut } from 'next-auth/react'
import { Button } from '../ui/button'
import { useQueryClient } from '@tanstack/react-query'

interface LogoutButtonProps {
  children: React.ReactNode
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const queryClient = useQueryClient()

  const onClick = () => {
    queryClient.clear()
    signOut({ callbackUrl: '/' })
  }
  return (
    <Button variant="ghost" onClick={onClick} asChild>
      {children}
    </Button>
  )
}
