import { useState, useEffect, useCallback } from 'react'
import { ForensicScannerContext, useForensicScanner } from '../../context/ForensicScannerContext'
import { motion, AnimatePresence } from 'framer-motion'

// Scanning reticle cursor component - optimized with CSS animation instead of JS interval
const ScanningReticle = ({ x, y, isActive }) => {
  return (
    <motion.div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: x - 40,
        top: y - 40,
        mixBlendMode: 'difference'
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : 0.5
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Outer ring */}
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Rotating outer segments - CSS animation via style */}
        <g
          style={{
            transformOrigin: 'center',
            animation: isActive ? 'reticle-rotate 3s linear infinite' : 'none'
          }}
        >
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="8 4"
            opacity="0.8"
          />
        </g>

        {/* Crosshairs */}
        <line x1="40" y1="8" x2="40" y2="20" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="40" y1="60" x2="40" y2="72" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="8" y1="40" x2="20" y2="40" stroke="#ef4444" strokeWidth="1.5" />
        <line x1="60" y1="40" x2="72" y2="40" stroke="#ef4444" strokeWidth="1.5" />

        {/* Center dot */}
        <circle cx="40" cy="40" r="3" fill="#ef4444">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Corner brackets */}
        <path d="M20 12 L12 12 L12 20" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M60 12 L68 12 L68 20" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M20 68 L12 68 L12 60" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M60 68 L68 68 L68 60" fill="none" stroke="#ef4444" strokeWidth="2" />
      </svg>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 70%)',
          transform: 'scale(1.5)'
        }}
      />
    </motion.div>
  )
}

// Spotlight effect that reveals hidden content
const SpotlightReveal = ({ x, y, children, radius = 150 }) => {
  return (
    <div
      className="relative"
      style={{
        maskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, transparent 100%)`,
        WebkitMaskImage: `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 0%, transparent 100%)`,
      }}
    >
      {children}
    </div>
  )
}

// Click ripple effect
const ClickRipple = ({ x, y, id, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => onComplete(id), 600)
    return () => clearTimeout(timer)
  }, [id, onComplete])

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998]"
      style={{
        left: x - 100,
        top: y - 100
      }}
      initial={{
        width: 0,
        height: 0,
        opacity: 0.8
      }}
      animate={{
        width: 200,
        height: 200,
        opacity: 0,
        scale: [1, 1.5]
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle
          cx="100" cy="100" r="95"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="10 5"
        />
        <circle
          cx="100" cy="100" r="70"
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          opacity="0.5"
        />
        <circle
          cx="100" cy="100" r="45"
          fill="none"
          stroke="#ef4444"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>
    </motion.div>
  )
}

// Interactive element wrapper with pulse highlight
export const ForensicInteractive = ({
  children,
  onClick,
  isRevealed = false,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Red pulse highlight on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.1, 1.2]
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.8,
              repeat: Infinity
            }}
            className="absolute inset-0 rounded pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
              boxShadow: '0 0 20px rgba(239,68,68,0.5), inset 0 0 20px rgba(239,68,68,0.2)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Content with optional reveal */}
      <div className={isRevealed ? '' : 'blur-sm opacity-30'}>
        {children}
      </div>

      {/* Reveal glow when revealed */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            boxShadow: '0 0 30px rgba(239,68,68,0.3), inset 0 0 15px rgba(239,68,68,0.1)'
          }}
        />
      )}

      {/* Click indicator */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  )
}

// Scanner provider component
export const ForensicScannerProvider = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isActive, setIsActive] = useState(true)
  const [ripples, setRipples] = useState([])
  const [revealedElements, setRevealedElements] = useState(new Set())
  const [isOverInteractive, setIsOverInteractive] = useState(false)

  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY })

    // Check if hovering over interactive elements
    const target = e.target
    const isInteractive = target && (
      target.closest('button, [role="button"], a, input, select, textarea, label, [tabindex]') !== null
    )
    setIsOverInteractive(isInteractive)
  }, [])

  const handleClick = useCallback((e) => {
    // Skip ripple effect when clicking on buttons or interactive elements
    const target = e.target
    const isInteractive = target && (
      target.closest('button, [role="button"], a, input, select, textarea, label, [tabindex]') !== null
    )

    if (isInteractive) return

    const newRipple = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    }
    setRipples(prev => [...prev, newRipple])
  }, [])

  const removeRipple = useCallback((id) => {
    setRipples(prev => prev.filter(r => r.id !== id))
  }, [])

  const revealElement = useCallback((id) => {
    setRevealedElements(prev => new Set([...prev, id]))
  }, [])

  const isElementRevealed = useCallback((id) => {
    return revealedElements.has(id)
  }, [revealedElements])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
    }
  }, [handleMouseMove, handleClick])

  const value = {
    mousePosition,
    isActive,
    setIsActive,
    revealElement,
    isElementRevealed,
    ripples,
    removeRipple
  }

  return (
    <ForensicScannerContext.Provider value={value}>
      <ScanningReticle
        x={mousePosition.x}
        y={mousePosition.y}
        isActive={isActive && !isOverInteractive}
      />

      {/* Render ripples */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <ClickRipple
            key={ripple.id}
            id={ripple.id}
            x={ripple.x}
            y={ripple.y}
            onComplete={removeRipple}
          />
        ))}
      </AnimatePresence>

      {/* Spotlight overlay - hidden when over interactive elements */}
      {!isOverInteractive && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: `radial-gradient(circle 180px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.85) 100%)`
          }}
        />
      )}

      {children}
    </ForensicScannerContext.Provider>
  )
}

// Hidden content that reveals on hover
export const ForensicHiddenContent = ({
  id,
  children,
  className = ''
}) => {
  const { isElementRevealed } = useForensicScanner()
  const [isHovered, setIsHovered] = useState(false)

  const isRevealed = isElementRevealed(id) || isHovered

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        filter: isRevealed ? 'none' : 'blur(8px)',
        opacity: isRevealed ? 1 : 0.15,
        transition: 'filter 0.5s ease, opacity 0.5s ease'
      }}
    >
      {/* Reveal glow */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          className="absolute inset-0 rounded pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)'
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

// Evidence marker that pulses when scannable
export const EvidenceMarker = ({
  id,
  label,
  description,
  onClick,
  position = 'top'
}) => {
  const { revealElement, isElementRevealed, mousePosition } = useForensicScanner()
  const [isHovered, setIsHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const isRevealed = isElementRevealed(id)

  const handleClick = () => {
    revealElement(id)
    onClick?.()
  }

  // Calculate distance to mouse for proximity reveal
  const [elementPos, setElementPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleResize = () => {
      const element = document.getElementById(`evidence-${id}`)
      if (element) {
        const rect = element.getBoundingClientRect()
        setElementPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [id])

  // Auto-reveal when mouse is close
  const distance = Math.sqrt(
    Math.pow(mousePosition.x - elementPos.x, 2) +
    Math.pow(mousePosition.y - elementPos.y, 2)
  )

  const isProximityRevealed = distance < 120

  const finalRevealed = isRevealed || isProximityRevealed || isHovered

  return (
    <motion.div
      id={`evidence-${id}`}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulsing marker */}
      <motion.div
        className="cursor-pointer"
        animate={{
          boxShadow: finalRevealed
            ? '0 0 20px rgba(239,68,68,0.8), 0 0 40px rgba(239,68,68,0.4)'
            : '0 0 10px rgba(239,68,68,0.3)'
        }}
      >
        {/* Marker circle */}
        <motion.div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: finalRevealed ? '#ef4444' : '#991b1b',
            background: finalRevealed ? 'rgba(239,68,68,0.3)' : 'rgba(0,0,0,0.5)'
          }}
          animate={{
            borderColor: isHovered ? '#ef4444' : finalRevealed ? '#ef4444' : '#991b1b'
          }}
        >
          {/* Inner dot */}
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{
              scale: isHovered ? [1, 1.5, 1] : 1,
              opacity: isHovered ? 1 : 0.7
            }}
            transition={{
              duration: 0.5,
              repeat: isHovered ? Infinity : 0
            }}
          />
        </motion.div>

        {/* Scan ring */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full border border-red-500/50"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Label */}
      <motion.div
        className={`absolute left-10 top-0 whitespace-nowrap pointer-events-none ${position === 'top' ? '-top-2' : position === 'bottom' ? 'top-6' : ''
          }`}
        initial={{ opacity: 0, x: -10 }}
        animate={{
          opacity: isHovered || finalRevealed ? 1 : 0.7,
          x: 0
        }}
      >
        <span className="font-mono text-xs text-red-400 tracking-wider">
          {label}
        </span>
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-12 top-6 z-50 max-w-xs p-3 bg-black/90 border border-red-500/30 rounded"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <p className="font-mono text-xs text-red-300">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Default export is the provider
export default ForensicScannerProvider

