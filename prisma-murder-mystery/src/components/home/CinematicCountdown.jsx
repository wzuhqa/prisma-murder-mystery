import { useState, useEffect, useCallback, useRef } from 'react'
import './CinematicCountdown.css'

/**
 * Cinematic Horror Countdown Timer
 * A dark cinematic horror countdown UI with:
 * - Sleek black textured background with drifting smoke wisps
 * - Soft pulsating red ambient glow from edges
 * - Dripping red title "TIME REMAINING" with crimson drips
 * - Thin divider with tiny stopwatch icon
 * - Four glowing digital timer panels with white neon numbers
 * - Flickering intensity effect
 */
const CinematicCountdown = ({
  targetTime = '2026-03-13T00:00:00',
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [flickerPanel, setFlickerPanel] = useState(null)
  const previousSecond = useRef(-1)

  // Parse and validate target time
  const getTargetDate = useCallback(() => {
    try {
      const target = new Date(targetTime)
      if (isNaN(target.getTime())) {
        return new Date('2026-03-13T00:00:00')
      }
      return target
    } catch {
      return new Date('2026-03-13T00:00:00')
    }
  }, [targetTime])

  const calculateTimeLeft = useCallback(() => {
    const difference = getTargetDate() - new Date()
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }, [getTargetDate])

  // Initial time calculation
  useEffect(() => {
    const initialTime = calculateTimeLeft()
    setTimeLeft(initialTime)

    const totalSeconds = initialTime.days * 86400 + initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds

    if (totalSeconds <= 0) {
      onComplete?.()
    }
  }, [calculateTimeLeft, onComplete])

  // Main countdown interval
  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft()
      setTimeLeft(newTime)

      const totalSeconds = newTime.days * 86400 + newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds

      // Handle second change animations
      if (newTime.seconds !== previousSecond.current && previousSecond.current !== -1) {
        // Random flicker on one panel occasionally
        if (Math.random() > 0.65) {
          const units = ['days', 'hours', 'minutes', 'seconds']
          const randomUnit = units[Math.floor(Math.random() * units.length)]
          setFlickerPanel(randomUnit)
          setTimeout(() => setFlickerPanel(null), 150)
        }
      }
      previousSecond.current = newTime.seconds

      // Completion
      if (totalSeconds <= 0) {
        onComplete?.()
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [calculateTimeLeft, onComplete])

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, key: 'days' },
    { label: 'HOURS', value: timeLeft.hours, key: 'hours' },
    { label: 'MINS', value: timeLeft.minutes, key: 'minutes' },
    { label: 'SECS', value: timeLeft.seconds, key: 'seconds' },
  ]

  return (
    <div
      className="cinematic-countdown-wrapper"
      role="timer"
      aria-label="Countdown to event"
      aria-live="polite"
    >
      {/* Screen reader accessible description */}
      <div className="sr-only">
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds remaining
      </div>

      {/* Drifting smoke wisps */}
      <div className="smoke-wisps-container" aria-hidden="true">
        <div className="smoke-wisp" />
        <div className="smoke-wisp" />
        <div className="smoke-wisp" />
        <div className="smoke-wisp" />
      </div>

      {/* Volumetric light rays */}
      <div className="volumetric-rays" aria-hidden="true">
        <div className="volumetric-ray" />
        <div className="volumetric-ray" />
        <div className="volumetric-ray" />
        <div className="volumetric-ray" />
        <div className="volumetric-ray" />
      </div>

      {/* Main countdown content */}
      <div className="cinematic-countdown-content">
        {/* Title with blood drips */}
        <div className="countdown-title-container">
          <h2 className="cinematic-title">TIME REMAINING</h2>
          <span className="title-drip" />
          <span className="title-drip" />
        </div>

        {/* Divider with stopwatch icon */}
        <div className="cinematic-divider">
          <div className="cinematic-divider-line" />
          <span className="cinematic-divider-icon" aria-hidden="true">⏱</span>
          <div className="cinematic-divider-line" />
        </div>

        {/* Tagline */}
        <p className="cinematic-tagline">The investigation awaits…</p>

        {/* Timer display */}
        <div className="cinematic-timer-container" role="group" aria-label="Countdown timer units">
          {timeUnits.map((unit, index) => (
            <div key={unit.key} className="cinematic-timer-panel">
              {index > 0 && (
                <span className="cinematic-separator" aria-hidden="true">:</span>
              )}

              <div className="cinematic-panel-inner">
                <span
                  className={`cinematic-digit ${flickerPanel === unit.key ? 'flickering' : ''}`}
                  aria-hidden="true"
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span className="cinematic-label">{unit.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Event date */}
        <div className="cinematic-event-date">
          MARCH 13 — MARCH 14, 2026
        </div>
      </div>
    </div>
  )
}

export default CinematicCountdown

