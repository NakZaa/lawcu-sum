'use client'

import { UserButton } from '@/components/auth/user-button'
import SearchField from '@/components/searchField'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  return (
    // <nav className="bg-secondary flex md:justify-between justify-center flex-wrap items-center p-4 w-full shadow-sm z-30 fixed top-0 gap-4">
    //   <div className="flex text-center items-center justify-center">
    //     <Link href="/home" className="text-4xl font-extrabold ">
    //       Law <span className="text-[#D95F8C]">Chula</span>
    //     </Link>
    //   </div>
    //   <div className="flex flex-row gap-5 items-center justify-between">
    //     <SearchField />
    //     <UserButton />
    //   </div>
    // </nav>
    <nav className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/home" className="text-3xl font-bold">
          Law <span className="text-[#D95F8C]">Chula</span>
        </Link>
        <SearchField />
        <UserButton className="sm:ms-auto" />
      </div>
    </nav>
  )
}
