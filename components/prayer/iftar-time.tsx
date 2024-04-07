'use client'

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Clock } from 'lucide-react';

interface WaktuMaghrib {
    prayers: Array<{
        day: number;
        maghrib: number;
    }>;
}

export function IftarTime() {
    const [iftarTime, setIftarTime] = useState<{ maghrib: number } | null>(null);
    const [remainingTime, setRemainingTime] = useState<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        async function fetchIftarTime() {
            try {
                const response = await fetch('https://api.waktusolat.app/v2/solat/SGR01');
                const data: WaktuMaghrib = await response.json();
                const today = new Date().getDate();
                const todaysData = data.prayers.find(array => array.day === today);

                if (todaysData) {
                    setIftarTime({
                        maghrib: todaysData.maghrib,
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchIftarTime();
    }, []);

    useEffect(() => {
        if (iftarTime) {
            const iftarDate = new Date(iftarTime.maghrib * 1000);
            const iftarTimeInMinutes = iftarDate.getHours() * 60 + iftarDate.getMinutes();
            const currentTimeInMinutes = new Date().getHours() * 60 + new Date().getMinutes();

            const differenceInMinutes = iftarTimeInMinutes - currentTimeInMinutes;

            if (differenceInMinutes > 0) {
                let remainingHours = Math.floor(differenceInMinutes / 60);
                let remainingMinutes = differenceInMinutes % 60;

                if (remainingHours > 0 && remainingMinutes > 0) {
                    setRemainingTime(`Remaining ${remainingHours} hour${remainingHours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);
                } else if (remainingHours > 0) {
                    setRemainingTime(`Remaining ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`);
                } else {
                    setRemainingTime(`Remaining ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`);
                }

                intervalRef.current = setInterval(() => {
                    setRemainingTime((prevRemainingTime) => {
                        if (!prevRemainingTime) return null;

                        const [remainingHoursStr, remainingMinutesStr] = prevRemainingTime.split(' and ');
                        const remainingHoursNum = remainingHoursStr ? Number(remainingHoursStr.split(' ')[0]) : 0;
                        const remainingMinutesNum = remainingMinutesStr ? Number(remainingMinutesStr.split(' ')[0]) : 0;

                        if (remainingMinutesNum > 0) {
                            const newRemainingMinutes = remainingMinutesNum - 1;
                            if (newRemainingMinutes >= 0) {
                                return `Remaining ${remainingHoursNum} hour${remainingHoursNum > 1 ? 's' : ''} and ${newRemainingMinutes} minute${newRemainingMinutes > 1 ? 's' : ''}`;
                            } else {
                                return `Remaining ${remainingHoursNum - 1} hour${(remainingHoursNum - 1) > 1 ? 's' : ''} and 59 minutes`;
                            }
                        } else {
                            const newRemainingHours = remainingHoursNum - 1;
                            if (newRemainingHours >= 0) {
                                return `Remaining ${newRemainingHours} hour${newRemainingHours > 1 ? 's' : ''}`;
                            } else {
                                clearInterval(intervalRef.current);
                                return 'Iftar time is now';
                            }
                        }
                    });
                }, 60000);
            } else {
                setRemainingTime('Iftar time has passed');
            }
        }


        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [iftarTime]);

    if (!iftarTime) {
        return <div>Iftar time not found.</div>;
    }
    function convertTime(time: number) {
        const date = new Date(time * 1000)
        const localTimeString = date.toLocaleTimeString()
        const parts = localTimeString.split(':')
        const timeWithoutSeconds = parts.slice(0, 2).join(':')
        return timeWithoutSeconds
    }

    return (
        <Card className="text-green-400">
            <CardHeader>
                <div className='flex items-center gap-2'>
                    <Clock size={16} />
                    <CardTitle>Iftar Time</CardTitle>
                </div>
                <CardDescription>Time to break the fast.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                <div className="grid gap-2 text-center">
                    <div className="text-7xl font-bold">{convertTime(iftarTime.maghrib)} pm</div>
                    <div className="text-sm text-muted-foreground tracking-wide">{remainingTime}</div>
                </div>
            </CardContent>
        </Card>
    );
}
