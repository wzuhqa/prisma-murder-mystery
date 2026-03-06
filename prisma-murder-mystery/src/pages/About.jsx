import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '../components/common/Footer'
import './AboutArchive.css'

const prismaYears = [

  {
    year: '2K25',
    tagline: 'The Grand Techno-Cultural Extravaganza',
    description: 'Prisma 2K25 was a spectacular celebration of talent and creativity at SRM University Delhi NCR, Sonepat. The 7th edition brought together students from across the region for an unforgettable experience filled with electrifying performances, intense competitions, and vibrant festivities. From mesmerizing dance battles and captivating theatrical performances to thrilling gaming tournaments and thought-provoking debates, Prisma 2K25 showcased the diverse talents of our community. The fest also featured fashion shows, poetry slams, photography exhibitions, art displays, and cosplay competitions, making it a true celebration of innovation and excellence.',
    highlightsUrl: '#'
  },
  {
    year: '2K24',
    tagline: 'Vibrant Fusion of Talent and Celebration',
    description: 'Prisma 2K24 marked another milestone in our journey, bringing together creativity, competition, and celebration in one grand event. The 6th edition featured an impressive lineup of cultural performances, technical competitions, and artistic showcases. Students participated in dance competitions, music battles, drama performances, literary events, and gaming tournaments. The fest created an atmosphere of excitement and camaraderie, with participants and spectators alike enjoying the vibrant energy that defines Prisma.',
    highlightsUrl: '#'
  },
  {
    year: '2K23',
    tagline: 'A Trip Down Memory Lane',
    description: 'Prisma 2K23 took us on a nostalgic journey through creativity and innovation. The 5th edition celebrated the rich cultural heritage of our university while embracing modern trends and technologies. From traditional dance forms to contemporary music, from classic literature to digital art, Prisma 2K23 bridged the gap between past and present. The fest featured memorable performances, competitive events, and interactive sessions that left lasting impressions on all attendees.',
    highlightsUrl: '#'
  },
  {
    year: '2K22',
    tagline: 'Spirit of Creativity and Innovation',
    description: 'Prisma 2K22 embodied the true spirit of creativity and innovation, showcasing the incredible talents of our student community. The 4th edition brought together artists, performers, gamers, and thinkers for a celebration of diverse skills and passions. The fest featured cutting-edge competitions, stunning performances, and engaging workshops that inspired participants to push their creative boundaries. Prisma 2K22 set new standards for excellence and entertainment.',
    highlightsUrl: '#'
  },
  {
    year: '2K20',
    tagline: 'A Cherished Tradition',
    description: 'Prisma 2K20 continued the cherished tradition of celebrating talent and creativity at SRM University Delhi NCR. Despite challenges, the 3rd edition brought together the community for an unforgettable experience. The fest featured a mix of cultural performances, competitive events, and collaborative activities that highlighted the resilience and creativity of our students. Prisma 2K20 demonstrated that the spirit of celebration and innovation cannot be dimmed.',
    highlightsUrl: '#'
  },
  {
    year: '2K19',
    tagline: 'Where Creativity Knows No Bounds',
    description: 'Prisma 2K19 was a testament to boundless creativity and unlimited potential. The 2nd edition expanded the horizons of what a techno-cultural fest could be, introducing new categories, competitions, and performances. Students explored their talents in various domains, from traditional arts to modern technology, from individual showcases to team collaborations. Prisma 2K19 established itself as a platform where dreams take flight and creativity knows no bounds.',
    highlightsUrl: '#'
  },
  {
    year: '2K18',
    tagline: 'The First Chapter',
    description: 'Prisma 2K18 marked the beginning of an incredible journey. The inaugural edition laid the foundation for what would become SRM University Delhi NCR\'s premier techno-cultural fest. With enthusiasm and ambition, students came together to create a celebration of talent, creativity, and innovation. The first chapter of Prisma set the tone for years to come, establishing traditions and creating memories that would inspire future editions.',
    highlightsUrl: '#'
  }
]

const AboutArchive = () => {
  const [showEntry, setShowEntry] = useState(true)
  const [showIdle, setShowIdle] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [delayedCursorPos, setDelayedCursorPos] = useState({ x: 0, y: 0 })
  const [flickerYear, setFlickerYear] = useState(null)
  const [loadedYears, setLoadedYears] = useState(new Set())
  const idleTimerRef = useRef(null)
  const observerRef = useRef(null)

  // Entry sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntry(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Idle message
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      setShowIdle(false)

      idleTimerRef.current = setTimeout(() => {
        setShowIdle(true)
      }, 20000)
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll']
    events.forEach(event => window.addEventListener(event, resetIdleTimer))
    resetIdleTimer()

    return () => {
      events.forEach(event => window.removeEventListener(event, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [])

  // Cursor shadow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setDelayedCursorPos(cursorPos)
    }, 100)
    return () => clearInterval(interval)
  }, [cursorPos])

  // Rare flicker effect
  useEffect(() => {
    const flickerTimeout = setTimeout(() => {
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * prismaYears.length)
        setFlickerYear(randomIndex)
        setTimeout(() => setFlickerYear(null), 300)
      }
    }, 5000 + Math.random() * 10000)

    return () => clearTimeout(flickerTimeout)
  }, [flickerYear])

  // Intersection observer for scroll-in typing effect
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const yearIndex = entry.target.dataset.yearIndex
            if (yearIndex && !loadedYears.has(yearIndex)) {
              setLoadedYears(prev => new Set([...prev, yearIndex]))
            }
          }
        })
      },
      { threshold: 0.3 }
    )

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadedYears])

  useEffect(() => {
    const yearElements = document.querySelectorAll('.year-dossier')
    yearElements.forEach((el) => {
      if (observerRef.current) {
        observerRef.current.observe(el)
      }
    })

    return () => {
      yearElements.forEach((el) => {
        if (observerRef.current) {
          observerRef.current.unobserve(el)
        }
      })
    }
  }, [])

  return (
    <>
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
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="entry-slash"
            />

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="entry-text"
            >
              <div className="entry-line">ARCHIVE ACCESS GRANTED</div>
              <div className="entry-case glitch-hover" data-text="PRISMA RECORDS">PRISMA RECORDS</div>
              <div className="entry-status">STATUS: UNSEALED</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showEntry && (
        <>
          <div className="archive-container">
            {/* Atmospheric layers */}
            <div className="archive-vignette" />
            <div className="archive-grain" />
            <div className="archive-spotlight" />
            <div className="red-ambient-pulse" />
            <div className="shadow-presence" />

            {/* Dust particles */}
            <div className="dust-layer">
              <div className="dust dust-1" />
              <div className="dust dust-2" />
              <div className="dust dust-3" />
              <div className="dust dust-4" />
            </div>

            {/* Cursor shadow */}
            <div
              className="cursor-shadow"
              style={{
                left: `${delayedCursorPos.x}px`,
                top: `${delayedCursorPos.y}px`
              }}
            />

            {/* Idle message */}
            <AnimatePresence>
              {showIdle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 4 }}
                  className="idle-message"
                >
                  Some records were never meant to be reopened.
                </motion.div>
              )}
            </AnimatePresence>

            <div className="archive-content-wrapper">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="archive-hero"
              >
                <div className="classified-tag">CLASSIFIED</div>

                <h1 className="archive-title">ABOUT <span className="glitch-hover" data-text="PRISMA">PRISMA</span></h1>

                <p className="archive-subtitle">
                  The Archive of Legacy and Innovation
                </p>

                <div className="case-file-intro">
                  <div className="file-header">
                    <span className="file-label">PRIMARY CASE FILE</span>
                    <span className="file-id glitch-hover" data-text="PRISMA-2K26">PRISMA-2K26</span>
                  </div>

                  <div className="file-content">
                    <p className="intro-text">
                      Prisma 2K26 – The Grand Techno-Cultural Extravaganza of SRM University Delhi NCR, Sonepat
                    </p>

                    <div className="intro-details">
                      <h2 className="details-heading">Prisma 2K26</h2>
                      <a href="#" className="watch-highlights">Watch Highlights</a>
                      <p className="details-tagline">The Grand Techno-Cultural Extravaganza</p>

                      <p className="details-description">
                        Welcome to <span className="glitch-hover" data-text="Prisma 2K26">Prisma 2K26</span>, the 8th edition of SRM University Delhi NCR, Sonepat's premier techno-cultural fest! Celebrating talent, creativity, and innovation, <span className="glitch-hover" data-text="Prisma">Prisma</span> offers exhilarating performances, thrilling competitions, and vibrant celebrations. Enjoy dance battles, theatrical acts, music, fashion, gaming, debates, poetry slams, photography, art, and cosplay. A hub of diverse interests, <span className="glitch-hover" data-text="Prisma">Prisma</span> fosters creativity and excellence, growing bigger each year. Whether a performer, competitor, or spectator, experience the excitement and legacy of <span className="glitch-hover" data-text="Prisma 2K26">Prisma 2K26</span>!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Timeline Section */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="timeline-section"
              >
                <div className="timeline-header">
                  <div className="header-line" />
                  <h2 className="timeline-title">ARCHIVE TIMELINE</h2>
                  <div className="header-line" />
                </div>

                <div className="dossier-grid">
                  {prismaYears.map((yearData, index) => (
                    <motion.div
                      key={yearData.year}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="year-dossier"
                      data-year-index={index}
                    >
                      <div className="dossier-panel">
                        <div className="dossier-header">
                          <div className="year-stamp">
                            {flickerYear === index ? '2K2_6' : `PRISMA ${yearData.year}`}
                          </div>
                          <div className="evidence-tag">WATCH HIGHLIGHTS</div>
                        </div>

                        {loadedYears.has(String(index)) && (
                          <div className="terminal-load">
                            PRISMA-{yearData.year} // ARCHIVE LOADED
                          </div>
                        )}

                        <div className="dossier-content">
                          <h3 className="dossier-tagline">{yearData.tagline}</h3>
                          <p className="dossier-description">{yearData.description}</p>
                        </div>

                        <div className="metallic-sheen" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="archive-footer"
              >
                <p>Archive access is monitored. All records are sealed.</p>
              </motion.div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  )
}

export default AboutArchive
