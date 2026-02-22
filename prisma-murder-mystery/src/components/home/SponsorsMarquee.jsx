import { useState, useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'

// ============================================
// TIERED SPONSOR DATA
// ============================================
const SPONSOR_TIERS = {
  gold: {
    label: 'PRIME SUSPECTS',
    tag: '⭐ PRIME SUSPECT',
    sponsors: ['Red-Bull', 'Adobe', 'Siemens', 'krafton'],
    accentColor: 'rgba(255, 185, 0, 0.6)',
    borderColor: 'border-l-amber-500/60',
    textColor: 'text-amber-100',
    tagBg: 'bg-amber-900/30',
    tagBorder: 'border-amber-500/40',
    cardBg: 'bg-[#1c1a14]',
    glowColor: 'rgba(255, 185, 0, 0.15)',
    speed: 35,
  },
  silver: {
    label: 'PERSONS OF INTEREST',
    tag: '🔍 PERSON OF INTEREST',
    sponsors: ['3D Engineering', 'Federal', 'Timex', 'Playerone', 'Incredible', 'BigWig', 'Digiveda'],
    accentColor: 'rgba(192, 192, 210, 0.5)',
    borderColor: 'border-l-gray-400/50',
    textColor: 'text-gray-200',
    tagBg: 'bg-gray-800/40',
    tagBorder: 'border-gray-500/30',
    cardBg: 'bg-[#18181b]',
    glowColor: 'rgba(192, 192, 210, 0.08)',
    speed: 28,
  },
  bronze: {
    label: 'WITNESSES',
    tag: 'WITNESS',
    sponsors: ['Balaji', 'Caterman', 'Clovia', 'Coolberg', 'F9Kart', 'Insight', 'Mac-V', 'Mojo', 'Panchwati', 'Pardesi', 'Security', 'Sipp', 'Skivia', 'Svva', 'Vfission'],
    accentColor: 'rgba(139, 90, 43, 0.4)',
    borderColor: 'border-l-amber-800/40',
    textColor: 'text-gray-300',
    tagBg: 'bg-stone-900/30',
    tagBorder: 'border-amber-800/25',
    cardBg: 'bg-[#161614]',
    glowColor: 'rgba(139, 90, 43, 0.06)',
    speed: 22,
  },
}

// ============================================
// TILT CARD COMPONENT
// ============================================
const TiltCard = ({ children, index }) => {
  const ref = useRef(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)

  const springConfig = { damping: 15, stiffness: 150 }
  const rotateXSpring = useSpring(rotateX, springConfig)
  const rotateYSpring = useSpring(rotateY, springConfig)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const rotateXValue = (e.clientY - centerY) / 20
    const rotateYValue = (centerX - e.clientX) / 20

    rotateX.set(rotateXValue)
    rotateY.set(rotateYValue)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SPONSOR CARD COMPONENT
// ============================================
const SponsorCard = ({ sponsor, tier, tierKey, index }) => {
  const isGold = tierKey === 'gold'
  const isSilver = tierKey === 'silver'
  const rotation = (index % 3 === 0) ? '-rotate-1' : (index % 2 === 0) ? 'rotate-1' : ''

  return (
    <TiltCard index={index}>
      <div
        className={`relative group cursor-pointer ${isGold ? 'mx-4 md:mx-10 lg:mx-14' : isSilver ? 'mx-3 md:mx-7 lg:mx-10' : 'mx-2 md:mx-5 lg:mx-8'} ${rotation} transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30`}
      >
        <div
          className={`relative rounded-sm border-l-4 ${tier.borderColor} border border-white/5 ${tier.cardBg} shadow-[12px_12px_30px_rgba(0,0,0,0.7)] transition-all duration-500 overflow-hidden
            ${isGold ? 'px-10 py-8 md:px-16 md:py-14 min-w-[260px] md:min-w-[360px]' : isSilver ? 'px-7 py-6 md:px-12 md:py-10 min-w-[200px] md:min-w-[280px]' : 'px-5 py-4 md:px-8 md:py-7 min-w-[140px] md:min-w-[200px]'}`}
        >
          {/* Breathing glow animation */}
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
            style={{
              background: `radial-gradient(circle at center, ${tier.glowColor} 0%, transparent 70%)`,
              animation: 'pulse 2s ease-in-out infinite'
            }}
          />

          {/* Pin */}
          <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full shadow-md z-20 ${isGold ? 'w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600' : isSilver ? 'w-3 h-3 bg-gradient-to-br from-gray-300 to-gray-500' : 'w-2.5 h-2.5 bg-gradient-to-br from-amber-700 to-amber-900'}`}>
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Tape (gold only) */}
          {isGold && (
            <div className="absolute -top-3 -left-2 w-14 h-7 bg-amber-500/5 border border-amber-500/10 transform -rotate-12 opacity-40" />
          )}

          {/* CLASSIFIED Stamp on hover */}
          <div className={`absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12 ${isGold ? 'text-amber-500/70' : isSilver ? 'text-gray-400/60' : 'text-amber-700/50'}`}>
            <div className={`border-2 ${isGold ? 'border-amber-500/70' : isSilver ? 'border-gray-500/60' : 'border-amber-700/50'} px-2 py-0.5 rotate-45 text-[8px] font-light tracking-widest uppercase font-sans`}>
              {isGold ? 'CONFIDENTIAL' : isSilver ? 'CLASSIFIED' : 'VERIFIED'}
            </div>
          </div>

          {/* Fingerprint mark */}
          <div className={`absolute bottom-3 left-3 opacity-10 group-hover:opacity-25 transition-opacity duration-500 ${isGold ? 'text-amber-500' : isSilver ? 'text-gray-400' : 'text-amber-700'}`}>
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1C7.03 1 3 5.03 3 10v9c0 1.1.9 2 2 2h2v-4H5v-7c0-3.86 3.14-7 7-7s7 3.14 7 7v7h-2v4h2c1.1 0 2-.9 2-2v-9c0-4.97-4.03-9-9-9zm-2 16h2v-4h-2v4zm4-7h-2v-4c0-1.66-1.34-3-3-3s-3 1.34-3 3v4H8v-4c0-2.76 2.24-5 5-5s5 2.24 5 5v4h-2v-4z" />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10">
            {/* Tier Tag */}
            <span className={`font-sans font-light tracking-[0.3em] uppercase ${tier.tagBg} ${tier.tagBorder} border px-2 py-0.5 rounded-sm ${isGold ? 'text-[9px] text-amber-400/80' : isSilver ? 'text-[8px] text-gray-400/70' : 'text-[7px] text-amber-700/60'}`}>
              {tier.tag}
            </span>

            {/* Sponsor Name */}
            <span className={`whitespace-nowrap tracking-wide drop-shadow-lg group-hover:text-white transition-colors duration-400 ${tier.textColor} ${isGold ? 'text-4xl md:text-5xl' : isSilver ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`} style={{ fontFamily: 'var(--font-creepy)', fontWeight: 400 }}>
              {sponsor}
            </span>

            {/* Divider line with animation */}
            <div className={`h-[1px] bg-current opacity-10 group-hover:opacity-30 group-hover:w-16 transition-all duration-500 ${isGold ? 'w-10' : isSilver ? 'w-6' : 'w-4'}`} />
          </div>

          {/* Thread hints - Red string connections */}
          <div className={`absolute top-1/2 -left-3 h-[1px] bg-blood/15 group-hover:bg-blood/40 transition-colors duration-300 ${isGold ? 'w-3' : 'w-2'}`} />
          <div className={`absolute top-1/2 -right-3 h-[1px] bg-blood/15 group-hover:bg-blood/40 transition-colors duration-300 ${isGold ? 'w-3' : 'w-2'}`} />
        </div>
      </div>
    </TiltCard>
  )
}

// ============================================
// SINGLE MARQUEE ROW
// ============================================
const MarqueeRow = ({ tier, tierKey, reverse = false }) => {
  const doubled = [...tier.sponsors, ...tier.sponsors]
  const isGold = tierKey === 'gold'
  const isSilver = tierKey === 'silver'
  const rowRef = useRef(null)
  const isInView = useInView(rowRef, { once: true, margin: "-100px" })

  return (
    <div ref={rowRef} className="mb-8 last:mb-0">
      {/* Tier Label with slide-in effect */}
      <motion.div
        className="flex items-center gap-4 mb-5 px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${isGold ? 'via-amber-500/30' : isSilver ? 'via-gray-500/20' : 'via-amber-800/15'} to-transparent`} />
        <motion.span
          className={`font-sans font-light text-[10px] tracking-[0.4em] uppercase ${isGold ? 'text-amber-400/70' : isSilver ? 'text-gray-400/60' : 'text-amber-700/50'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {tier.label}
        </motion.span>
        <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${isGold ? 'via-amber-500/30' : isSilver ? 'via-gray-500/20' : 'via-amber-800/15'} to-transparent`} />
      </motion.div>

      {/* Marquee Track */}
      <div className="marquee-container relative overflow-hidden group/marquee">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-noir to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-noir to-transparent z-20 pointer-events-none" />

        <div
          className="marquee-content flex items-center"
          style={{
            animationDuration: `${tier.speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.animationPlayState = 'paused'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.animationPlayState = 'running'
          }}
        >
          {doubled.map((sponsor, index) => (
            <SponsorCard
              key={`${tierKey}-${index}`}
              sponsor={sponsor}
              tier={tier}
              tierKey={tierKey}
              index={index % tier.sponsors.length}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// FLOATING PARTICLES COMPONENT
// ============================================
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 5,
    size: 2 + Math.random() * 4,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-amber-500/20 rounded-full"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.5, 0],
            x: [0, Math.random() * 50 - 25, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// RED STRING CONNECTOR
// ============================================
const RedStringConnector = () => {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ opacity: 0.12 }}>
      <motion.path
        d="M 100 120 Q 300 80 500 120 T 900 120 T 1400 120"
        fill="none"
        stroke="#8b0000"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <motion.path
        d="M 100 220 Q 300 260 500 220 T 900 220 T 1400 220"
        fill="none"
        stroke="#8b0000"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 0.8 }}
      />
      <motion.path
        d="M 100 320 Q 300 360 500 320 T 900 320 T 1400 320"
        fill="none"
        stroke="#8b0000"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, delay: 1.1 }}
      />
    </svg>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
const SponsorsMarquee = () => {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 border-y border-blood/20 bg-noir shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* Background noise */}
      <div className="absolute inset-0 forensic-smudge opacity-20 pointer-events-none select-none" />

      {/* Fog effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-noir/30 to-transparent pointer-events-none" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Red string connections */}
      <RedStringConnector />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 mb-14 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center"
        >
          <div className="inline-block relative group">
            <h2 className="font-special-elite text-3xl md:text-5xl tracking-[0.2em] text-blood/90 uppercase bg-blood/5 px-10 py-5 border border-blood/20 relative z-10">
              Classified Backers
            </h2>
            <div className="absolute inset-0 bg-blood/5 blur-2xl -z-10 group-hover:bg-blood/10 transition-colors duration-700" />
            <motion.div
              className="absolute -top-6 -right-12 text-xs md:text-sm text-blood/40 font-mono border-2 border-blood/30 px-3 py-1 rotate-12 select-none uppercase font-bold tracking-widest"
              initial={{ opacity: 0, rotate: 0 }}
              whileInView={{ opacity: 1, rotate: 12 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Top Secret
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            className="mt-6 text-gray-400/60 font-mono text-sm tracking-wider"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            The entities behind this operation
          </motion.p>
        </motion.div>
      </div>

      {/* Tiered Marquee Rows */}
      <div className="relative z-10 space-y-10 md:space-y-14 max-w-7xl mx-auto">
        <MarqueeRow tier={SPONSOR_TIERS.gold} tierKey="gold" />
        <MarqueeRow tier={SPONSOR_TIERS.silver} tierKey="silver" reverse />
        <MarqueeRow tier={SPONSOR_TIERS.bronze} tierKey="bronze" />
      </div>

      {/* Flickering light effect */}
      <motion.div
        className="absolute top-10 left-1/4 w-2 h-2 bg-amber-500/30 rounded-full blur-sm"
        animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Inline keyframe styles */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  )
}

export default SponsorsMarquee
