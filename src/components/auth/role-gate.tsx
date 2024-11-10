'use client'

import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import { usePathname } from 'next/navigation'
import { FaTriangleExclamation } from 'react-icons/fa6'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
  adminOnly?: boolean
}

export const RoleGate = ({
  children,
  allowedRole,
  adminOnly
}: RoleGateProps) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    if (adminOnly) {
      return null
    }
    return (
      <div className="flex items-center justify-center">
        <p className="text-center text-red-500 flex flex-row items-center justify-center gap-2">
          <FaTriangleExclamation className="w-5 h-5" />
          You do not have permission
        </p>
      </div>
    )
  }

  return <>{children}</>
}
