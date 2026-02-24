import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

// Import luxury easing system
import { ELEGANT_ENTER } from '../../utils/luxuryEasing'

// Pre-computed particle positions
const PARTICLES = [
  { top: '25%', left: '30%', duration: 2.5, delay: 0 },
  { top: '45%', left: '70%', duration: 3.2, delay: 0.5 },
  { top: '65%', left: '40%', duration: 2.8, delay: 1.0 },
  { top: '35%', left: '60%', duration: 3.5, delay: 1.5 },
  { top: '55%', left: '25%', duration: 2.2, delay: 0.8 },
  { top: '75%', left: '55%', duration: 3.0, delay: 1.2 },
]

const MysteryArtist = () => {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background fog */}
      <div className="fog-effect" style={{ top: '30%', animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Mystery silhouette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            // Dramatic silhouette reveal
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1]  // ELEGANT_ENTER
            }}
            className="relative flex-shrink-0"
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-blood/10 blur-3xl scale-150" />

            {/* Main circle */}
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-noir-light to-noir border-2 border-blood/30 flex items-center justify-center pulse-glow">
              {/* Inner pattern */}
              <div className="absolute inset-4 rounded-full border border-dashed border-gold/20 animate-[spin-slow_20s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-dotted border-blood/20 animate-[spin-slow_15s_linear_infinite_reverse]" />

              {/* Question mark */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 text-center"
              >
                <HelpCircle size={80} className="text-blood/60 mx-auto mb-2" />
                <span className="font-heading text-6xl md:text-7xl font-bold text-gradient-blood">
                  ?
                </span>
              </motion.div>

              {/* Floating particles */}
              {PARTICLES.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gold/40 rounded-full"
                  style={{
                    top: particle.top,
                    left: particle.left,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            // Elegant slide in with delay for staggered effect
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1]  // ELEGANT_ENTER
            }}
            className="text-center lg:text-left"
          >
            {/* Evidence stamp */}
            <div className="evidence-stamp inline-block mb-6 text-xs">
              CONFIRMED
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-chalk">Headlining</span>{' '}
              <span className="text-gradient-gold">Artist</span>
            </h2>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="font-mono text-blood text-sm">SUSPECT:</span>
                <span className="font-mono text-fog-light text-sm tracking-wider">DILJIT DOSANJH</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="font-mono text-blood text-sm">STATUS:</span>
                <span className="font-mono text-gold text-sm tracking-wider">IDENTITY CONFIRMED</span>
              </div>
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="font-mono text-blood text-sm">REVEAL:</span>
                <span className="font-mono text-fog-light text-sm tracking-wider">FEB 28 - MAR 01, 2026</span>
              </div>
            </div>

            <p className="text-fog-light text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              The Punjabi sensation DILJIT DOSANJH is set to take the stage at PRISMA 2026.
              Get ready for an unforgettable night of music and energy!
            </p>

            {/* Decorative line */}
            <div className="mt-8 flex items-center gap-3 justify-center lg:justify-start">
              <div className="h-px w-16 bg-blood/50" />
              <span className="text-blood text-xs font-mono">🎤 HEADLINER CONFIRMED</span>
              <div className="h-px w-16 bg-blood/50" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default MysteryArtist

