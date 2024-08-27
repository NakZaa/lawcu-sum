'use client'

import { FcGoogle } from 'react-icons/fc'
import { Button } from '../ui/button'
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const Social = () => {
  const onClick = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        variant="outline"
        className="w-full gap-2"
        onClick={() => onClick('google')}
      >
        <FcGoogle className="w-5 h-5" /> Login with Google
      </Button>
    </div>
  )
}
