import { memo, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import styles from './HeroSection.module.css'

const HeroSection = memo(function HeroSection() {
  const cardRef = useRef(null)

  useLayoutEffect(() => {
    if (!cardRef.current) return
    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 32, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.2 }
      )
    }, cardRef)

    // Scroll Trigger Logic
    const handleScroll = () => {
      if (!cardRef.current) return
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Calculate opacity/scale based on scroll
      const fadeStart = 0
      const fadeEnd = windowHeight * 0.5

      let progress = (scrollY - fadeStart) / (fadeEnd - fadeStart)
      progress = Math.max(0, Math.min(1, progress)) // Clamp 0-1

      // Fade OUT Card: 1 -> 0
      const cardOpacity = 1 - progress
      const cardScale = 1 - (progress * 0.05)

      // Fade IN Strings: 0.2 -> 1 (accentuate them)
      const stringOpacity = 0.2 + (progress * 0.8)
      const stringScale = 1 + (progress * 0.1)

      // Apply transforms
      cardRef.current.style.opacity = cardOpacity
      cardRef.current.style.transform = `scale(${cardScale})`

      const strings = document.querySelector(`.${styles.redStrings}`)
      if (strings) {
        strings.style.opacity = stringOpacity
        strings.style.transform = `scale(${stringScale})`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      ctx.revert()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <section
      className={styles.heroRoot}
      aria-label="Prisma Festival Hero"
    >
      {/* Background: CONFIDENTIAL watermarks */}
      const [investigateHover, setInvestigateHover] = useState(false);
      const [trailPoints, setTrailPoints] = useState([]);

  // Blood Cursor Trail Logic
  const handleMouseMove = (e) => {
    const newPoint = {x: e.clientX, y: e.clientY, id: Date.now() };
    setTrailPoints(prev => [...prev.slice(-15), newPoint]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
        setTrailPoints(prev => prev.slice(1));
    }, 100);
    return () => clearInterval(timer);
  }, []);

      return (
      <section
        ref={sectionRef}
        className={styles.heroRoot}
        onMouseMove={handleMouseMove}
      >
        {/* Blood Cursor Trail */}
        {trailPoints.map((p, i) => (
          <div
            key={p.id}
            className={styles.bloodTrail}
            style={{
              left: p.x,
              top: p.y,
              opacity: i / trailPoints.length * 0.3,
              transform: `scale(${i / trailPoints.length})`
            }}
          />
        ))}

        {/* Background: Red string lines (Atmospheric) */}
        <svg className={styles.redStrings} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <path d="M50,100 L300,350 L700,200 L950,450" stroke="rgba(139,0,0,0.15)" fill="none" strokeWidth="1" />
          <path d="M100,500 L400,250 L650,400 L900,150" stroke="rgba(139,0,0,0.12)" fill="none" strokeWidth="0.8" />
        </svg>

        {/* Dust Particles Layer */}
        <div className={styles.dustOverlay} />

        {/* Desk Background Wrapper */}
        <div className={styles.deskBackground}>
          {/* Physical Paperclip */}
          <div className={styles.paperclip}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </div>

          {/* Restricted Stamp */}
          <div className={styles.restrictedStamp}>
            RESTRICTED ACCESS
          </div>

          {/* Case File Card (Manila Folder) */}
          <div ref={cardRef} className={styles.caseCard}>
            {/* Folder Tab */}
            <div className={styles.folderTab}>
              <span className={styles.tabId}>FILE: #PR-2026-X</span>
            </div>

            <div className={styles.paperTexture} />
            <div className={styles.folderCrease} />

            <div className={styles.cardInner}>
              {/* Handwritten Scribble */}
              <div className={styles.handwrittenScribble}>
                "Check the timestamps..."
              </div>

              <div className={styles.caseFileId}>DEPARTMENT OF INVESTIGATION: CLASSIFIED</div>

              {/* Evidence Threads (Logic Connections) */}
              <svg className={styles.evidenceThreads} viewBox="0 0 600 400">
                {/* Thread from PRISMA to Threat Level */}
                <path d="M300,100 Q350,150 150,220" className={styles.threadPath} />
                {/* Thread from Threat Level to Investigate Button */}
                <path d="M100,240 Q150,300 220,340" className={styles.threadPath} />
              </svg>

              {/* Main content: university label + PRISMA title */}
              <div className={styles.titleRow}>
                <div className={styles.universityBadge}>SRM UNIVERSITY DELHI-NCR</div>
                <div className={styles.titleWrapper}>
                  <h1 className={styles.prismaTitle}>PRISMA</h1>
                  <span className={styles.reopenNote}>Reopen inquiry?</span>
                </div>
              </div>

              <p className={styles.subtitle}>ANNUAL TECH &amp; CULTURAL FEST</p>
              <p className={styles.hashtag}>#TheMysteryUnfolds</p>
              <p className={styles.date}>FEB 28 – MAR 01, 2026</p>

              {/* Confidential Stamp */}
              <div className={styles.confidentialStamp}>CONFIDENTIAL</div>

              {/* Evidence Tag (Pinned on top) */}
              <div className={styles.evidenceTag}>
                <span className={styles.tagLabel}>EVIDENCE</span>
                <span className={styles.tagId}>#204</span>
              </div>

              {/* Case Metadata (Institutional Formatting) */}
              <div className={styles.metaBlock}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>LEAD INVESTIGATOR:       UNKNOWN</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>CASE STATUS:             ACTIVE</span>
                </div>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>THREAT CLASSIFICATION:   HIGH</span>
                </div>
              </div>

              {/* CTA Buttons (Tabs & Slips) */}
              <div className={styles.buttonGroup}>
                <Link
                  to="/events"
                  className={styles.tabButton}
                  onMouseEnter={() => setInvestigateHover(true)}
                  onMouseLeave={() => setInvestigateHover(false)}
                >
                  <div className={styles.scannerLine} />
                  <span className={styles.tabIcon}>⌕</span>
                  {investigateHover ? 'ACCESS GRANTED' : 'ENTER INVESTIGATION'}
                </Link>

                <Link to="/register" className={styles.approvalClip}>
                  <div className={styles.clipPin} />
                  <div className={styles.paperRipple} />
                  <span className={styles.clipText}>APPROVE ACCESS</span>
                  <span className={styles.clipSubtext}>GRAB PASSES</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className={styles.scrollIndicator} onClick={scrollToNext} role="button" tabIndex={0} aria-label="Scroll down">
          <div className={styles.scrollLine} />
          <span className={styles.scrollText}>SCROLL</span>
        </div>
      </section>
      )
})

      export default HeroSection
