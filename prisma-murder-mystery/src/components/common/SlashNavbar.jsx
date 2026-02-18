import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './SlashNavbar.css'

// ============================================
// NAVIGATION ITEMS CONFIGURATION
// Murder Mystery themed navigation
// ============================================
const NAV_ITEMS = [
  { id: 'home', label: 'HOME', path: '/' },
  { id: 'events', label: 'ACTIVE CLUES', path: '/events' },
  { id: 'team', label: 'INVESTIGATORS', path: '/team' },
  { id: 'about', label: 'ARCHIVES', path: '/about' },
  { id: 'contact', label: 'SUBMIT REPORT', path: '/contact' }
]



const NavItem = ({ item, isActive, isLocked, onClick, onHover, isHovered, onNavClick }) => {
  const linkRef = useRef(null)
  const particleRefs = useRef([])
  const animationRef = useRef(null)
  const isGlitchingRef = useRef(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const glitchTimeoutRef = useRef(null)
  const isActiveRef = useRef(false)
  const particlesData = useRef([])
  const hoverStartTime = useRef(null)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const mouseVelocityRef = useRef(0)
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 })

  // Initialize particle data with optimized count (reduced from 30 to 12)
  useEffect(() => {
    particlesData.current = Array.from({ length: 12 }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -Math.random() * 0.8 - 0.4,
      life: 0,
      maxLife: 0.6 + Math.random() * 0.6,
      size: 2 + Math.random() * 2,
      color: '#ff4d00',
      opacity: 0,
      type: 'subtle'
    }))
  }, [])

  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [])

  const animateRef = useRef()

  // Advanced Horror Animation loop
  const animate = useCallback(() => {
    const isStillActive = isActiveRef.current
    const isGlitching = isGlitchingRef.current
    let hasActiveParticles = false

    const duration = hoverStartTime.current ? (Date.now() - hoverStartTime.current) : 0
    const intensity = Math.min(1, duration / 1200)

    particlesData.current.forEach((p, i) => {
      if (p.life <= 0) {
        const spawnChance = 0.8 - (intensity * 0.3)
        if (isStillActive && Math.random() > spawnChance) {
          p.x = (Math.random() - 0.5) * 80
          p.y = (Math.random() - 0.5) * 15
          p.life = p.maxLife
          p.opacity = 0.5 + Math.random() * 0.3

          if (intensity > 0.8 && Math.random() > 0.7) {
            p.type = 'heavy'
            p.color = '#330000'
          } else if (intensity > 0.4 && Math.random() > 0.6) {
            p.type = 'bright'
            p.color = '#ff9500'
          } else {
            p.type = 'subtle'
            p.color = '#a40000'
          }
        } else {
          p.opacity = 0
        }
      } else {
        p.life -= 0.016
        if (isStillActive) {
          const dx = mousePosRef.current.x - p.x
          const dy = mousePosRef.current.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            const pull = (100 - dist) / 5000
            p.vx += dx * pull
            p.vy += dy * pull
          }
        }
        p.x += p.vx + Math.sin(p.life * 8) * (0.3 + intensity * 0.5)
        p.y += p.vy
        const lifeRatio = p.life / p.maxLife
        p.opacity = Math.max(0, (0.4 + intensity * 0.4) * (lifeRatio < 0.2 ? lifeRatio * 5 : 1))
        hasActiveParticles = true
      }

      if (particleRefs.current[i]) {
        const el = particleRefs.current[i]
        el.style.opacity = p.opacity
        el.style.transform = `translate(${p.x}px, ${p.y}px)`
        el.style.backgroundColor = p.color
        el.className = `shimmer-particle shimmer-particle--${p.type}`
        if (isGlitching) {
          p.vx *= 1.2; p.vy *= 1.2; p.life -= 0.02
        }
      }
    })

    // Apply text distortion based on mouse velocity and glitch state
    if (linkRef.current) {
      const skew = Math.min(10, mouseVelocityRef.current * 2) * (mousePosRef.current.x > 0 ? 1 : -1)
      const blur = Math.min(2, mouseVelocityRef.current * 0.5)
      const chromShift = isGlitching ? Math.random() * 5 : Math.min(3, mouseVelocityRef.current)

      linkRef.current.style.transform = `skewX(${skew}deg)`
      linkRef.current.style.filter = `blur(${blur}px)`
      linkRef.current.style.textShadow = chromShift > 1
        ? `${chromShift}px 0 #ff0000, -${chromShift}px 0 #00ffff`
        : 'none'

      // Decay velocity
      mouseVelocityRef.current *= 0.9
    }

    if (isStillActive || hasActiveParticles || isGlitching) {
      animationRef.current = requestAnimationFrame(animateRef.current)
    }
  }, [])

  useEffect(() => {
    animateRef.current = animate
  }, [animate])

  const handleMouseEnter = () => {
    isActiveRef.current = true
    hoverStartTime.current = Date.now()
    onHover(item.id)
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    animationRef.current = requestAnimationFrame(animate)
  }

  const handleMouseMove = (e) => {
    if (!linkRef.current) return

    // Throttle to 60fps max (16ms)
    const now = Date.now()
    if (now - lastMousePosRef.current.time < 16) return

    const rect = linkRef.current.getBoundingClientRect()
    const newX = e.clientX - rect.left - rect.width / 2
    const newY = e.clientY - rect.top - rect.height / 2

    // Calculate velocity
    const dx = newX - lastMousePosRef.current.x
    const dy = newY - lastMousePosRef.current.y
    const dt = now - lastMousePosRef.current.time
    if (dt > 0) {
      const vel = Math.sqrt(dx * dx + dy * dy) / dt
      mouseVelocityRef.current = Math.min(5, (mouseVelocityRef.current + vel) / 2)
    }

    mousePosRef.current = { x: newX, y: newY }
    lastMousePosRef.current = { x: newX, y: newY, time: now }
  }

  const handleMouseLeave = () => {
    isActiveRef.current = false
    hoverStartTime.current = null
    onHover(null)
  }

  const handleClick = () => {
    if (isGlitchingRef.current || isLocked) return

    isGlitchingRef.current = true
    setIsGlitching(true)

    // Trigger splash and navigation
    glitchTimeoutRef.current = setTimeout(() => {
      onClick(item.path)
      onNavClick()
      isGlitchingRef.current = false
      setIsGlitching(false)
    }, 500)
  }

  const particleElements = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => (
      <span
        key={i}
        ref={(el) => (particleRefs.current[i] = el)}
        className="shimmer-particle"
      />
    )), []
  )

  return (
    <li className="navbar-item">
      <button
        ref={linkRef}
        className={`navbar-link ${isActive ? 'navbar-link--active' : ''} ${isHovered ? 'navbar-link--hovered' : ''} ${isGlitching ? 'navbar-link--glitching' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={isLocked}
        aria-current={isActive ? 'page' : undefined}
      >
        {/* Static flash for glitch */}
        <div className="static-flash" aria-hidden="true" />
        <div className="blood-container">
          <div className="blood-underline"></div>
          <div className="blood-drop" style={{ left: '20%', animationDelay: '0.3s' }}></div>
          <div className="blood-drop" style={{ left: '50%', animationDelay: '0.5s' }}></div>
          <div className="blood-drop" style={{ left: '80%', animationDelay: '0.4s' }}></div>
        </div>
        <span className="shards-container">{particleElements}</span>
        <span className="link-text" data-text={item.label}>{item.label}</span>
      </button>
    </li>
  )
}

// ============================================
// MAIN SLASH NAVBAR COMPONENT
// Integrated with React Router and NavigationContext
// ============================================
const SlashNavbar = ({ ambientGlow = true, isLocked = false }) => {
  // Router hooks
  const navigate = useNavigate()
  const location = useLocation()



  // Local state for navigation control
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Refs for preventing double triggers
  const lastClickRef = useRef(null)
  const animationTimeoutRef = useRef(null)

  // Animation timing constants (in ms)
  const TIMING = {
    ANTICIPATION: 120,      // Build-up phase
    IMPACT: 150,            // Slash travel time
    DARKNESS: 150,          // Black screen beat
    AFTERMATH: 300,         // Fade-in with particles
    TOTAL: 720,             // Total animation duration
    DEBOUNCE: 100          // Minimum time between clicks
  }

  // Determine current active section from route
  const getActiveFromPath = (pathname) => {
    if (pathname === '/') return 'home'
    const segment = pathname.split('/').filter(Boolean).pop() || 'home'
    // Map old paths to new ones for backwards compatibility
    const pathMap = {
      'case-files': 'events',

      'register': 'contact'
    }
    return pathMap[segment] || segment
  }

  const activeSection = getActiveFromPath(location.pathname)

  // Handle navigation click without slash animation
  const handleNavClick = useCallback((path) => {
    // Normalize paths for comparison
    const currentPath = location.pathname
    const targetPath = path

    // Prevent clicking the same section (allow refresh to home)
    if (currentPath === targetPath && targetPath !== '/') {
      return
    }

    // Debounce: prevent rapid clicks
    const now = Date.now()
    if (lastClickRef.current && (now - lastClickRef.current) < TIMING.DEBOUNCE) {
      return
    }
    lastClickRef.current = now

    // Navigate directly without animation
    navigate(path)
  }, [location.pathname, navigate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])



  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])



  // Toggle mobile menu
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  // Close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      {/* Fixed navbar */}
      <nav
        className={`slash-navbar ${ambientGlow ? 'slash-navbar--ambient-glow' : ''}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Physical Structural Depth: Nail Heads */}
        <div className="navbar-nail navbar-nail--tl"></div>
        <div className="navbar-nail navbar-nail--tr"></div>

        <div className="navbar-brand">
          <div className="brand-header">
            <span className="brand-main">PRISMA 2026</span>
            <span className="brand-uni">SRM UNIVERSITY DELHI-NCR</span>
          </div>
          <div className="brand-meta">
            <span className="case-id">CASE ID: #PR-2026-X</span>
            <span className="clearance-level">CLEARANCE: <span className="restricted-glow">RESTRICTED</span></span>
          </div>
        </div>

        <div className="case-index-divider" aria-hidden="true" />

        <div className="case-index-label">CASE INDEX</div>

        {/* Mobile menu toggle button */}
        <button
          className={`hamburger-toggle ${isMobileMenuOpen ? 'hamburger-toggle--open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Access Status Indicator */}
        <div className="navbar-status">
          <div className="status-item">
            <span className="status-dot-pulse"></span>
            <span className="status-text--gold">ACCESS VERIFIED</span>
          </div>
        </div>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'navbar-menu--open' : ''}`} role="menubar">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              isLocked={isLocked}
              onClick={handleNavClick}
              onHover={setHoveredItem}
              isHovered={hoveredItem === item.id}
              onNavClick={closeMobileMenu}
            />
          ))}
        </ul>

        {/* Ambient glow bar */}
        <div className="ambient-glow-bar" aria-hidden="true" />
      </nav>
    </>
  )
}

export default SlashNavbar
