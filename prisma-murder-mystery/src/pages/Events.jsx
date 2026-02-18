import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventsData } from '../data/eventsData.js'
import CategorySection from '../components/events/CategorySection.jsx'
import './Events.css'

const Events = () => {
  const [showEntry, setShowEntry] = useState(true)
  const [showIndexOverlay, setShowIndexOverlay] = useState(false)
  const inputBufferRef = useRef('')
  const inputTimerRef = useRef(null)

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
    <div className="events-page min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-[#7a0000] selection:text-white">
      {/* Entry Sequence */}
      <AnimatePresence>
        {showEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[2px] bg-gradient-to-r from-transparent via-[#7a0000] to-transparent -rotate-45"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-center z-10"
            >
              <div className="text-[10px] uppercase tracking-[0.5em] text-gray-500 mb-4 font-mono">PROGRAM INDEX ACCESSED</div>
              <div className="text-3xl font-bold tracking-[0.2em] text-[#7a0000] mb-2 font-mono">PRISMA 2K26</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-gray-600 font-mono">STATUS: ACTIVE</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Film grain overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] animate-film-grain film-grain-texture" />

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[99] bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.8)_100%)]" />

      {/* Main content */}
      <div className="relative max-w-6xl mx-auto px-6 py-24 z-10">
        {/* Header */}
        <header className="mb-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-3 py-1 border border-[#7a0000]/30 rounded-full bg-[#7a0000]/5 mb-6"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-[#7a0000] font-medium">Classified Intelligence</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase"
          >
            Program <span className="text-[#7a0000]">Index</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-sm tracking-widest uppercase"
          >
            Prisma 2K26 // Active Operations // Monitoring In Progress
          </motion.p>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4">
          {eventsData.map((category) => (
            <CategorySection
              key={category.id}
              title={category.title}
              description={category.description}
              tagline={category.tagline}
              sections={category.sections}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-32 pb-12 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] text-gray-600">
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
              className="text-[#7a0000] text-3xl md:text-5xl font-bold tracking-[0.3em] text-center"
            >
              STRUCTURE ACKNOWLEDGED
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Events
