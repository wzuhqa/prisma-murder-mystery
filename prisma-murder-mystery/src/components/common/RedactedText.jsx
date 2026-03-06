import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789█▓▒░#@!%&*'

/**
 * RedactedText
 * Renders text as a redacted block. On hover, the block "decodes"
 * using a matrix-style scramble animation that progressively reveals
 * the real text character by character.
 *
 * Props:
 *   text        - the secret text to reveal
 *   className   - extra wrapper classes
 *   decodeSpeed - ms between each character lock-in (default: 40)
 */
const RedactedText = ({
  text = 'CLASSIFIED',
  className = '',
  decodeSpeed = 40,
}) => {
  const [displayed, setDisplayed] = useState(() => '█'.repeat(text.length))
  const [isDecoding, setIsDecoding] = useState(false)
  const intervalRef = useRef(null)
  const lockedRef = useRef(0)
  const frameRef = useRef(null)

  const startDecode = () => {
    if (isDecoding) return
    setIsDecoding(true)
    lockedRef.current = 0

    // Rapid random scramble ticker
    const scramble = () => {
      setDisplayed(
        text
          .split('')
          .map((char, i) => {
            if (i < lockedRef.current) return char
            if (char === ' ') return ' '
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join('')
      )
      frameRef.current = requestAnimationFrame(scramble)
    }
    frameRef.current = requestAnimationFrame(scramble)

    // Lock in characters one by one
    intervalRef.current = setInterval(() => {
      lockedRef.current += 1
      if (lockedRef.current >= text.length) {
        clearInterval(intervalRef.current)
        cancelAnimationFrame(frameRef.current)
        setDisplayed(text)
      }
    }, decodeSpeed)
  }

  const stopDecode = () => {
    setIsDecoding(false)
    clearInterval(intervalRef.current)
    cancelAnimationFrame(frameRef.current)
    lockedRef.current = 0
    setDisplayed('█'.repeat(text.length))
  }

  // Cleanup on unmount
  useEffect(() => () => {
    clearInterval(intervalRef.current)
    cancelAnimationFrame(frameRef.current)
  }, [])

  const isRevealed = displayed === text

  return (
    <span
      className={`relative inline-block group cursor-crosshair ${className}`}
      onMouseEnter={startDecode}
      onMouseLeave={stopDecode}
    >
      {/* Redacted block */}
      <span
        className="font-mono text-sm tracking-widest transition-colors duration-150"
        style={{
          color: isRevealed ? '#e8c87a' : '#1a1a1a',
          background: isRevealed ? 'rgba(139, 90, 0, 0.15)' : '#1a1a1a',
          padding: '0.1em 0.4em',
          borderRadius: '2px',
          textShadow: isRevealed ? '0 0 8px rgba(232,200,122,0.4)' : 'none',
          letterSpacing: isRevealed ? '0.05em' : '0.1em',
          border: isDecoding && !isRevealed ? '1px solid rgba(196,30,58,0.4)' : '1px solid transparent',
          transition: 'border-color 0.1s ease',
        }}
      >
        {displayed}
      </span>

      {/* Redacted stamp overlay (hidden when decoding) */}
      {!isDecoding && (
        <span
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transform: 'rotate(-12deg)', opacity: 0.5 }}
        >
          <span
            className="font-mono text-[0.5rem] text-red-700 border border-red-700 px-1 uppercase tracking-[0.2em]"
          >
            REDACTED
          </span>
        </span>
      )}

      {/* Hover hint */}
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.5rem] text-red-800/60 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        DECRYPTING…
      </span>
    </span>
  )
}

export default RedactedText

