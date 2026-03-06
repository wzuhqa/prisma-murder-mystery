import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Blood reveal intro sequence
const CinematicBloodIntro = ({
  onComplete,
  duration = 3000,
  skipable = true
}) => {
  const [phase, setPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)

  // Phase 0: Black screen
  // Phase 1: Blood drips start
  // Phase 2: Blood pools and spreads
  // Phase 3: Text reveal through blood
  // Phase 4: Fade to content

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const bloodDrops = []
    const bloodPools = []
    const particles = []

    // Create initial blood drops
    for (let i = 0; i < 15; i++) {
      bloodDrops.push({
        x: Math.random() * canvas.width,
        y: -50 - Math.random() * 200,
        vy: 2 + Math.random() * 3,
        size: 4 + Math.random() * 8,
        trail: [],
        color: `rgb(${139 + Math.floor(Math.random() * 30)}, 0, 0)`
      })
    }

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const totalProgress = Math.min(elapsed / duration, 1)
      setProgress(totalProgress)

      // Phase transitions
      if (totalProgress < 0.15) setPhase(0)
      else if (totalProgress < 0.4) setPhase(1)
      else if (totalProgress < 0.65) setPhase(2)
      else if (totalProgress < 0.85) setPhase(3)
      else setPhase(4)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Background gradient based on phase
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width
      )

      if (phase >= 2) {
        gradient.addColorStop(0, 'rgba(20, 0, 0, 0.3)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
      } else {
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Phase 1+: Blood drips
      if (phase >= 1) {
        bloodDrops.forEach((drop, index) => {
          // Add trail
          drop.trail.push({ x: drop.x, y: drop.y })
          if (drop.trail.length > 20) drop.trail.shift()

          // Draw trail
          drop.trail.forEach((t, i) => {
            const alpha = (i / drop.trail.length) * 0.5
            ctx.globalAlpha = alpha
            ctx.fillStyle = drop.color
            ctx.beginPath()
            ctx.arc(t.x, t.y, drop.size * (i / drop.trail.length), 0, Math.PI * 2)
            ctx.fill()
          })

          // Draw drop
          ctx.globalAlpha = 0.9
          ctx.fillStyle = drop.color
          ctx.shadowBlur = 15
          ctx.shadowColor = '#ff0000'
          ctx.beginPath()
          ctx.ellipse(drop.x, drop.y, drop.size * 0.8, drop.size * 1.3, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0

          // Update position
          drop.y += drop.vy
          drop.vy += 0.1
          drop.x += Math.sin(timestamp * 0.01 + index) * 0.5

          // Create pool when hitting bottom
          if (drop.y > canvas.height - 100 && phase >= 2) {
            if (!drop.pooled) {
              drop.pooled = true
              bloodPools.push({
                x: drop.x,
                y: canvas.height - 20,
                size: drop.size * 3,
                maxSize: drop.size * 8,
                growth: 0.5
              })
            }
          }
        })
      }

      // Phase 2+: Blood pools
      if (phase >= 2) {
        bloodPools.forEach((pool) => {
          if (pool.size < pool.maxSize) {
            pool.size += pool.growth
          }

          ctx.globalAlpha = 0.8
          const poolGradient = ctx.createRadialGradient(
            pool.x, pool.y, 0,
            pool.x, pool.y, pool.size
          )
          poolGradient.addColorStop(0, '#ff0000')
          poolGradient.addColorStop(0.3, '#8B0000')
          poolGradient.addColorStop(0.7, '#4A0000')
          poolGradient.addColorStop(1, '#2D0000')

          ctx.fillStyle = poolGradient
          ctx.beginPath()

          // Organic pool shape
          for (let i = 0; i <= 12; i++) {
            const angle = (i / 12) * Math.PI * 2
            const wobble = Math.sin(timestamp * 0.005 + angle * 3) * 5
            const radius = pool.size + wobble
            const px = pool.x + Math.cos(angle) * radius
            const py = pool.y + Math.sin(angle) * radius * 0.3
            if (i === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
          ctx.fill()
        })
      }

      // Phase 3+: Particle spray
      if (phase >= 3) {
        // Add new particles
        if (Math.random() < 0.3) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: 1 + Math.random() * 3,
            life: 50
          })
        }

        // Update and draw particles
        particles.forEach((p) => {
          p.x += p.vx
          p.y += p.vy
          p.life--

          ctx.globalAlpha = (p.life / 50) * 0.6
          ctx.fillStyle = '#ff0000'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })

        // Remove dead particles
        for (let i = particles.length - 1; i >= 0; i--) {
          if (particles[i].life <= 0) particles.splice(i, 1)
        }
      }

      ctx.globalAlpha = 1

      // Continue or complete
      if (totalProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [duration, onComplete, phase])

  const handleSkip = () => {
    if (skipable) {
      onComplete?.()
    }
  }

  return (
    <motion.div
      className="cinematic-intro"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        zIndex: 10000,
        cursor: skipable ? 'pointer' : 'default'
      }}
      onClick={handleSkip}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Phase-based text overlays */}
      <AnimatePresence>
        {phase === 0 && (
          <motion.div
            key="phase0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontSize: '1.5rem',
                color: '#666',
                letterSpacing: '0.5em',
                textTransform: 'uppercase'
              }}
            >
              A Murder Awaits
            </motion.div>
          </motion.div>
        )}

        {phase === 3 && (
          <motion.div
            key="phase3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center'
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: '4rem',
                fontFamily: "'Playfair Display', serif",
                color: '#D4AF37',
                textShadow: '0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(139, 0, 0, 0.3)',
                letterSpacing: '0.2em'
              }}
            >
              PRISMA
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                width: '200px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #8B0000, transparent)',
                margin: '1rem auto'
              }}
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{
                fontSize: '1rem',
                color: '#999',
                letterSpacing: '0.3em',
                textTransform: 'uppercase'
              }}
            >
              Murder Mystery
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '2px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '1px'
        }}
      >
        <motion.div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #8B0000, #ff0000)',
            borderRadius: '1px'
          }}
        />
      </motion.div>

      {/* Skip hint */}
      {skipable && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.75rem',
            color: '#666',
            letterSpacing: '0.2em',
            textTransform: 'uppercase'
          }}
        >
          Click anywhere to skip
        </motion.div>
      )}
    </motion.div>
  )
}

export default CinematicBloodIntro
