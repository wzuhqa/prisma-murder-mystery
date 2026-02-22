import { useState, useCallback, useEffect, useRef, memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import './SlashNavbar.css'

// ============================================
// NAVIGATION ITEMS CONFIGURATION
// ============================================
const NAV_ITEMS = [
  { id: 'home', label: 'CASE OVERVIEW', path: '/', icon: '📁', desc: 'Return to the main briefing' },
  { id: 'events', label: 'SUSPECT DOSSIER', path: '/events', icon: '🔍', desc: 'Browse classified program dossiers' },
  { id: 'team', label: 'INVESTIGATORS', path: '/team', icon: '👤', desc: 'Meet the lead detectives' },
  { id: 'about', label: 'AUTOPSY REPORT', path: '/about', icon: '📋', desc: 'Read the post-mortem findings' },
  { id: 'contact', label: 'EVIDENCE ARCHIVE', path: '/contact', icon: '🗃️', desc: 'Submit a tip or report' }
]

// Add prefetching for critical routes
const prefetchRoute = (route) => {
  if (typeof document === 'undefined') return;
  const id = `prefetch-${route.replace(/\//g, '-')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};


// ============================================
// PAGE LOAD PROGRESS BAR (blood-red glowing)
// ============================================
const PageLoadProgress = ({ isLoading }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (isLoading) {
      setProgress(0)
      const timer = setInterval(() => {
        setProgress(prev => (prev >= 90 ? prev : prev + 10))
      }, 50)
      return () => clearInterval(timer)
    } else {
      setProgress(100)
      const timer = setTimeout(() => setProgress(0), 400)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (progress === 0) return null
  return (
    <div className="page-load-progress">
      <div className="progress-bar" style={{ width: `${progress}%` }} />
      <div className="progress-glow" style={{ left: `${progress}%` }} />
    </div>
  )
}



// ============================================
// DAYS REMAINING URGENCY BADGE
// ============================================

// ============================================
// EVIDENCE TAG (yellow crime scene marker)
// ============================================
const EvidenceTag = memo(({ index }) => (
  <div className="nav-evidence-tag">
    <span className="tag-number">{index + 1}</span>
  </div>
))

// ============================================
// SCRAMBLE TEXT COMPONENT
// ============================================
const ScrambleText = ({ text, isHovered, isRedacting }) => {
  const [displayText, setDisplayText] = useState(text)
  const chars = '!@#$%^&*()_+{}:<>?|[]-=-'
  const frameRef = useRef(null)

  useEffect(() => {
    if (isRedacting) {
      setDisplayText('[REDACTED]')
      return
    }
    if (isHovered) {
      let iteration = 0
      const scramble = () => {
        setDisplayText(
          text.split('').map((ch, i) =>
            i < iteration ? text[i] : chars[Math.floor(Math.random() * chars.length)]
          ).join('')
        )
        if (iteration < text.length) {
          iteration += 1 / 3
          frameRef.current = requestAnimationFrame(scramble)
        }
      }
      frameRef.current = requestAnimationFrame(scramble)
    } else {
      setDisplayText(text)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [isHovered, text, isRedacting])

  return <span className="link-text">{displayText}</span>
}

// ============================================
// NAV ITEM — with icon, tooltip, visit counter, keyboard nav
// ============================================
const NavItem = ({ item, index, isActive, isLocked, onClick, onHover, isHovered, onNavClick, isRedacting, visitCount, onFocusNav }) => {
  const linkRef = useRef(null)
  const threadRef = useRef(null)
  const [isGlitching, setIsGlitching] = useState(false)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    if (!threadRef.current) return
    if (isHovered && !isLocked) {
      gsap.to(threadRef.current, { width: '100%', opacity: 0.8, duration: 0.4, ease: 'power2.out' })
    } else {
      gsap.to(threadRef.current, { width: '0%', opacity: 0, duration: 0.3, ease: 'power2.in' })
    }
  }, [isHovered, isLocked])

  const handleClick = () => {
    if (isLocked) return
    setIsGlitching(true)
    setShowSplash(true)
    setTimeout(() => {
      onClick(item.path)
      onNavClick()
      setIsGlitching(false)
      setTimeout(() => setShowSplash(false), 800)
    }, 400)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
    // Arrow key navigation
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (onFocusNav) onFocusNav(Math.min(index + 1, 4))
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (onFocusNav) onFocusNav(Math.max(index - 1, 0))
    }
  }

  return (
    <li className="navbar-item">
      <button
        ref={linkRef}
        className={[
          'navbar-link blood-hover-drip',
          isActive ? 'navbar-link--active' : '',
          isHovered ? 'navbar-link--hovered' : '',
          isGlitching ? 'navbar-link--glitching' : '',
          isRedacting ? 'navbar-link--redacted' : ''
        ].join(' ')}
        onClick={handleClick}
        onMouseEnter={() => {
          onHover(item.id);
          prefetchRoute(item.path);
        }}
        onMouseLeave={() => onHover(null)}
        onKeyDown={handleKeyDown}
        disabled={isLocked}
        aria-current={isActive ? 'page' : undefined}
        tabIndex={0}
        data-nav-index={index}
      >
        {/* Hover icon (pops in on hover) */}
        <span className={`nav-icon ${isHovered ? 'nav-icon--visible' : ''}`}>{item.icon}</span>

        <ScrambleText text={item.label} isHovered={isHovered} isRedacting={isRedacting} />

        {/* Visit counter badge */}
        {visitCount > 0 && (
          <span className="visit-counter" title={`Accessed ${visitCount} time${visitCount !== 1 ? 's' : ''}`}>
            [{visitCount}]
          </span>
        )}

        {/* Tooltip */}
        <div className="nav-tooltip">
          <span className="tooltip-desc">{item.desc}</span>
        </div>

        {showSplash && <div className="nav-blood-splash" />}
        <div ref={threadRef} className="nav-thread" />
        {isActive && <EvidenceTag index={index} />}
        {isActive && <div className="nav-active-glow" />}
      </button>
    </li>
  )
}

// ============================================
// MAIN SLASH NAVBAR
// ============================================
const SlashNavbar = ({ ambientGlow = true, isLocked = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [hoveredItem, setHoveredItem] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isRedacting, setIsRedacting] = useState(false)
  const [atBottom, setAtBottom] = useState(false)
  const [showCaseClosed, setShowCaseClosed] = useState(false)
  // visit counts stored per session
  const [visitCounts, setVisitCounts] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('nav_visits') || '{}') } catch { return {} }
  })

  const navRef = useRef(null)

  // Redaction on route change & increment visit count
  useEffect(() => {
    setIsRedacting(true)
    setHoveredItem(null) // Reset sticky hover state on navigation
    const timer = setTimeout(() => setIsRedacting(false), 600)

    // bump visit for current route
    const activeId = NAV_ITEMS.find(it => it.path === location.pathname)?.id
    if (activeId) {
      setVisitCounts(prev => {
        const next = { ...prev, [activeId]: (prev[activeId] || 0) + 1 }
        sessionStorage.setItem('nav_visits', JSON.stringify(next))
        return next
      })
    }

    return () => clearTimeout(timer)
  }, [location.pathname])

  // Scroll compact mode + bottom detection (RAF-throttled)
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50
          if (scrolled !== isScrolled) setIsScrolled(scrolled)
          const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 50
          if (nearBottom && !atBottom) {
            setAtBottom(true)
            setShowCaseClosed(true)
            setTimeout(() => setShowCaseClosed(false), 2500)
          } else if (!nearBottom) {
            setAtBottom(false)
          }
          ticking = false
        })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [atBottom, isScrolled])

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.from(navRef.current, { y: -60, opacity: 0, duration: 1.2, ease: 'power4.out' })
      tl.from('.navbar-item', { y: -20, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }, '-=0.8')
    }, navRef)
    return () => ctx.revert()
  }, [])

  // Micro-distortion
  useEffect(() => {
    const id = setInterval(() => {
      const items = document.querySelectorAll('.navbar-item')
      const randomIdx = Math.floor(Math.random() * items.length)
      if (items[randomIdx]) {
        items[randomIdx].classList.add('nav-glitch-active')
        setTimeout(() => items[randomIdx].classList.remove('nav-glitch-active'), 200)
      }
    }, 45000)
    return () => clearInterval(id)
  }, [])

  const getActiveFromPath = (pathname) => {
    if (pathname === '/') return 'home'
    return pathname.split('/').filter(Boolean).pop() || 'home'
  }

  const activeSection = getActiveFromPath(location.pathname)
  const handleNavClick = useCallback((path) => navigate(path), [navigate])
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(p => !p), [])
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  return (
    <>
      {/* Page load progress */}
      <PageLoadProgress isLoading={isRedacting} />

      {/* "Case Closed" bottom stamp */}
      {showCaseClosed && (
        <div className="case-closed-stamp">
          <span>CASE CLOSED</span>
        </div>
      )}

      {/* Fixed navbar */}
      <nav
        ref={navRef}
        className={[
          'slash-navbar',
          ambientGlow ? 'slash-navbar--ambient-glow' : '',
          isScrolled ? 'slash-navbar--scrolled' : '',
          isScrolled ? 'microfilm-tracking' : ''
        ].join(' ')}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="nav-scan-line" />
        <div className="nav-grain-overlay" />
        <div className="navbar-nail navbar-nail--tl" />
        <div className="navbar-nail navbar-nail--tr" />

        {/* Zone 1: Brand & Interface Labels */}
        <div className="navbar-zone navbar-zone--brand">
          <div className="navbar-brand-group">
            <div className="navbar-brand">
              <div className="brand-header">
                <span className="brand-main">PRISMA 2026</span>
                <span className="brand-uni">SRM UNIVERSITY DELHI-NCR</span>
              </div>
              <div className="brand-meta">
                <span className="case-id">CLEARANCE: <span className="restricted-glow">RESTRICTED</span></span>
              </div>
            </div>
          </div>
          <div className="case-index-divider" aria-hidden="true" />
          <div className="case-index-label">CASE INTERFACE</div>
        </div>

        {/* Zone 2: Navigation Menu */}
        <div className="navbar-zone navbar-zone--menu">
          {/* Mobile toggle */}
          <button
            className={`hamburger-toggle ${isMobileMenuOpen ? 'hamburger-toggle--open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <ul className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu--open' : ''}`} role="menubar">
            {NAV_ITEMS.map((item, index) => (
              <NavItem
                key={item.id}
                item={item}
                index={index}
                isActive={activeSection === item.id}
                isLocked={isLocked}
                onClick={handleNavClick}
                onHover={setHoveredItem}
                isHovered={hoveredItem === item.id}
                onNavClick={closeMobileMenu}
                isRedacting={isRedacting}
                visitCount={visitCounts[item.id] || 0}
                onFocusNav={(idx) => {
                  const el = document.querySelector(`[data-nav-index="${idx}"]`)
                  if (el) el.focus()
                }}
              />
            ))}
          </ul>
        </div>

        {/* Zone 3: Status & Ticker */}
        <div className="navbar-zone navbar-zone--status">
          <div className="status-item">
            <span className="status-dot-pulse" />
            <span className="status-text--gold">MONITORING ACTIVE</span>
          </div>
        </div>

        {/* Mobile full-screen interrogation room overlay */}
        {isMobileMenuOpen && (
          <div className="mobile-interrogation-overlay" onClick={closeMobileMenu} />
        )}

        <div className="ambient-glow-bar" aria-hidden="true" />
      </nav>

      {/* Mobile full-screen menu */}
      {isMobileMenuOpen && (
        <div className="mobile-interrogation-room">
          <div className="interrogation-grain" />
          <div className="interrogation-vignette" />
          <div className="interrogation-spotlight" />

          <div className="interrogation-header">
            <span className="interrogation-case-id">CASE #PR-2026-X</span>
            <button className="interrogation-close" onClick={closeMobileMenu} aria-label="Close menu">✕</button>
          </div>

          <nav className="interrogation-nav">
            {NAV_ITEMS.map((item, i) => (
              <button
                key={item.id}
                className={`interrogation-link ${activeSection === item.id ? 'interrogation-link--active' : ''}`}
                onClick={() => { handleNavClick(item.path); closeMobileMenu() }}
                style={{ '--i': i }}
              >
                <span className="interrogation-icon">{item.icon}</span>
                <span className="interrogation-label">{item.label}</span>
                <span className="interrogation-desc">{item.desc}</span>
              </button>
            ))}
          </nav>

          <div className="interrogation-footer">
            MONITORING IN PROGRESS // ALL SESSIONS RECORDED
          </div>
        </div>
      )}
    </>
  )
}

export default SlashNavbar
