import { LoginButton } from '@/components/auth/login-button'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <div className="space-y-2 text-center">
        <h2 className="text-2xl">Login to</h2>
        <h1 className="text-4xl font-extrabold pb-2">
          Law <span className="text-[#D95F8C]">Chula</span>
        </h1>
        <div>
          <LoginButton asChild>
            <Button size="lg">Login with Chula Account</Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
