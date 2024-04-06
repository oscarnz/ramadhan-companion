'use client'

import { Button } from '@/components/ui/button'
import {
  Calendar,
  MapPinned,
  Moon,
  Sun,
  SunMoon,
  Sunrise,
  Sunset
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'
import moment from 'moment'
import Image from 'next/image'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  MasjidIcon,
} from '@/components/icons'

interface WaktuSolat {
  prayers: Array<{
    day: number
    hijri: string
    fajr: number
    dhuhr: number
    asr: number
    maghrib: number
    isha: number
  }>
}

interface PrayerCardProps {
  prayerTime: {
    hijri: string
    fajr: number
    dhuhr: number
    asr: number
    maghrib: number
    isha: number
  }
}

function convertTime(time: number) {
  const date = new Date(time * 1000)
  const localTimeString = date.toLocaleTimeString()
  const parts = localTimeString.split(':')
  const timeWithoutSeconds = parts.slice(0, 2).join(':')
  return timeWithoutSeconds
}

const PrayerCard = ({ prayerTime }: PrayerCardProps) => {
  return (
    <>
      <div className="grid grid-cols-5 gap-1 pt-3">
        <div className="flex p-3 flex-col gap-2 items-center justify-center">
          <Sunrise className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Fajr</div>
          </div>
          <div className="text-[9px] inline flex text-center text-green-400">
            {convertTime(prayerTime.fajr)} AM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sunrise className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Dhuhr</div>
          </div>
          <div className="text-[9px] inline flex text-center text-green-400">
            {convertTime(prayerTime.dhuhr)} PM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sun className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Asr</div>
          </div>
          <div className="text-[9px] inline flex text-center text-green-400">
            {convertTime(prayerTime.asr)} PM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sunset className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Maghrib</div>
          </div>
          <div className="text-[9px] inline flex text-center text-green-400">
            {convertTime(prayerTime.maghrib)} PM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Moon className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Isha</div>
          </div>
          <div className="text-[9px] inline flex text-center text-green-400">
            {convertTime(prayerTime.isha)} PM
          </div>
        </div>
      </div>
    </>
  )
}

const Location = () => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Selangor</TooltipTrigger>
          <TooltipContent className="flex gap-3 text-xs text-gray-500 z-50 w-64 rounded-md border bg-popover p-3 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
            <MapPinned size={30} />
            <span>
              Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

function convertHijriDate(hijriDate: string) {
  const [year, month, day] = hijriDate.split('-').map(Number)
  const monthNames = [
    'Muharram',
    'Safar',
    'Rabiulawal',
    'Rabiulakhir',
    'Jamadilawal',
    'Jamadilakhir',
    'Rejab',
    'Syaaban',
    'Ramadan',
    'Syawal',
    'Zulkaedah',
    'Zulhijah'
  ]

  return `${day} ${monthNames[month - 1]} ${year}`
}

export default function TestPage() {
  const [prayerTime, setPrayerTime] = useState({
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
    hijri: ''
  })
  const [tomorrowsPrayerTime, setTomorrowsPrayerTime] = useState({
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0
  })
  const [nextPrayer, setNextPrayer] = useState({
    prayer: '',
    time: ''
  })
  const [currentTime, setCurrentTime] = useState<Date>()
  const [timeLeft, setTimeLeft] = useState(null)
  const [isHijriDateExpanded, setIsHijriDateExpanded] = useState(true)
  const toggleHijriDateFormat = () => {
    setIsHijriDateExpanded(!isHijriDateExpanded)
  }

  function fetchNextPrayer() {
    setCurrentTime(new Date())
    getNextPrayer()
  }

  setTimeout(fetchNextPrayer, 100)

  useEffect(() => {
    getPrayerTimes()
  }, [])

  function Clock() {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
      const timerID = setInterval(() => tick(), 1000)

      return () => {
        clearInterval(timerID)
      }
    }, [])

    const tick = () => {
      setTime(new Date())
    }

    return <div>{time.toLocaleTimeString()}</div>
  }

  async function getPrayerTimes() {
    try {
      const link = 'https://api.waktusolat.app/v2/solat/SGR01'
      const response = await fetch(encodeURI(link))

      if (!response.ok) {
        throw new Error('Prayer time network response not ok.')
      }

      const prayerTimes: WaktuSolat = await response.json()
      const today = new Date().getDate()
      const tomorrow = new Date().getDate() + 1
      const todaysData = prayerTimes.prayers.find(array => array.day === today)
      const tomorrowsData = prayerTimes.prayers.find(
        array => array.day === tomorrow
      )

      if (todaysData) {
        setPrayerTime({
          fajr: todaysData.fajr,
          isha: todaysData.isha,
          maghrib: todaysData.maghrib,
          asr: todaysData.asr,
          dhuhr: todaysData.dhuhr,
          hijri: todaysData.hijri
        })
      }

      if (tomorrowsData) {
        setTomorrowsPrayerTime({
          fajr: tomorrowsData.fajr,
          isha: tomorrowsData.isha,
          maghrib: tomorrowsData.maghrib,
          asr: tomorrowsData.asr,
          dhuhr: tomorrowsData.dhuhr
        })
      }
    } catch (error) {
      console.error('Error fetching prayer times:', error)
    }
  }

  function getNextPrayer() {
    if (currentTime != undefined) {
      const comparedTime = currentTime.getTime() / 1000

      if (comparedTime > prayerTime.fajr && comparedTime <= prayerTime.dhuhr) {
        setNextPrayer({
          prayer: 'Dhuhr',
          time: convertTime(prayerTime.dhuhr) + ' PM'
        })
      } else if (
        comparedTime > prayerTime.dhuhr &&
        comparedTime <= prayerTime.asr
      ) {
        setNextPrayer({
          prayer: 'Asr',
          time: convertTime(prayerTime.asr) + ' PM'
        })
      } else if (
        comparedTime > prayerTime.asr &&
        comparedTime <= prayerTime.maghrib
      ) {
        setNextPrayer({
          prayer: 'Maghrib',
          time: convertTime(prayerTime.maghrib) + ' PM'
        })
      } else if (
        comparedTime > prayerTime.maghrib &&
        comparedTime <= prayerTime.isha
      ) {
        setNextPrayer({
          prayer: 'Isha',
          time: convertTime(prayerTime.isha) + ' PM'
        })
      } else if (
        comparedTime > prayerTime.isha &&
        comparedTime <= tomorrowsPrayerTime.fajr
      ) {
        setNextPrayer({
          prayer: 'Fajr',
          time: convertTime(prayerTime.fajr) + ' AM'
        })
      } else {
        setNextPrayer({
          prayer: 'Fajr',
          time: convertTime(prayerTime.fajr) + ' AM'
        })
      }
    }
  }

  function Countdown() {
    if (currentTime != undefined) {
      useEffect(() => {
        const currentTime = moment()
        const nextPrayerMoment = moment(nextPrayer.time, 'h:mm A')

        if (nextPrayerMoment.isBefore(currentTime)) {
          nextPrayerMoment.add(1, 'days')
        }

        const intervalId = setInterval(() => {
          const currentTime = moment()
          const duration = moment.duration(nextPrayerMoment.diff(currentTime))

          setTimeLeft({
            hours: duration.hours(),
            minutes: duration.minutes(),
            seconds: duration.seconds()
          })

          // Stop the timer if the next prayer time has been reached
          if (duration.asMilliseconds() <= 0) {
            clearInterval(intervalId)
          }
        }, 1000)
      }, [])

      return (
        <div className="text-5xl">
          {timeLeft && (
            <>
              {timeLeft.hours.toString().padStart(2, '0')}:
              {timeLeft.minutes.toString().padStart(2, '0')}:
              {timeLeft.seconds.toString().padStart(2, '0')}
            </>
          )}
        </div>
      )
    }
  }

  return (
    <div className="xl:p-64 p-1">
      <div className="flex flex-col rounded-xl border bg-zinc-950 p-4 space-y-2">
        <div className="group relative rounded-xl border bg-zinc-950 p-4 text-green-400 flex flex-row items-center transition-color hover:border-green-400 overflow-hidden">
          <div className="absolute top-0 right-0 inline-block rounded-full bg-white/10 px-2 py-1 text-xs">
            <Location />
          </div>
          {/* display upcoming prayer time and name */}
          <div className="flex-1 relative z-[2] flex flex-col gap-2">
            <div className="text-xs inline-flex items-center space-x-2">
              <Calendar size={15} className="mr-1" />
              <div onClick={toggleHijriDateFormat} className="cursor-pointer">
                {isHijriDateExpanded
                  ? convertHijriDate(prayerTime.hijri)
                  : prayerTime.hijri}
                ,
              </div>
              <Clock />
            </div>
            <div className="text-gray-500 text-xs">
              Upcoming: {nextPrayer.prayer} - {nextPrayer.time}
            </div>
            <div className='flex justify-between'>
              <Countdown />
            </div>
          </div>
            
          <div className="absolute bottom-0 right-0 w-40 rounded overflow-hidden">
            <MasjidIcon className="w-40 h-40 text-gray-500 group-hover:text-green-400 opacity-[30%] group-hover:opacity-[50%] transition-all group-hover:-rotate-[15deg] relative -bottom-6 -right-2 grou-hover:scale-[120%]" />
          </div>
                  
        </div>
        <PrayerCard prayerTime={prayerTime} />
      </div>

    </div>
  )
}
