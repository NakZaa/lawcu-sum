import type { Metadata } from 'next'
import { IBM_Plex_Sans_Thai } from 'next/font/google'
import './globals.css'
import { auth } from '@/auth'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'
import ReactQueryProvider from './ReactQueryProvider'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { fileRouter } from './api/uploadthing/core'

const IBM = IBM_Plex_Sans_Thai({ subsets: ['latin', 'thai'], weight: '400' })

export const metadata: Metadata = {
  title: 'Law Chulalongkorn QA',
  description: 'Ask and answer law questions for Chula students'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={IBM.className}>
          <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
          <ReactQueryProvider>{children}</ReactQueryProvider>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  )
}
