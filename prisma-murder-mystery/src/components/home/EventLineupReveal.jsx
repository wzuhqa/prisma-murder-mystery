import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './EventLineupReveal.css'

const EventLineupReveal = () => {

  // Fixed random-looking positions for pixel fragments
  const PIXEL_POSITIONS = [
    { id: 1, left: 3, top: 7, delay: 0.2 },
    { id: 2, left: 92, top: 12, delay: 1.5 },
    { id: 3, left: 8, top: 89, delay: 0.8 },
    { id: 4, left: 95, top: 85, delay: 2.1 },
    { id: 5, left: 15, top: 3, delay: 1.2 },
    { id: 6, left: 88, top: 5, delay: 0.5 },
    { id: 7, left: 2, top: 45, delay: 1.8 },
    { id: 8, left: 97, top: 52, delay: 2.5 },
    { id: 9, left: 5, top: 95, delay: 0.9 },
    { id: 10, left: 90, top: 92, delay: 1.1 },
    { id: 11, left: 25, top: 2, delay: 2.8 },
    { id: 12, left: 78, top: 98, delay: 1.4 }
  ]

  // No longer using internal interval-based state for animations to reduce rerenders
  // Instead, using CSS animations for system flicker and scan lines

  const [isDecrypted, setIsDecrypted] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const [showWhisper, setShowWhisper] = useState(null)

  const handleDecrypt = () => {
    setIsRevealing(true)
    setTimeout(() => {
      setIsDecrypted(true)
      setIsRevealing(false)
    }, 400)
  }

  const handleRegister = () => {
    // Placeholder for register action
    window.open('https://forms.gle/your-form-id', '_blank')
  }

  const ARTIST_DATA = [
    { id: 'subject-01', cid: 'Subject 01', name: 'Identity Redacted', realName: 'COMING SOON', silhouette: 'standing' },
    { id: 'subject-02', cid: 'Subject 02', name: 'Identity Redacted', realName: 'STAY TUNED', silhouette: 'seated' },
    { id: 'subject-03', cid: 'Subject 03', name: 'File Classified', realName: 'CLASSIFIED', silhouette: 'hooded' },
    { id: 'subject-04', cid: 'Subject 04', name: 'Pending Clearance', realName: 'PENDING CLEARANCE', silhouette: 'leaning' },
    { id: 'subject-05', cid: 'Subject 05', name: 'Data Corrupted', realName: 'FILE CORRUPTED', silhouette: 'shadow' }
  ]

  return (
    <section className={`lineup-hero system-flicker-periodical ${isRevealing ? 'revealing' : ''}`}>
      {/* Hidden Binary Code Background - "WHO IS COMING?" */}
      <div className="lineup-binary-bg">
        <div className="lineup-binary-text">
          01010111 01001000 01001111 00100000 01001001 01010011 00100000 01000011 01001111 01001101 01001001 01001110 01000111
        </div>
      </div>

      {/* Background gradient */}
      <div className="lineup-bg-gradient" />

      {/* Animated smoke/fog */}
      <div className="lineup-smoke-container">
        <div className="lineup-smoke lineup-smoke-1" />
        <div className="lineup-smoke lineup-smoke-2" />
        <div className="lineup-smoke lineup-smoke-3" />
      </div>

      {/* Scan lines overlay */}
      <div className="lineup-scanlines">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="lineup-scanline" style={{ top: `${i * 5}%` }} />
        ))}
      </div>

      {/* Moving scan line - Now CSS animated */}
      <div className="lineup-moving-scan-css" />

      {/* Film grain texture */}
      <div className="lineup-grain" />

      {/* Digital noise in corners */}
      <div className="lineup-noise-container">
        <div className="lineup-noise corner-tl" />
        <div className="lineup-noise corner-tr" />
        <div className="lineup-noise corner-bl" />
        <div className="lineup-noise corner-br" />
      </div>

      {/* Vignette effect */}
      <div className="lineup-vignette" />

      {/* Hidden distorted face (barely visible) */}
      <div className="lineup-hidden-face">
        <svg viewBox="0 0 200 200" className="lineup-face-svg">
          <defs>
            <filter id="faceDistort">
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="30" />
            </filter>
          </defs>
          <ellipse cx="100" cy="90" rx="50" ry="70" fill="#1a1a2e" filter="url(#faceDistort)" opacity="0.15" />
          <ellipse cx="80" cy="75" rx="8" ry="10" fill="#0b0b1a" filter="url(#faceDistort)" opacity="0.1" />
          <ellipse cx="120" cy="75" rx="8" ry="10" fill="#0b0b1a" filter="url(#faceDistort)" opacity="0.1" />
        </svg>
      </div>

      {/* Flickering pixel fragments near edges */}
      <div className="lineup-pixel-fragments">
        {PIXEL_POSITIONS.map((fragment) => (
          <div
            key={fragment.id}
            className="lineup-pixel-fragment"
            style={{
              left: `${fragment.left}%`,
              top: `${fragment.top}%`,
              animationDelay: `${fragment.delay}s`
            }}
          />
        ))}
      </div>

      {/* Top indicator bar */}
      <div className="lineup-top-bar">
        <div className="lineup-status-capsule">
          <span className="lineup-blinking-dot" />
          <span className="lineup-status-text">LIVE SYSTEM MONITORING</span>
        </div>
      </div>

      {/* Main content container */}
      <div className="lineup-content">
        {/* Main headline */}
        <h1 className="lineup-headline scratched-text-heavy">
          <span className="lineup-headline-main">UNAUTHORIZED PERFORMANCE</span>
          <span className="lineup-headline-sub">SCHEDULED</span>
          {/* Glitch slices */}
          <span className="lineup-glitch-slice slice-1" />
          <span className="lineup-glitch-slice slice-2" />
        </h1>

        {/* Subtext */}
        <p className="lineup-subtext">
          <span className="lineup-subtext-inner">ARTIST IDENTITY ENCRYPTED</span>
        </p>

        {/* Visual focus element - Concert stage with spotlight */}
        <div className="lineup-stage-container">
          <div className="lineup-stage">
            {/* Fog layers */}
            <div className="lineup-stage-fog" />

            {/* Spotlight */}
            <div className="lineup-spotlight">
              <div className="lineup-spotlight-cone" />
              <div className="lineup-spotlight-source" />
            </div>

            {/* Artist silhouette with glitch */}
            <div className="lineup-silhouette">
              <svg viewBox="0 0 200 300" className="lineup-silhouette-svg">
                <defs>
                  <filter id="glitchDistort">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                  <filter id="digitalTear">
                    <feOffset dx="0" dy="2" />
                    <feGaussianBlur stdDeviation="1" />
                  </filter>
                </defs>
                {/* Body */}
                <ellipse cx="100" cy="250" rx="40" ry="45" fill="#0a0a12" filter="url(#glitchDistort)" />
                {/* Head */}
                <circle cx="100" cy="80" r="35" fill="#0a0a12" filter="url(#glitchDistort)" />
                {/* Micro digital tearing */}
                <rect x="85" y="60" width="30" height="3" fill="#0b0b1a" opacity="0.8" className="lineup-tear" />
                <rect x="90" y="100" width="20" height="2" fill="#0b0b1a" opacity="0.8" className="lineup-tear" />
                <rect x="80" y="150" width="40" height="2" fill="#0b0b1a" opacity="0.8" className="lineup-tear" />
                <rect x="95" y="200" width="25" height="3" fill="#0b0b1a" opacity="0.8" className="lineup-tear" />
              </svg>
            </div>
          </div>
        </div>

        {/* Corner frame markers */}
        <div className="lineup-corner-markers">
          <div className="lineup-corner corner-tl" />
          <div className="lineup-corner corner-tr" />
          <div className="lineup-corner corner-bl" />
          <div className="lineup-corner corner-br" />
        </div>

        {/* Artist Dossiers Grid */}
        <div className="lineup-dossier-grid">
          {ARTIST_DATA.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              isDecrypted={isDecrypted}
              onWhisper={(msg) => setShowWhisper(msg)}
            />
          ))}
        </div>

        {/* Global Whisper Text */}
        <AnimatePresence>
          {showWhisper && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="lineup-whisper"
            >
              {showWhisper}
            </motion.div>
          )}
        </AnimatePresence>

        {/* "More suspects incoming" teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="lineup-teaser-pulse"
          style={{
            textAlign: 'center',
            marginTop: '40px',
            fontFamily: 'monospace',
            fontSize: '13px',
            letterSpacing: '0.3em',
            color: 'rgba(139, 0, 0, 0.6)',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ animation: 'digitFlicker 3s ease-in-out infinite' }}>▓▓▓</span>
          {' '}MORE SUSPECTS INCOMING{' '}
          <span style={{ animation: 'digitFlicker 3s ease-in-out infinite 1s' }}>▓▓▓</span>
        </motion.div>

        {/* Terminal status text */}
        <div className="lineup-terminal-ui">
          <div className="lineup-status-left">&gt; STATUS: {isDecrypted ? 'DECRYPTED' : 'ENCRYPTED'}</div>
          <div className="lineup-status-right">&gt; ACCESS LEVEL: {isDecrypted ? 'AUTHORIZED' : 'RESTRICTED'}</div>
        </div>

        {/* Buttons */}
        <div className="lineup-buttons">
          <button className="lineup-btn lineup-btn-decrypt" onClick={handleDecrypt}>
            <span className="lineup-btn-glow" />
            <span className="lineup-btn-text">Decrypt Lineup</span>
          </button>
          <button className="lineup-btn lineup-btn-register" onClick={handleRegister}>
            <span className="lineup-btn-text">Register Access</span>
          </button>
        </div>
      </div>

      {/* Chromatic aberration overlay */}
      <div className="lineup-chromatic" />

      {/* Cyan edge glitch accents */}
      <div className="lineup-cyan-edge" />
    </section>
  )
}


const ArtistCard = ({ artist, isDecrypted, onWhisper }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Flicker effects now handled by CSS animations (no re-renders)
  // See .artist-card and .lineup-hero CSS for animation definitions

  return (
    <motion.div
      className={`artist-card ${isDecrypted ? 'revealed' : 'locked'} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => {
        setIsHovered(true)
        if (!isDecrypted) onWhisper("Information sealed.")
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        onWhisper(null)
      }}
      layout
    >
      <div className="card-inner">
        {/* PHYSICAL ASSET DECORATIONS */}
        <div className="card-notch corner-tl" />
        <div className="card-notch corner-br" />
        <div className="stamp-classified">CLASSIFIED</div>

        {/* TOP: Case File Header */}
        <div className="card-header">
          <span className="case-id" data-text={artist.cid}>
            {artist.cid}
          </span>
          <div className="header-meta">ARCHIVE_REF: {artist.id.toUpperCase()}</div>
        </div>

        {/* CENTER: Portrait Container */}
        <div className="portrait-container">
          <div className="portrait-frame">
            <div className="portrait-silhouette">
              {/* Silhouette handled by CSS background with automatic flicker */}
            </div>
            <div className="portrait-overlay">
              <div className="static-noise" />
              <div className="grain-overlay" />
              <div className="light-sweep" />
            </div>
          </div>

          {/* Redacted Bar Animation */}
          <AnimatePresence>
            {!isDecrypted && (
              <motion.div
                className="redacted-bar-portrait"
                exit={{ x: '100%', opacity: 0 }}
                transition={{ duration: 0.5, ease: "circIn" }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* BOTTOM: Artist Identity Section */}
        <div className="card-footer">
          <div className="identity-label">
            <span className="label-text">IDENTITY:</span>
            <span className="label-status">{isDecrypted ? 'UNCLASSIFIED' : 'REDACTED'}</span>
          </div>

          <div className="artist-name-wrapper">
            <h3 className="artist-name scratched-text">
              {isDecrypted ? artist.realName : artist.name}
            </h3>
            <AnimatePresence>
              {!isDecrypted && (
                <motion.div
                  className="redacted-bar-name"
                  exit={{ scaleX: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="case-status-bar">
            <span className="status-label">STATUS:</span>
            <span className="status-value pulsate">UNDER OBSERVATION</span>
          </div>
        </div>

        {/* Locked Overlay Effects */}
        {!isDecrypted && (
          <div className="locked-effects">
            <div className="scanline-tiny" />
            <div className={`glitch-flicker ${isHovered ? 'active' : ''}`} />
          </div>
        )}

        {/* Reveal Glitch Elements */}
        {isDecrypted && (
          <div className="reveal-elements">
            <div className="rgb-split" />
            <div className="ember-particles" />
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default EventLineupReveal

