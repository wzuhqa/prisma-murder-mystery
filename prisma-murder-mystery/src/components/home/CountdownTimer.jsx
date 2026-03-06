import { useState, useEffect, useCallback } from 'react'

const CountdownTimer = ({ targetDate = '2026-03-13T00:00:00' }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const calculateTimeLeft = useCallback(() => {
    const difference = new Date(targetDate) - new Date()
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }, [targetDate])

  useEffect(() => {
    setTimeLeft(calculateTimeLeft())
  }, [calculateTimeLeft])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ]

  return (
    <div className="text-center">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-blood" />
        <span className="font-mono text-xs tracking-[4px] text-gold uppercase">
          ⏰ Time Until Case Opens
        </span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-blood" />
      </div>

      {/* Timer boxes */}
      <div className="flex items-center justify-center gap-3 md:gap-5">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-3 md:gap-5">
            <div className="relative">
              {/* Card */}
              <div className="relative bg-noir-light border border-blood/20 rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px]">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold/40" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold/40" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold/40" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold/40" />

                <span className="block font-heading text-3xl md:text-5xl font-bold text-chalk">
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="block font-mono text-[10px] md:text-xs text-fog-light tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
            </div>

            {/* Separator */}
            {index < timeUnits.length - 1 && (
              <span className="text-blood text-2xl md:text-3xl font-bold">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountdownTimer

