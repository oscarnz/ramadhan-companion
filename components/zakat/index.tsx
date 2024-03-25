'use client'

import dynamic from 'next/dynamic'
import { StockSkeleton } from '../stocks/stock-skeleton'
import { StocksSkeleton } from '../stocks/stocks-skeleton'
import { EventsSkeleton } from '../stocks/events-skeleton'
import { spinner } from '../stocks'

export { BotCard, BotMessage, SystemMessage } from '../stocks/message'

const Zakat = dynamic(
  () => import('./zakat-pay').then(mod => mod.Zakat),
  {
    ssr: false,
    loading: () => (
      <div className="h-[375px] rounded-xl border bg-zinc-950 p-4 text-green-400 sm:h-[314px]" />
    )
  }
)

export { Zakat }
