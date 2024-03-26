'use client'

import React, { useEffect, useState } from 'react'

export default function TestPage() {
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
            <p className='text-5xl'>{time.toLocaleTimeString()}</p>
        );
    }

    async function getPrayerTimes() {
        const response = await fetch('https://api.waktusolat.app/v2/solat/SGR01');
        const prayerTimes = await response.json();
        console.log(prayerTimes);
    }

    return (
        <div className='p-64'>
            <div className="rounded-xl border bg-zinc-950 p-4 text-green-400">
                <div className="float-right inline-block rounded-full bg-white/10 px-2 py-1 text-xs">
                    Selangor
                </div>
                <div className='space-y-3'>
                    <div className='rounded-xl border bg-zinc-950 p-4 space-y-2'>
                        <p className='text-gray-500 text-xs'>Upcoming: Fajr - 6:07</p>
                        <Clock />
                        <p className='text-gray-500 text-xs'>Now: 12:02:25 AM</p>
                    </div>
                    <button
                        className='rounded-xl border bg-zinc-950'
                        onClick={() => getPrayerTimes()}>test me</button>
                    <div className='inline-flex space-x-4'>
                        <div className='rounded-xl border bg-zinc-950 p-8'>
                            <p >Fajr - 6:07</p>
                        </div>
                        <div className='rounded-xl border bg-zinc-950 p-8'>
                            <p >Fajr - 6:07</p>
                        </div>
                        <div className='rounded-xl border bg-zinc-950 p-8'>
                            <p >Fajr - 6:07</p>
                        </div>
                        <div className='rounded-xl border bg-zinc-950 p-8'>
                            <p >Fajr - 6:07</p>
                        </div>
                        <div className='rounded-xl border bg-zinc-950 p-8'>
                            <p >Fajr - 6:07</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

