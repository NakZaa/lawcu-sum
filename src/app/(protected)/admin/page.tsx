'use client'

import { admin } from '@/actions/admin'
import { RoleGate } from '@/components/auth/role-gate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'

const AdminPage = () => {
  const onServerActionClick = () => {
    admin().then(data => {
      if (data.error) {
        toast.error(data.error)
      }
      if (data.success) {
        toast.success(data.success)
      }
    })
  }
  const role = useCurrentRole()
  const onApiRouteClick = () => {
    fetch('/api/admin').then(res => {
      if (res.ok) {
        toast.success('Allowed API Route!')
      } else {
        toast.error('Unauthorized API Route!')
      }
    })
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <p className="text-sm font-medium">Role</p>
            <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
              {role}
            </p>
          </div>
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
