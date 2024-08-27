'use client'

import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import { FaTriangleExclamation } from 'react-icons/fa6'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: UserRole
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-center text-red-500 flex flex-row items-center justify-center gap-2">
          <FaTriangleExclamation className="w-5 h-5" />
          You are not authorized to view this page
        </p>
      </div>
    )
  }

  return <>{children}</>
}
