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
      <div className={styles.watermarkLeft} aria-hidden="true">CONFIDENTIAL</div>
      <div className={styles.watermarkRight} aria-hidden="true">CONFIDENTIAL</div>

      {/* Background: Red string lines */}
      <svg className={styles.redStrings} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M50,100 L300,350 L700,200 L950,450" stroke="rgba(196,30,58,0.25)" fill="none" strokeWidth="1" />
        <path d="M100,500 L400,250 L650,400 L900,150" stroke="rgba(196,30,58,0.18)" fill="none" strokeWidth="0.8" />
        <path d="M200,50 L500,300 L800,100" stroke="rgba(196,30,58,0.12)" fill="none" strokeWidth="0.6" />
      </svg>

      {/* Case File Card (Manila Folder) */}
      <div ref={cardRef} className={styles.caseCard}>
        {/* Physical Folder Tab */}
        <div className={styles.folderTab}>
          <span className={styles.tabId}>PR-2026-X</span>
        </div>

        {/* Paper Texture Overlay */}
        <div className={styles.paperTexture} />

        {/* Folder Crease */}
        <div className={styles.folderCrease} />

        {/* Case File Content */}
        <div className={styles.cardInner}>
          {/* Case File ID */}
          <div className={styles.caseFileId}>DEPARTMENT OF INVESTIGATION: #PR-2026-X</div>

          {/* Main content row: university label + PRISMA title */}
          <div className={styles.titleRow}>
            <div className={styles.universityBadge}>SRM UNIVERSITY DELHI-NCR</div>
            <h1 className={styles.prismaTitle} data-text="PRISMA">PRISMA</h1>
          </div>

          {/* Subtitle */}
          <p className={styles.subtitle}>ANNUAL TECH &amp; CULTURAL FEST</p>

          {/* Hashtag */}
          <p className={styles.hashtag}>#TheMysteryUnfolds</p>

          {/* Date */}
          <p className={styles.date}>28 February to 1 March 2025</p>

          {/* Confidential Stamp */}
          <div className={styles.confidentialStamp}>CONFIDENTIAL</div>

          {/* Evidence Tag */}
          <div className={styles.evidenceTag}>
            <span className={styles.tagLabel}>EVIDENCE</span>
            <span className={styles.tagId}>#204</span>
          </div>

          {/* Case Metadata */}
          <div className={styles.metaBlock}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>LEAD INVESTIGATOR:</span>
              <span className={styles.metaValue}>UNKNOWN</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>STATUS:</span>
              <span className={styles.metaValue}>OPEN</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>THREAT LEVEL:</span>
              <span className={styles.metaValue} style={{ color: '#c41e3a' }}>HIGH</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={styles.buttonGroup}>
            <Link
              to="/events"
              className={`${styles.btn} ${styles.btnRed}`}
              onClick={(e) => {
                const btn = e.currentTarget;
                const circle = document.createElement('span');
                const diameter = Math.max(btn.clientWidth, btn.clientHeight);
                const radius = diameter / 2;
                const rect = btn.getBoundingClientRect();

                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${e.clientX - rect.left - radius}px`;
                circle.style.top = `${e.clientY - rect.top - radius}px`;
                circle.classList.add(styles.ripple);

                const ripple = btn.getElementsByClassName(styles.ripple)[0];
                if (ripple) {
                  ripple.remove();
                }

                btn.appendChild(circle);
              }}
            >
              <span className={styles.btnIcon}>⌕</span>
              INVESTIGATE EVENTS →
            </Link>
            <Link
              to="/register"
              className={`${styles.btn} ${styles.btnGold}`}
              onClick={(e) => {
                const btn = e.currentTarget;
                const circle = document.createElement('span');
                const diameter = Math.max(btn.clientWidth, btn.clientHeight);
                const radius = diameter / 2;
                const rect = btn.getBoundingClientRect();

                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${e.clientX - rect.left - radius}px`;
                circle.style.top = `${e.clientY - rect.top - radius}px`;
                circle.classList.add(styles.ripple);

                const ripple = btn.getElementsByClassName(styles.ripple)[0];
                if (ripple) {
                  ripple.remove();
                }

                btn.appendChild(circle);
              }}
            >
              <span className={styles.btnIcon}>⇥</span>
              GRAB YOUR PASSES
            </Link>
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
