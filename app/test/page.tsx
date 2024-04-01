'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Moon, Sun, SunMoon, Sunrise, Sunset } from 'lucide-react'
import React, { useEffect, useState } from 'react'

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
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sunrise className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Fajr</div>
          </div>
          <div className="text-[9px] inline flex text-center">
            {convertTime(prayerTime.fajr)} AM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sunrise className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Dhuhr</div>
          </div>
          <div className="text-[9px] inline flex text-center">
            {convertTime(prayerTime.dhuhr)} PM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sun className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Asr</div>
          </div>
          <div className="text-[9px] inline flex text-center">
            {convertTime(prayerTime.asr)} PM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Sunset className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Maghrib</div>
          </div>
          <div className="text-[9px] inline flex text-center">
            {convertTime(prayerTime.maghrib)} PM
          </div>
        </div>
        <div className="flex  p-3 flex-col gap-2 items-center justify-center">
          <Moon className="text-gray-500" />

          <div className="inline flex text-gray-500">
            <div>Isha</div>
          </div>
          <div className="text-[9px] inline flex text-center">
            {convertTime(prayerTime.isha)} PM
          </div>
        </div>
      </div>
    </>
  )
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

  function Countdown({ nextPrayerTime }) {
    const [remainingTime, setRemainingTime] = useState('')

    useEffect(() => {
      const targetTime = parseNextPrayerTime(nextPrayerTime)

      // Calculate initial remaining time
      const now = new Date()
      let timeDifference = targetTime.getTime() - now.getTime()
      if (timeDifference < 0) {
        targetTime.setDate(targetTime.getDate() + 1)
        timeDifference = targetTime.getTime() - now.getTime()
      }
      updateRemainingTime(timeDifference)

      // Update remaining time every second
      const timer = setInterval(() => {
        const remaining = targetTime.getTime() - new Date().getTime()
        updateRemainingTime(remaining)

        if (remaining <= 0) {
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }, [nextPrayerTime])

    const parseNextPrayerTime = timeString => {
      const [time, ampm] = timeString.split(' ')[0].split(':')
      const targetTime = new Date()
      targetTime.setHours(parseInt(time, 10) + (ampm === 'PM' ? 12 : 0))
      targetTime.setMinutes(0)
      targetTime.setSeconds(0)
      return targetTime
    }

    const updateRemainingTime = remaining => {
      const hours = Math.floor(remaining / (1000 * 60 * 60))
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000)

      setRemainingTime(`${hours}:${minutes}:${seconds}`)
    }

    return <div className="text-5xl">{remainingTime}</div>
  }

  return (
    <div className="xl:p-64 p-1">
      <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
        <div className="float-right inline-block rounded-full bg-white/10 px-2 py-1 text-xs">
          Selangor
        </div>
        <div className="rounded-xl border bg-zinc-950 p-4 space-y-2">
          {/* display upcoming prayer time and name */}
          <div className="text-xs inline-flex items-center space-x-2">
            <Calendar size={16} />
            <div>{prayerTime.hijri}, </div>
            <Clock />
          </div>
          <div className="text-gray-500 text-xs">
            Upcoming: {nextPrayer.prayer} - {nextPrayer.time}
          </div>
          {/* <Countdown nextPrayerTime={nextPrayer.time}/> */}
          <div className="text-5xl">countdown here</div>
        </div>
        <PrayerCard prayerTime={prayerTime} />
      </div>
    </div>
  )
}
