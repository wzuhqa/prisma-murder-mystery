import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Import luxury easing system
import {
  LUXURY_EASE,
  ELEGANT_ENTER,
  SILK_SMOOTH,
  MOMENTUM,
  TIMING,
  MOTION_TRANSITIONS
} from '../../utils/luxuryEasing'

// Film grain overlay component - heavy noir style
const FilmGrain = () => (
  <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-40">
    <div className="absolute inset-0 film-grain" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      animation: 'filmGrain 0.5s steps(10) infinite'
    }} />
  </div>
)

// Vignette overlay for dramatic framing
const VignetteOverlay = () => (
  <div
    className="absolute inset-0 pointer-events-none z-40"
    style={{
      background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
      animation: 'vignettePulse 4s ease-in-out infinite'
    }}
  />
)

// CSS-based rain effect - much more performant than 180 individual Framer Motion elements
// Uses CSS animations with pseudo-elements and keyframes
const RainEffect = ({ intensity = 1 }) => {
  // Reduce intensity for better performance
  const actualIntensity = Math.min(intensity, 0.7)

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none rain-container"
      style={{
        '--rain-intensity': actualIntensity,
        opacity: actualIntensity
      }}
    >
      {/* CSS-animated rain layers - see index.css for keyframes */}
      <div className="rain-layer rain-layer-1" />
      <div className="rain-layer rain-layer-2" />
      <div className="rain-layer rain-layer-3" />
    </div>
  )
}

// Puddle reflection effect
const PuddleReflections = () => (
  <div className="absolute bottom-0 inset-x-0 h-1/3 pointer-events-none overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-midnight/90 via-midnight/50 to-transparent" />
    {/* Animated puddle ripples */}
    {[...Array(8)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full border border-amber-500/10"
        style={{
          left: `${10 + i * 12}%`,
          bottom: `${(i * 1.43) % 20}%`,
          width: 40 + (i * 4.3) % 60,
          height: 8 + (i * 0.86) % 12
        }}
        animate={{
          scaleX: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 3 + (i * 0.14) % 2,
          repeat: Infinity,
          delay: i * 0.5
        }}
      />
    ))}
  </div>
)



// Neon sign component
const NeonSign = ({ position }) => {
  return (
    <div className={`absolute ${position} pointer-events-none`}>
      <motion.div
        className="text-red-500 font-heading text-2xl tracking-widest"
        style={{
          textShadow: '0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 40px #ff0000, 0 0 80px #ff0000',
          animation: 'neonFlicker 5s infinite'
        }}
      >
        BAR
      </motion.div>
      {/* Neon glow container */}
      <motion.div
        className="absolute -inset-4 rounded blur-xl bg-red-500/20"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  )
}

// Enhanced fog layer with drift
const NoirFog = ({ layer = 1 }) => {
  const style = {
    animationDuration: `${12 + layer * 8}s`,
    animationDelay: `${layer * -4}s`,
    opacity: 0.12 - layer * 0.02,
    height: layer === 1 ? '40%' : '25%',
    bottom: layer === 1 ? '20%' : '35%'
  }

  return (
    <motion.div
      className="absolute inset-x-0 bg-gradient-to-r from-transparent via-gray-500/30 to-transparent fog-layer"
      style={style}
      animate={{
        x: ['-20%', '20%'],
        opacity: [style.opacity * 0.5, style.opacity, style.opacity * 0.5]
      }}
      transition={{
        duration: parseFloat(style.animationDuration),
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

// Cobblestone street background with parallax
const CobblestoneStreet = () => (
  <div className="absolute inset-0 pointer-events-none">
    {/* Background layer - far buildings silhouette */}
    <motion.div
      className="absolute inset-0 opacity-30"
      style={{
        background: `linear-gradient(180deg, 
          transparent 0%, 
          #0a0a15 30%,
          #0f0f1a 100%)`
      }}
      animate={{ y: [0, 3, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    />
    {/* Building silhouettes */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bottom-1/3 bg-black"
        style={{
          left: `${i * 18 - 5}%`,
          width: `${15 + (i * 0.71) % 10}%`,
          height: `${30 + (i * 1.79) % 25}%`,
          opacity: 0.4
        }}
        animate={{
          y: [0, 2, 0],
          x: [0, 1, 0]
        }}
        transition={{
          duration: 6 + i,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: i * 0.5
        }}
      />
    ))}
    {/* Street surface */}
    <div
      className="absolute bottom-0 inset-x-0 h-1/3"
      style={{
        background: `repeating-linear-gradient(
          90deg,
          #1a1a24 0px,
          #1a1a24 8px,
          #151520 8px,
          #151520 16px
        )`
      }}
    />
  </div>
)

// Wet pavement reflection
const WetPavement = () => (
  <div className="absolute bottom-0 inset-x-0 h-1/3 pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
    {/* Reflection lines */}
    <div className="absolute inset-0" style={{
      background: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(100,120,150,0.03) 2px,
        rgba(100,120,150,0.03) 4px
      )`,
      animation: 'rainRipple 3s ease-in-out infinite'
    }} />
  </div>
)

// Magnifying glass with zoom effect and spin animation
const NoirMagnifyingGlass = ({ isActive, zoomLevel: _zoomLevel = 0 }) => {
  return (
    <motion.div
      animate={{
        rotate: isActive ? 360 : 0,
        scale: isActive ? [1, 1.2, 1.15, 1.25, 1] : 1
      }}
      transition={{
        rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
        scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }
      }}
      className="relative w-48 h-48"
    >
      {/* Outer frame */}
      <div className="absolute inset-0 rounded-full border-4 border-amber-600/80 shadow-[0_0_40px_rgba(255,150,50,0.4)]" />

      {/* Glass lens with sepia tint */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-900/20 via-midnight/60 to-blue-900/30 overflow-hidden border border-amber-500/30">
        {/* Lens reflection */}
        <div className="absolute top-3 left-4 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full" />

        {/* Wet surface shimmer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Handle */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-5 h-24 bg-gradient-to-b from-amber-700 to-amber-900 rounded-sm origin-top"
        animate={{
          rotate: isActive ? [0, 3, -3, 0] : 0,
          scaleY: isActive ? [1, 1.02, 0.98, 1] : 1
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Glow halo */}
      <div className="absolute -inset-6 rounded-full bg-amber-500/10 blur-2xl" />
    </motion.div>
  )
}

// Clue: Muddy footprints with enhanced animation
const MuddyFootprint = ({ isRevealed, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -80, scale: 0.6 }}
    animate={isRevealed ? {
      opacity: [0, 0.9, 0.7],
      x: [0, 40, 100],
      scale: [0.4, 1.15, 1]
    } : {}}
    transition={{
      duration: 2.5,
      delay,
      times: [0, 0.3, 1],
      ease: 'easeOut'
    }}
    className="absolute"
  >
    <svg viewBox="0 0 80 120" className="w-20 h-28">
      {/* Footprint sole */}
      <ellipse cx="40" cy="30" rx="14" ry="18" fill="currentColor" className="text-amber-900/80" />
      <ellipse cx="40" cy="30" rx="10" ry="14" fill="currentColor" className="text-amber-950" />
      {/* Toes */}
      <circle cx="28" cy="58" r="5" fill="currentColor" className="text-amber-900/80" />
      <circle cx="40" cy="55" r="5.5" fill="currentColor" className="text-amber-900/80" />
      <circle cx="52" cy="58" r="5" fill="currentColor" className="text-amber-900/80" />
      <circle cx="24" cy="72" r="4" fill="currentColor" className="text-amber-900/70" />
      <circle cx="36" cy="70" r="4.5" fill="currentColor" className="text-amber-900/70" />
      <circle cx="48" cy="72" r="4" fill="currentColor" className="text-amber-900/70" />
      <circle cx="60" cy="74" r="3.5" fill="currentColor" className="text-amber-900/60" />
      {/* Mud splatter */}
      <circle cx="25" cy="25" r="3" fill="currentColor" className="text-amber-800/50" />
      <circle cx="55" cy="35" r="2" fill="currentColor" className="text-amber-800/50" />
    </svg>
    {/* Wet mud shine */}
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 1.5, delay: delay + 1, repeat: Infinity }}
    />
  </motion.div>
)

// Clue: Chrome revolver with metallic shimmer
const ChromeRevolver = ({ isRevealed, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
    animate={isRevealed ? {
      opacity: [0, 1, 0.95],
      scale: [0.2, 1.25, 1],
      rotate: [0, -8, 0]
    } : {}}
    transition={{
      duration: 2.5,
      delay,
      times: [0, 0.4, 1],
      ease: 'easeOut'
    }}
    className="absolute"
  >
    <svg viewBox="0 0 140 70" className="w-36 h-18">
      {/* Barrel */}
      <rect x="10" y="22" width="100" height="14" rx="2" fill="currentColor" className="text-gray-400" />
      <rect x="15" y="24" width="90" height="10" rx="1" fill="currentColor" className="text-gray-300" />
      {/* Cylinder */}
      <circle cx="35" cy="29" r="16" fill="currentColor" className="text-gray-500" />
      <circle cx="35" cy="29" r="12" fill="currentColor" className="text-gray-400" />
      {/* Cylinder chambers */}
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={35 + Math.cos(i * Math.PI / 2.5 - Math.PI / 5) * 8}
          cy={29 + Math.sin(i * Math.PI / 2.5 - Math.PI / 5) * 8}
          r="4"
          fill="currentColor"
          className="text-gray-600"
        />
      ))}
      {/* Trigger guard */}
      <path d="M55 35 Q70 55 85 35" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-500" />
      {/* Trigger */}
      <rect x="58" y="38" width="10" height="8" rx="1" fill="currentColor" className="text-gray-400" />
      {/* Pearl grip */}
      <ellipse cx="95" cy="29" rx="24" ry="12" fill="currentColor" className="text-amber-100" />
      <ellipse cx="95" cy="29" rx="20" ry="9" fill="currentColor" className="text-amber-50" />
      {/* Grip texture lines */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={82 + i * 5} y1={24} x2={82 + i * 5} y2={34}
          stroke="currentColor" strokeWidth="0.5"
          className="text-amber-200/50"
        />
      ))}
      {/* Metallic shimmer */}
      <motion.rect
        x="20" y="26" width="70" height="3"
        fill="currentColor" className="text-white/70"
        style={{
          background: 'linear-gradient(90deg, transparent, white, transparent)',
          backgroundSize: '200% 100%',
          animation: 'metallicShimmer 2s linear infinite'
        }}
      />
      {/* Barrel highlight */}
      <motion.rect
        x="12" y="24" width="96" height="2"
        fill="currentColor" className="text-white/40"
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  </motion.div>
)

// Clue: Burning cigarette with smoke
const BurningCigarette = ({ isRevealed, delay }) => {
  const smokeParticles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.25
    })), []
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isRevealed ? { opacity: [0, 1], y: 0 } : {}}
      // Using ELEGANT_ENTER for dramatic reveal with smooth deceleration
      transition={{
        duration: 1.8,
        delay,
        ease: [0.22, 1, 0.36, 1]  // Matches ELEGANT_ENTER bezier
      }}
      className="absolute"
    >
      <svg viewBox="0 0 60 90" className="w-14 h-22">
        {/* Cigarette body */}
        <rect x="20" y="35" width="20" height="55" rx="2" fill="currentColor" className="text-amber-100" />
        <rect x="22" y="37" width="16" height="51" rx="1" fill="currentColor" className="text-white" />
        {/* Filter tip */}
        <rect x="20" y="68" width="20" height="22" rx="2" fill="currentColor" className="text-amber-200" />
        {/* Burning ember */}
        <motion.circle
          cx="30" cy="35" r="5"
          fill="currentColor" className="text-orange-500"
          animate={{
            r: [4, 6, 5],
            opacity: [0.8, 1, 0.9]
          }}
          transition={{ duration: 0.4, repeat: Infinity }}
        />
        <motion.circle
          cx="30" cy="35" r="2.5"
          fill="currentColor" className="text-yellow-400"
          animate={{ opacity: [0.5, 1, 0.6] }}
          transition={{ duration: 0.25, repeat: Infinity }}
        />
        {/* Smoke */}
        {smokeParticles.map((particle) => (
          <motion.circle
            key={`smoke-${particle?.id ?? 'default'}`}
            cx={30 + Math.sin(particle?.id ?? 0) * 6}
            initial={{ cy: 30, r: 2, opacity: 0 }}
            animate={{
              cy: [30, -25 - (particle?.id ?? 0) * 4],
              cx: [30, 30 + Math.sin((particle?.id ?? 0) * 0.6) * 18],
              r: [2, 5 + (particle?.id ?? 0) * 0.5],
              opacity: [0, 0.5, 0]
            }}
            transition={{
              duration: 3.5 + (particle?.id ?? 0) * 0.3,
              delay: particle?.delay ?? 0,
              repeat: Infinity,
              ease: 'easeOut'
            }}
            fill="currentColor"
            className="text-gray-400/40"
          />
        ))}
      </svg>
    </motion.div>
  )
}

// Clue: Scattered evidence papers
const EvidencePapers = ({ isRevealed, delay }) => {
  const papers = useMemo(() =>
    [
      { id: 1, rotation: -15, x: -120, y: -40, width: 60, height: 80 },
      { id: 2, rotation: 20, x: 100, y: -60, width: 55, height: 70 },
      { id: 3, rotation: -8, x: -80, y: 50, width: 50, height: 65 },
      { id: 4, rotation: 12, x: 80, y: 30, width: 45, height: 60 },
    ], []
  )

  return (
    <div className="absolute inset-0 pointer-events-none">
      {papers.map((paper, idx) => (
        <motion.div
          key={paper.id}
          initial={{
            opacity: 0,
            scale: 0.3,
            rotate: paper.rotation * 2,
            x: paper.x * 2,
            y: paper.y * 2
          }}
          animate={isRevealed ? {
            opacity: [0, 0.85, 0.7],
            scale: [0.2, 1.1, 1],
            rotate: [paper.rotation * 1.5, paper.rotation],
            x: [paper.x * 1.5, paper.x],
            y: [paper.y * 1.5, paper.y]
          } : {}}
          transition={{
            duration: 2,
            delay: delay + idx * 0.3,
            times: [0, 0.4, 1],
            ease: 'easeOut'
          }}
          className="absolute"
          style={{
            left: '50%',
            top: '50%',
            width: paper.width,
            height: paper.height,
            marginLeft: paper.x,
            marginTop: paper.y,
            background: '#f5f0e0',
            transform: `rotate(${paper.rotation}deg)`
          }}
        >
          {/* Paper content lines */}
          <div className="p-2 space-y-1">
            <div className="h-0.5 bg-gray-300 w-full" style={{ width: '75%' }} />
            <div className="h-0.5 bg-gray-200 w-full" style={{ width: '60%' }} />
            <div className="h-0.5 bg-gray-300 w-full" style={{ width: '80%' }} />
            <div className="h-0.5 bg-gray-200 w-full" style={{ width: '65%' }} />
          </div>
          {/* Paper edge highlight */}
          <motion.div
            className="absolute inset-0 border border-amber-100/30"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Dramatic spotlight effect for clue reveal
const DramaticSpotlight = ({ isActive, position }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={`absolute ${position} pointer-events-none`}
        style={{
          clipPath: 'circle(0% at 50% 50%)',
          animation: 'dramaticSpotlight 2s ease-out forwards'
        }}
      >
        <div
          className="w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(220, 20, 60, 0.4) 0%, rgba(220, 20, 60, 0.2) 40%, transparent 70%)',
            filter: 'blur(25px)'
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
)

// Simple spotlight for clues
const Spotlight = ({ isActive, position }) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className={`absolute ${position} pointer-events-none`}
      >
        <div
          className="w-72 h-72 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,180,80,0.35) 0%, rgba(255,150,50,0.15) 40%, transparent 70%)',
            filter: 'blur(20px)'
          }}
        />
      </motion.div>
    )}
  </AnimatePresence>
)

// Main Noir Loading Screen with loop capability
const CinematicLoader = ({ onComplete, autoLoop = true, loopDelay = 5000 }) => {
  const [phase, setPhase] = useState('anticipation') // anticipation, reveal, fade
  const onCompleteCalledRef = useRef(false) // Guard against multiple onComplete calls
  const [progress, setProgress] = useState(0)
  const [isFading, setIsFading] = useState(false)
  const [currentClue, setCurrentClue] = useState(0)
  const [showClue, setShowClue] = useState(false)
  const [loopCount, setLoopCount] = useState(0)
  const [, setIsReady] = useState(false)

  // Reset for looping
  const resetPhase = useCallback(() => {
    setPhase('anticipation')
    setCurrentClue(0)
    setShowClue(false)
    setIsFading(false)
    setLoopCount(prev => prev + 1)
  }, [])

  // Phase timing: 3-4s anticipation, then reveal
  useEffect(() => {
    if (phase === 'anticipation') {
      const timer = setTimeout(() => {
        setPhase('reveal')
        setShowClue(true)
      }, 3000 + Math.random() * 1000)
      return () => clearTimeout(timer)
    }
  }, [phase, loopCount])

  // Clue reveal sequence with dramatic pauses
  useEffect(() => {
    if (phase === 'reveal' && showClue) {
      const revealTimer1 = setTimeout(() => {
        setCurrentClue(1)
      }, 600)

      const revealTimer2 = setTimeout(() => {
        setCurrentClue(2)
      }, 1400)

      const revealTimer3 = setTimeout(() => {
        setCurrentClue(3)
      }, 2200)

      const fadeTimer = setTimeout(() => {
        setPhase('fade')
        setIsFading(true)
      }, 3500)

      return () => {
        clearTimeout(revealTimer1)
        clearTimeout(revealTimer2)
        clearTimeout(revealTimer3)
        clearTimeout(fadeTimer)
      }
    }
  }, [phase, showClue, loopCount])

  // Loop restart or complete
  useEffect(() => {
    if (phase === 'fade' && isFading) {
      if (autoLoop) {
        const loopTimer = setTimeout(() => {
          resetPhase()
        }, loopDelay)
        return () => clearTimeout(loopTimer)
      } else {
        const completeTimer = setTimeout(() => {
          // Guard against multiple onComplete calls (React 18 Strict Mode)
          if (!onCompleteCalledRef.current) {
            onCompleteCalledRef.current = true
            onComplete()
          }
        }, 1500)
        return () => clearTimeout(completeTimer)
      }
    }
  }, [phase, isFading, autoLoop, loopDelay, onComplete, resetPhase])

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 100
        }
        return prev + Math.random() * 2 + 0.5
      })
    }, 50)
    return () => clearInterval(interval)
  }, [loopCount])

  // Mark as ready after initial mount
  useEffect(() => {
    const readyTimer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(readyTimer)
  }, [])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden bg-midnight"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Vignette overlay */}
        <VignetteOverlay />

        {/* Sepia color grading overlay */}
        <div className="absolute inset-0 pointer-events-none z-40 mix-blend-overlay"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(60,40,20,0.25) 0%, rgba(30,20,10,0.5) 100%)'
          }}
        />

        {/* Selective color: deep red highlights */}
        <div className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: 'radial-gradient(circle at 25% 75%, rgba(100,0,0,0.2) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(80,0,0,0.15) 0%, transparent 35%)'
          }}
        />

        {/* Cold blue shadows */}
        <div className="absolute inset-0 pointer-events-none z-20"
          style={{
            background: 'linear-gradient(180deg, rgba(15,25,45,0.5) 0%, rgba(8,12,20,0.7) 100%)'
          }}
        />

        {/* Atmospheric Mist Layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-19"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{
            background: 'radial-gradient(ellipse at 30% 70%, rgba(80,80,100,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(60,60,90,0.1) 0%, transparent 45%)',
            filter: 'blur(20px)',
          }}
        />

        {/* Moving Mist Streams */}
        <div className="absolute inset-0 pointer-events-none z-18 overflow-hidden">
          <motion.div
            animate={{ x: ['-5%', '5%', '-5%'] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              top: '20%',
              left: '-10%',
              width: '150%',
              height: '40%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(70,70,90,0.04) 20%, rgba(90,80,100,0.03) 40%, rgba(70,70,90,0.04) 60%, transparent 100%)',
              filter: 'blur(15px)',
            }}
          />
          <motion.div
            animate={{ x: ['5%', '-5%', '5%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear', delay: 5 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '-5%',
              width: '120%',
              height: '35%',
              background: 'linear-gradient(90deg, transparent 0%, rgba(60,50,80,0.03) 25%, rgba(80,70,100,0.02) 50%, rgba(60,50,80,0.03) 75%, transparent 100%)',
              filter: 'blur(20px)',
            }}
          />
        </div>

        {/* Digital Distortion Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-45"
          animate={{
            opacity: [0, 0.015, 0.005, 0.02, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3,
            times: [0, 0.2, 0.4, 0.6, 1]
          }}
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(100,100,150,0.02) 1px, rgba(100,100,150,0.02) 2px)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Chromatic Aberration Flash during phase transitions */}
        {phase !== 'anticipation' && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-44"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.08, 0.03, 0.1, 0],
            }}
            transition={{
              duration: 1.5,
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
            style={{
              background: 'radial-gradient(circle, transparent 30%, rgba(255,0,50,0.03) 60%, rgba(0,50,255,0.03) 80%, transparent 100%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Lightning Flash Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-43"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.15, 0.02, 0.08, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 8,
            times: [0, 0.1, 0.3, 0.5, 1]
          }}
          style={{
            background: 'linear-gradient(180deg, rgba(200,200,255,0.1) 0%, transparent 50%, rgba(200,200,255,0.05) 100%)',
          }}
        />

        {/* Cobblestone street background */}
        <CobblestoneStreet />

        {/* Film grain */}
        <FilmGrain />

        {/* Rain effect */}
        <RainEffect intensity={1.3} />

        {/* Fog layers - multiple for depth */}
        <NoirFog layer={1} />
        <NoirFog layer={2} />
        <NoirFog layer={3} />

        {/* Wet pavement */}
        <WetPavement />

        {/* Puddle reflections */}
        <PuddleReflections />

        {/* Neon sign */}
        <NeonSign position="top-[25%] right-[15%]" />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">

          {/* Phase: Anticipation (3-4 seconds) */}
          {phase === 'anticipation' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              {/* Pulsing skeleton magnifier */}
              <motion.div
                className="mb-8"
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <div className="w-40 h-40 mx-auto relative">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-amber-500/50"
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-3 rounded-full border border-amber-400/25"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                  />
                  <motion.div
                    className="absolute inset-6 rounded-full border border-amber-300/15"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </motion.div>

              {/* Tension text */}
              <motion.p
                className="font-mono text-amber-500/80 text-sm tracking-[0.4em] uppercase"
                animate={{ opacity: [0.3, 0.9, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                Investigating Scene...
              </motion.p>

              {/* Scene description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.8 }}
                className="font-serif text-gray-400 text-xs mt-5 italic"
              >
                Rain falls on empty cobblestone streets...
              </motion.p>

              {/* Loading dots */}
              <motion.div
                className="flex justify-center gap-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-amber-500/50"
                    animate={{ opacity: [0.2, 0.8, 0.2] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Phase: Reveal (2+ seconds) */}
          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center w-full max-w-4xl"
            >
              {/* Spinning magnifying glass with dramatic effect */}
              <div className="relative mb-10">
                <NoirMagnifyingGlass isActive={true} zoomLevel={currentClue} />

                {/* Reveal sweep light */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/15 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ clipPath: 'polygon(0 30%, 100% 50%, 100% 50%, 0 70%)' }}
                />
              </div>

              {/* Clue reveal area */}
              <div className="relative w-full h-56 mx-auto">

                {/* Dramatic spotlight */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <div
                    className="w-96 h-96 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,200,100,0.2) 0%, rgba(220, 20, 60, 0.1) 50%, transparent 70%)',
                      filter: 'blur(40px)',
                      animation: 'spotlightReveal 3s ease-out forwards'
                    }}
                  />
                </motion.div>

                {/* Clue 1: Muddy footprints */}
                <Spotlight isActive={currentClue >= 0} position="top-1/2 left-[10%]" />
                <div className="absolute top-1/2 left-[8%] -translate-y-1/2">
                  <MuddyFootprint isRevealed={currentClue >= 0} delay={0} />
                </div>

                {/* Clue 2: Revolver */}
                <Spotlight isActive={currentClue >= 1} position="top-1/2 left-1/2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ChromeRevolver isRevealed={currentClue >= 1} delay={0} />
                </div>

                {/* Clue 3: Cigarette */}
                <Spotlight isActive={currentClue >= 2} position="top-1/2 right-[10%]" />
                <div className="absolute top-1/2 right-[8%] -translate-y-1/2">
                  <BurningCigarette isRevealed={currentClue >= 2} delay={0} />
                </div>

                {/* Clue 4: Evidence papers */}
                <EvidencePapers isRevealed={currentClue >= 3} delay={0.2} />
              </div>

              {/* Title with skew effect */}
              <motion.div
                initial={{ opacity: 0, skewX: -12 }}
                animate={{ opacity: 1, skewX: 0 }}
                // Luxury cinematic entrance - sophisticated reveal
                transition={{
                  delay: 0.8,
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1]  // ELEGANT_ENTER
                }}
                className="mt-12"
              >
                <h1 className="font-heading text-7xl md:text-9xl font-bold tracking-tight">
                  <span className="text-gradient-gold relative">
                    PRISMA
                  </span>
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="font-heading text-xl md:text-2xl text-amber-400 italic mt-4 tracking-wide"
              >
                #TheMysteryUnfolds
              </motion.p>
            </motion.div>
          )}

          {/* Phase: Fade (1.5 seconds) */}
          {phase === 'fade' && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="text-center"
            >
              {/* Final title */}
              <h1 className="font-heading text-7xl md:text-9xl font-bold tracking-tight">
                <span className="text-gradient-gold">PRISMA</span>
              </h1>

              <p className="font-heading text-xl text-amber-400 italic mt-4 tracking-wide">
                #TheMysteryUnfolds
              </p>

              {/* Loading indicator */}
              <div className="mt-12">
                <p className="text-amber-500/60 font-mono text-xs tracking-widest mb-4">
                  {autoLoop ? 'LOOPING SCENE' : 'COMPILING EVIDENCE'}
                </p>
                <div className="w-64 mx-auto">
                  <div className="h-1 bg-noir-lighter rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-gold"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <p className="text-amber-500/50 font-mono text-xs mt-3">
                    {Math.min(Math.round(progress), 100)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Corner decorations - vintage frame style */}
        <div className="absolute top-5 left-5 w-24 h-24 pointer-events-none z-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path d="M0 25 L0 0 L25 0" stroke="currentColor" strokeWidth="2" fill="none" className="text-amber-600/60" />
            <path d="M0 55 L0 80 L25 80" stroke="currentColor" strokeWidth="2" fill="none" className="text-amber-600/30" />
          </svg>
        </div>
        <div className="absolute top-5 right-5 w-24 h-24 pointer-events-none z-20">
          <svg viewBox="0 0 80 80" className="w-full h-full">
            <path d="M80 25 L80 0 L55 0" stroke="currentColor" strokeWidth="2" fill="none" className="text-amber-600/60" />
            <path d="M80 55 L80 80 L55 80" stroke="currentColor" strokeWidth="2" fill="none" className="text-amber-600/30" />
          </svg>
        </div>

        {/* Bottom decorative line */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-500/40" />
            <div className="w-1 h-1 rounded-full bg-amber-500/60" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-500/40" />
          </div>
        </div>

        {/* Skip button (only when not auto-looping) */}
        {!autoLoop && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'reveal' ? 1 : 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 px-8 py-3 bg-midnight/80 border border-amber-500/30 text-amber-500/70 font-mono text-xs tracking-[0.2em] hover:border-amber-500/60 hover:text-amber-400 transition-all cursor-pointer"
            onClick={() => {
              // Guard against multiple onComplete calls
              if (!onCompleteCalledRef.current) {
                onCompleteCalledRef.current = true
                onComplete()
              }
            }}
          >
            [ SKIP INTRO ]
          </motion.button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default CinematicLoader

