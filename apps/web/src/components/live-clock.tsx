'use client'

import { useEffect, useState } from 'react'

export function LiveClock() {
    const [time, setTime] = useState<Date>(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const timeString = time.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Sao_Paulo',
        hour12: false,
    })

    const dateString = time.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Sao_Paulo',
    })

    return (
        <div className="text-right">
            <div className="text-2xl font-mono font-semibold">
                {timeString}
            </div>
            <div className="text-xs text-muted-foreground capitalize">
                {dateString}
            </div>
        </div>
    )
}