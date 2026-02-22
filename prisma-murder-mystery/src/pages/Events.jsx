import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventsData } from '../data/eventsData.js'
import CategorySection from '../components/events/CategorySection.jsx'
import RedStringDossier from '../components/events/RedStringDossier.jsx'
import Footer from '../components/common/Footer'
import './Events.css'

const Events = () => {
  const [flicker, setFlicker] = useState(false)
  const [showEntry, setShowEntry] = useState(true)
  const [showWatching, setShowWatching] = useState(false)
  const [showIndexOverlay, setShowIndexOverlay] = useState(false)
  const inputBufferRef = useRef('')
  const inputTimerRef = useRef(null)
  const idleTimerRef = useRef(null)
  const categoryRefs = useRef([])

  // Initialize or resize the refs array when data changes
  if (categoryRefs.current.length !== eventsData.length) {
    categoryRefs.current = Array(eventsData.length).fill().map((_, i) => categoryRefs.current[i] || { current: null });
  }

  // Idle timeout - "We're listening" message
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      setShowWatching(false)

      idleTimerRef.current = setTimeout(() => {
        setShowWatching(true)
      }, 15000) // 15 seconds
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll']
    events.forEach(event => window.addEventListener(event, resetIdleTimer))
    resetIdleTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  // Rare light flicker effect
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlicker(true)
        setTimeout(() => setFlicker(false), 100)
      }
    }, 3000)

    return () => clearInterval(flickerInterval)
  }, [])

  // Entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntry(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Keyboard listener for "index" keyword
  useEffect(() => {
    const handleKeyPress = (e) => {
      inputBufferRef.current += e.key.toLowerCase()

      if (inputTimerRef.current) {
        clearTimeout(inputTimerRef.current)
      }

      inputTimerRef.current = setTimeout(() => {
        inputBufferRef.current = ''
      }, 2000)

      if (inputBufferRef.current.includes('index')) {
        setShowIndexOverlay(true)
        inputBufferRef.current = ''

        setTimeout(() => {
          setShowIndexOverlay(false)
        }, 3000)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      if (inputTimerRef.current) {
        clearTimeout(inputTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="events-page min-h-screen bg-[#0a0a0a] text-gray-100 font-body selection:bg-[#7a0000] selection:text-white">
      {/* Entry Sequence */}
      <AnimatePresence>
        {showEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="entry-sequence"
          >
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '120vw', opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="entry-slash"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="entry-text"
            >
              <div className="entry-line">PROGRAM INDEX ACCESSED</div>
              <div className="entry-case">PRISMA-2K26</div>
              <div className="entry-status">STATUS: ACTIVE</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Atmospheric layers */}
      <div className="noir-vignette" />
      <div className="noir-grain" />
      <div className={`noir-spotlight ${flicker ? 'flicker' : ''}`} />
      <div className="red-ambient-pulse" />
      <div className="shadow-presence" />

      {/* Drifting smoke */}
      <div className="smoke-layer">
        <div className="smoke smoke-1" />
        <div className="smoke smoke-2" />
        <div className="smoke smoke-3" />
      </div>

      {/* "We're listening" idle message */}
      <AnimatePresence>
        {showWatching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="watching-message"
          >
            We're listening.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-[var(--section-padding-x)] pt-28 md:pt-32 lg:pt-36 pb-24 z-10">
        {/* Header */}
        <header className="events-header">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="evidence-tag">CLASSIFIED</div>

            <h1 className="noir-title">
              PROGRAM <span className="text-[#c41e3a]">INDEX</span>
            </h1>

            <p className="noir-subtitle">
              Every detail is evidence. Monitoring in progress.
            </p>

            <div className="case-number">CASE #2026-PRISMA</div>
          </motion.div>
        </header>

        {/* Red String Connector System */}
        <RedStringDossier categoryRefs={categoryRefs.current} />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4">
          {eventsData.map((category, index) => (
            <CategorySection
              key={category.id}
              ref={categoryRefs.current[index]}
              index={index}
              {...category}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 pb-12 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center text-[0.6rem] uppercase tracking-[0.3em] text-gray-700 font-mono">
          <div>Every program has an architect.</div>
          <div className="mt-4 md:mt-0">© 2026 PRISMA TERMINAL // ALL RIGHTS RESERVED</div>
        </footer>
      </div>

      {/* Index keyword overlay */}
      <AnimatePresence>
        {showIndexOverlay && (
          <motion.div
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-[#7a0000] text-3xl md:text-5xl font-mono tracking-[0.3em] text-center"
            >
              STRUCTURE ACKNOWLEDGED
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default Events
