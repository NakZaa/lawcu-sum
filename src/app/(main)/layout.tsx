import { Navbar } from '../../components/navbar'

import MenuBar from '@/components/menuBar'

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="mx-auto max-w-7xl flex w-full grow gap-5 p-5">
        <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-2 rounded-2xl bg-card px-3 py-5 shadow-sm sm:block lg:px-5 xl:w-60" />
        {children}
      </div>
      <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 border-t bg-card p-3 sm:hidden [&_svg]:size-6" />
    </div>
  )
}

export default ProtectedLayout
