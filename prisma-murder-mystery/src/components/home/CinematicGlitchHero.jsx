/**
 * Cinematic Glitch Title Effect - Production Optimized
 * Extracted styles to external CSS for better performance
 * Memoized computations to prevent unnecessary re-renders
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import './CinematicGlitchHero.css'

const CountdownTimer = ({ targetDate = '2026-03-13T00:00:00', className = '' }) => {
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

  const timeUnits = useMemo(() => [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: timeLeft.hours },
    { label: 'MINS', value: timeLeft.minutes },
    { label: 'SECS', value: timeLeft.seconds },
  ], [timeLeft])

  return (
    <div className={`glitch-countdown ${className}`}>
      <style>{`
        .glitch-countdown {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 30px;
        }
        
        .glitch-timer-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        
        .glitch-timer-value {
          font-family: 'Bebas Neue', 'Anton', 'Oswald', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 900;
          color: #c40000;
          background: rgba(196, 0, 0, 0.1);
          border: 1px solid rgba(196, 0, 0, 0.3);
          padding: 8px 16px;
          min-width: 60px;
          text-align: center;
          text-shadow:
            0 0 10px rgba(196, 0, 0, 0.8),
            0 0 20px rgba(196, 0, 0, 0.4);
          animation: timerGlow 2s ease-in-out infinite alternate;
          position: relative;
        }
        
        .glitch-timer-value::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(196, 0, 0, 0.2) 0%,
            transparent 50%,
            rgba(196, 0, 0, 0.1) 100%
          );
          pointer-events: none;
        }
        
        .glitch-timer-label {
          font-family: 'Bebas Neue', 'Anton', 'Oswald', sans-serif;
          font-size: clamp(0.5rem, 1.5vw, 0.75rem);
          font-weight: 400;
          color: rgba(196, 0, 0, 0.7);
          letter-spacing: 0.2em;
          margin-top: 4px;
          text-transform: uppercase;
        }
        
        .glitch-timer-separator {
          font-family: 'Bebas Neue', 'Anton', 'Oswald', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 900;
          color: #c40000;
          opacity: 0.6;
          animation: separatorBlink 1s ease-in-out infinite;
        }
        
        @keyframes timerGlow {
          0% {
            text-shadow:
              0 0 10px rgba(196, 0, 0, 0.8),
              0 0 20px rgba(196, 0, 0, 0.4);
            box-shadow: 0 0 10px rgba(196, 0, 0, 0.3);
          }
          100% {
            text-shadow:
              0 0 15px rgba(196, 0, 0, 1),
              0 0 30px rgba(196, 0, 0, 0.6);
            box-shadow: 0 0 20px rgba(196, 0, 0, 0.5);
          }
        }
        
        @keyframes separatorBlink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        
        @media (max-width: 480px) {
          .glitch-countdown {
            gap: 4px;
          }
          .glitch-timer-value {
            padding: 6px 10px;
            min-width: 45px;
          }
        }
      `}</style>

      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="glitch-timer-unit">
          <div className="glitch-timer-value">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="glitch-timer-label">{unit.label}</div>
          {index < timeUnits.length - 1 && (
            <span className="glitch-timer-separator">:</span>
          )}
        </div>
      ))}
    </div>
  )
}

const CinematicGlitchHero = ({
  text = 'PRISMA',
  className = '',
  showCountdown = false,
  targetDate = '2026-02-28T00:00:00'
}) => {
  // Memoize text splitting to prevent re-computation on every render
  const textLetters = useMemo(() => text.split(''), [text])

  // Pre-generate blood drip positions for consistent rendering
  const bloodDrips = useMemo(() => [
    { pos: 15, delay: 0, height: 25 },
    { pos: 35, delay: 2, height: 35 },
    { pos: 55, delay: 4, height: 28 },
    { pos: 75, delay: 6, height: 42 },
    { pos: 85, delay: 8, height: 30 },
  ], [])

  return (
    <div className={`glitch-hero-container ${className}`}>
      <div className="glitch-text-wrapper">
        {/* SVG Filter for Melt effect */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="melt-filter">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.1" numOctaves="2" seed="5">
              <animate attributeName="baseFrequency" dur="10s" values="0.01 0.1;0.02 0.2;0.01 0.1" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="10" />
          </filter>
        </svg>

        <h1
          className="glitch-text"
          data-text={text}
        >
          {textLetters.map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
          {/* Blood drips */}
          <div className="blood-drips">
            {bloodDrips.map((drip, i) => (
              <div
                key={i}
                className="drip"
                style={{
                  left: `${drip.pos}%`,
                  animationDelay: `${drip.delay}s`,
                  height: `${drip.height}px`
                }}
              />
            ))}
          </div>
        </h1>
        {showCountdown && (
          <CountdownTimer targetDate={targetDate} />
        )}
      </div>
    </div>
  )
}

export default CinematicGlitchHero

