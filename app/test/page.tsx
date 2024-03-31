'use client'

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'

interface WaktuSolat {
    prayers: Array<{
        day: number,
        hijri: string,
        fajr: number,
        dhuhr: number,
        asr: number,
        maghrib: number,
        isha: number,
    }>
}

interface PrayerCardProps {
    prayerTime: {
        fajr: number,
        dhuhr: number,
        asr: number,
        maghrib: number,
        isha: number,
    }
}

const PrayerCard = ({ prayerTime }: PrayerCardProps) => {
    function SunriseIcon(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 2v8" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="m8 6 4-4 4 4" />
                <path d="M16 18a4 4 0 0 0-8 0" />
            </svg>
        )
    }

    function SunsetIcon(props) {
        return (
            <svg
                {...props}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 10V2" />
                <path d="m4.93 10.93 1.41 1.41" />
                <path d="M2 18h2" />
                <path d="M20 18h2" />
                <path d="m19.07 10.93-1.41 1.41" />
                <path d="M22 22H2" />
                <path d="m16 6-4 4-4-4" />
                <path d="M16 18a4 4 0 0 0-8 0" />
            </svg>
        )
    }

    function convertTime(time: number) {
        const date = new Date(time * 1000);
        const localTimeString = date.toLocaleTimeString();
        const parts = localTimeString.split(':');
        const timeWithoutSeconds = parts.slice(0, 2).join(':');
        return timeWithoutSeconds
    }

    return (
        <div className='grid grid-cols-5 gap-1'>
            <div className='flex rounded-xl border bg-zinc-950 p-3 flex-col gap-2 items-center justify-center'>
                <SunriseIcon className='text-gray-500' />

                <div className='inline flex text-gray-500'>
                    <div>Fajr</div>
                </div>
                <div className='text-[10px] inline flex text-center'>{convertTime(prayerTime.fajr)} am</div>
            </div>
            <div className='flex rounded-xl border bg-zinc-950 p-3 flex-col gap-2 items-center justify-center'>
                <SunriseIcon className='text-gray-500' />

                <div className='inline flex text-gray-500'>
                    <div>Dhuhr</div>
                </div>
                <div className='text-[10px] inline flex text-center'>{convertTime(prayerTime.dhuhr)} am</div>
            </div><div className='flex rounded-xl border bg-zinc-950 p-3 flex-col gap-2 items-center justify-center'>
                <SunriseIcon className='text-gray-500' />

                <div className='inline flex text-gray-500'>
                    <div>Asr</div>
                </div>
                <div className='text-[10px] inline flex text-center'>{convertTime(prayerTime.asr)} am</div>
            </div><div className='flex rounded-xl border bg-zinc-950 p-3 flex-col gap-2 items-center justify-center'>
                <SunsetIcon className='text-gray-500' />

                <div className='inline flex text-gray-500'>
                    <div>Maghrib</div>
                </div>
                <div className='text-[10px] inline flex text-center'>{convertTime(prayerTime.maghrib)} am</div>
            </div><div className='flex rounded-xl border bg-zinc-950 p-3 flex-col gap-2 items-center justify-center'>
                <SunsetIcon className='text-gray-500' />

                <div className='inline flex text-gray-500'>
                    <div>Isha</div>
                </div>
                <div className='text-[10px] inline flex text-center'>{convertTime(prayerTime.isha)} am</div>
            </div>

        </div>
    )
}

export default function TestPage() {
    const [currentTime, setCurrentTime] = useState<Date>();
    const [prayerTime, setPrayerTime] = useState({
        fajr: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0
    });
    const [nextPrayer, setNextPrayer] = useState({
        prayer: "",
        time: "",
    })

    useEffect(() => {
        getPrayerTimes()
        getNextPrayer()
    }, [])

    function Clock() {
        const [time, setTime] = useState(new Date());

        useEffect(() => {
            const timerID = setInterval(() => tick(), 1000);

            return () => {
                clearInterval(timerID);
            };
        }, []);

        const tick = () => {
            setTime(new Date());
        };

        return (
            <p className='text-gray-500 text-xs'>Now: {time.toLocaleTimeString()}</p>
        );
    }

    async function getPrayerTimes() {
        try {
            const link = 'https://api.waktusolat.app/v2/solat/SGR01';
            const response = await fetch(encodeURI(link));

            if (!response.ok) {
                throw new Error('Prayer time network response not ok.');
            }

            const prayerTimes: WaktuSolat = await response.json();
            const today = (new Date().getDate());
            const todaysData = prayerTimes.prayers.find(asd => asd.day === today);

            if (todaysData) {
                setPrayerTime({
                    fajr: todaysData.fajr,
                    isha: todaysData.isha,
                    maghrib: todaysData.maghrib,
                    asr: todaysData.asr,
                    dhuhr: todaysData.dhuhr
                })
            }

        } catch (error) {
            console.error('Error fetching prayer times:', error);
        }
    }

    function getNextPrayer() {
        setCurrentTime(new Date());

        if (currentTime != undefined) {
            const comparedTime = currentTime.getTime() / 1000;

            if (comparedTime > prayerTime.fajr && comparedTime <= prayerTime.dhuhr) {
                console.log('next is zuhur');
                setNextPrayer({ prayer: "Dhuhr", time: "asd" })

            } else if (comparedTime > prayerTime.dhuhr && comparedTime <= prayerTime.asr) {
                console.log('next is asr');
                setNextPrayer({ prayer: "asr", time: "asd" })

            } else if (comparedTime > prayerTime.asr && comparedTime <= prayerTime.maghrib) {
                console.log('next is maghrib');
                setNextPrayer({ prayer: "maghrib", time: "asd" })

            } else if (comparedTime > prayerTime.maghrib && comparedTime <= prayerTime.isha) {
                console.log('next is isha');
                setNextPrayer({ prayer: "isha", time: "asd" })

            } else if (comparedTime > prayerTime.isha && comparedTime <= new Date().setDate(new Date().getDate() + 1)) {
                console.log('next is fajr');
                setNextPrayer({ prayer: "fajr", time: "asd" })

            } else {
                console.log('next is fajr');
                setNextPrayer({ prayer: "fajr", time: "asd" })
            }
        }
    }

    return (
        <div className='xl:p-64 p-1'>
            <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
                <div className="float-right inline-block rounded-full bg-white/10 px-2 py-1 text-xs">
                    Selangor
                </div>
                <div className='space-y-3'>
                    <div className='rounded-xl border bg-zinc-950 p-4 space-y-2'>
                        {/* display upcoming prayer time and name */}
                        <p className='text-gray-500 text-xs'>Upcoming: {nextPrayer.prayer} - {nextPrayer.time}</p>
                        <p className='text-5xl'>timer here</p>
                        <Clock />
                    </div>
                    {/* <div className='flex flex-wrap space-x-4'>
                        {waktuSolat && waktuSolat.map((prayer, index) => (
                            <div key={index} className='rounded-xl border bg-zinc-950 p-8 w-full sm:w-auto'>
                                <p className='text-gray-500'>{index === 0 ? 'Fajr' : index === 1 ? 'Dhuhr' : index === 2 ? 'Asar' : index === 3 ? 'Maghrib' : 'Isyak'}</p>
                                <p>{new Date(prayer.fajr * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        ))}
                    </div> */}
                    <PrayerCard
                        prayerTime={prayerTime}
                    />

                    <div className='space-x-4'>
                        <Button variant="outline" onClick={() => getNextPrayer()}>getNextPrayer</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

