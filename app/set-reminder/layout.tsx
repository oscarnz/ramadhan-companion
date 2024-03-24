import { auth } from '@/auth'
import { Session } from '@/lib/types'

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = (await auth()) as Session

  if (!session) {
    return (
      <div className="flex text-center items-center justify-center pt-4 text-xl">
        Not authenticated, please login to use the set reminder function
      </div>
    )
  }

  return <div>{children}</div>
}
