import { useState, useEffect, useCallback, useRef } from 'react'
import './EnhancedCountdown.css'

// Pre-defined deterministic data for particles (reduced for performance)
const ASH_DATA = [...Array(12)].map((_, i) => ({
  id: i,
  left: (i * 8.33 + 2) % 100,
  delay: (i * 0.45) % 5,
  duration: 4 + (i * 0.3) % 4,
  size: i % 4 === 0 ? 'fast' : i % 3 === 0 ? 'slow' : ''
}))

// Murder clue icons (Noir-standard) - simplified for performance
const CLUE_ICONS = [
  { type: 'fingerprint', icon: '👁', style: { '--rotation': '-20deg' } },
  { type: 'magnifier', icon: '🔍', style: { '--rotation': '15deg' } }
]

const EnhancedCountdown = ({
  targetTime = '2026-02-28T00:00:00',
  enableSound = false,
  onComplete
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isMounted, setIsMounted] = useState(false)
  const [showImpact, setShowImpact] = useState(false)
  const [sliceDigit, setSliceDigit] = useState(null)
  const [glitchDigit, setGlitchDigit] = useState(null)
  const [flickerDigit, setFlickerDigit] = useState(null)
  const [isShaking, setIsShaking] = useState(false)
  const previousSecond = useRef(-1)
  const audioContextRef = useRef(null)

  // Parse and validate target time
  const getTargetDate = useCallback(() => {
    try {
      const target = new Date(targetTime)
      if (isNaN(target.getTime())) {
        return new Date('2026-02-28T00:00:00')
      }
      return target
    } catch {
      return new Date('2026-02-28T00:00:00')
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

  const playTickSound = useCallback(() => {
    if (!enableSound || !audioContextRef.current) return
    try {
      const ctx = audioContextRef.current
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    } catch { }
  }, [enableSound])

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (enableSound) {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      } catch { }
    }
    return () => {
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [enableSound])

  useEffect(() => {
    const initialTime = calculateTimeLeft()
    setTimeLeft(initialTime)
    const totalSeconds = initialTime.days * 86400 + initialTime.hours * 3600 + initialTime.minutes * 60 + initialTime.seconds
    if (totalSeconds <= 0) {
      setShowImpact(true)
      onComplete?.()
    }
  }, [calculateTimeLeft, onComplete])

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft()
      setTimeLeft(newTime)
      const totalSeconds = newTime.days * 86400 + newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds

      if (newTime.seconds !== previousSecond.current && previousSecond.current !== -1) {
        playTickSound()
        setSliceDigit('seconds')
        setTimeout(() => setSliceDigit(null), 600)

        if (Math.random() > 0.4) { // Increased chance of glitching from 0.1 to 0.6
          const units = ['days', 'hours', 'minutes', 'seconds']
          setGlitchDigit(units[Math.floor(Math.random() * units.length)])
          setTimeout(() => setGlitchDigit(null), 150 + Math.random() * 400) // Erratic duration
        }

        if (totalSeconds <= 5 && totalSeconds > 0) {
          setIsShaking(true)
          setTimeout(() => setIsShaking(false), 600)
        }
      }
      previousSecond.current = newTime.seconds

      if (totalSeconds <= 0) {
        setShowImpact(true)
        onComplete?.()
        clearInterval(timer)
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft, onComplete, playTickSound])

  const timeUnits = [
    { label: 'DAYS', value: timeLeft.days, key: 'days' },
    { label: 'HOURS', value: timeLeft.hours, key: 'hours' },
    { label: 'MINS', value: timeLeft.minutes, key: 'minutes' },
    { label: 'SECS', value: timeLeft.seconds, key: 'seconds' },
  ]

  if (showImpact) {
    return (
      <div className="enhanced-countdown-wrapper">
        <div className="countdown-impact-overlay">
          <div className="impact-flash" />
          <div className="impact-message">THE MYSTERY BEGINS</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`enhanced-countdown-wrapper ${isShaking ? 'shake' : ''}`}>
      <div className="sr-only">
        {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds remaining
      </div>

      <div className="countdown-fog-container" aria-hidden="true" style={{ willChange: 'auto' }}>
        <div className="countdown-fog fog-layer-1" />
      </div>

      <div className="ashes-container" aria-hidden="true">
        {ASH_DATA.map((ash) => (
          <div
            key={ash.id}
            className={`ash-particle ${ash.size}`}
            style={{
              left: `${ash.left}%`,
              animationDelay: `${ash.delay}s`,
              animationDuration: `${ash.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="clue-icons-overlay" aria-hidden="true">
        {CLUE_ICONS.map((clue) => (
          <span
            key={clue.type}
            className={`clue-icon ${clue.type}`}
            style={clue.style}
          >
            {clue.icon}
          </span>
        ))}
      </div>

      <div className={`countdown-main ${isMounted ? 'fade-in-wrapper' : 'opacity-0'}`}>
        <div className="countdown-header-section">
          <h2 className="countdown-title scratched-text-heavy">TIME REMAINING</h2>
          <p className="countdown-subtitle scratched-text">The investigation awaits...</p>
        </div>

        <div className="countdown-timer-display">
          {timeUnits.map((unit, index) => (
            <div key={unit.key} className="countdown-unit">
              {index > 0 && <span className="countdown-separator">:</span>}
              <div className="digit-box-container">
                <div className="digit-card">
                  <span className={`digit-value ${sliceDigit === unit.key ? 'slice' : ''} ${glitchDigit === unit.key ? 'glitch' : ''} ${flickerDigit === unit.key ? 'flicker' : ''}`}>
                    {String(unit.value).padStart(2, '0')}
                  </span>
                </div>
                <span className="digit-label">{unit.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="countdown-event-date scratched-text">
          FEBRUARY 28 — MARCH 1, 2026
        </div>
      </div>
    </div>
  )
}

export default EnhancedCountdown
