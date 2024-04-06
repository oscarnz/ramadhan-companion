'use client'

import dynamic from 'next/dynamic'

export { BotCard, BotMessage, SystemMessage } from '../zakat/message'

const PrayerTime = dynamic(
    () => import('./prayer-times').then(mod => mod.PrayerTime),
    {
        ssr: false,
        loading: () => (
            <div className="h-[375px] rounded-xl border bg-zinc-950 p-4 text-green-400 sm:h-[314px]" />
        )
    }
)

export { PrayerTime }
