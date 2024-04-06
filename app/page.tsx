import { Session } from '@/lib/types'
import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { BellIcon, ChatBubbleIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Image from 'next/image'

export default async function HomePage() {
  const session = (await auth()) as Session

  return (
    <div className="p-4">
      <div className="pt-24 text-center">
        <div className="flex items-center justify-center">
          <Image
            src="/ramadhanai.png"
            alt="Ramadhan Companion"
            width={150}
            height={150}
          />
        </div>

        {!session ? (
          <div>Please login to enjoy our features</div>
        ) : (
          <div>
            <div className="text-slate-400 text-md">
              Assalamualaikum, {session.user?.email}
            </div>
            <div className="pt-4 flex flex-col items-center">
              <div>
                Welcome to <span className="font-bold">Ramadhan Companion</span>
              </div>
              <div>How can I help you today?</div>
              <div className="pt-8 flex flex-col gap-2 max-w-32">
                <Link
                  href="/chat"
                  className="gap-2 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  <ChatBubbleIcon />
                  Chat
                </Link>

                <Link
                  href="/set-reminder"
                  className="gap-2 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  <BellIcon />
                  Reminder
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
