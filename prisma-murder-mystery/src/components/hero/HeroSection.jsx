import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './HeroSection.module.css';
import GlitchTitle from '../common/GlitchTitle/GlitchTitle';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [investigateHover, setInvestigateHover] = useState(false);
  const [trailPoints, setTrailPoints] = useState([]);

  const lampRef = useRef(null);
  const [isLampOn, setIsLampOn] = useState(false);

  // Cinematic Entrance: "Lamp Turn On" (V2.5)
  useEffect(() => {
    const tl = gsap.timeline();

    // Initial State: Darkness
    gsap.set(sectionRef.current, { opacity: 0 });
    gsap.set(lampRef.current, { scale: 0, opacity: 0 });
    gsap.set(cardRef.current, { y: 60, opacity: 0, rotateX: 20 });

    // Step 1: Flicker & Lamp On
    tl.to(sectionRef.current, { opacity: 1, duration: 0.1 });
    tl.to(lampRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out",
      onStart: () => setIsLampOn(true)
    }, "+=0.5");

    // Step 2: Physical Elements Rise
    tl.to(cardRef.current, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 1.5,
      ease: "power3.out"
    }, "-=0.8");
  }, []);

  // Blood Cursor Trail Logic
  const handleMouseMove = (e) => {
    const newPoint = { x: e.clientX, y: e.clientY, id: Date.now() };
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
      {/* Cinematic Lamp Glow (V2.5) */}
      <div ref={lampRef} className={styles.lampGlow} />

      {/* Hidden Unease Text (V2.5) */}
      <div className={styles.hiddenUneaseText}>
        <p>THE TRUTH IS OUT THERE</p>
        <p>YOU ARE NOT ALONE</p>
        <p>THEY ARE WATCHING</p>
      </div>

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
              <path d="M300,100 Q350,150 150,220" className={styles.threadPath} />
              <path d="M100,240 Q150,300 220,340" className={styles.threadPath} />
            </svg>

            {/* Main content: university label + PRISMA title */}
            <div className={styles.titleRow}>
              <div className={styles.universityBadge}>SRM UNIVERSITY DELHI-NCR</div>
              <div className={styles.titleWrapper}>
                <GlitchTitle text="PRISMA" />
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

            {/* Case Metadata */}
            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>LEAD INVESTIGATOR:       UNKNOWN</div>
              <div className={styles.metaRow}>CASE STATUS:             ACTIVE</div>
              <div className={styles.metaRow}>THREAT CLASSIFICATION:   HIGH</div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.buttonGroup}>
              <Link
                to="/events"
                className={styles.tabButton}
                onMouseEnter={() => {
                  setInvestigateHover(true);
                  if (typeof document !== 'undefined') document.body.classList.add('psychological-spotlight');
                }}
                onMouseLeave={() => {
                  setInvestigateHover(false);
                  if (typeof document !== 'undefined') document.body.classList.remove('psychological-spotlight');
                }}
              >
                <div className={styles.scannerLine} />
                <span className={styles.tabIcon}>⌕</span>
                {investigateHover ? 'ACCESS GRANTED' : 'ENTER INVESTIGATION'}
              </Link>

              <Link
                to="/register"
                className={styles.approvalClip}
                onMouseEnter={() => {
                  if (typeof document !== 'undefined') document.body.classList.add('psychological-spotlight');
                }}
                onMouseLeave={() => {
                  if (typeof document !== 'undefined') document.body.classList.remove('psychological-spotlight');
                }}
              >
                <div className={styles.clipPin} />
                <div className={styles.paperRipple} />
                <span className={styles.clipText}>APPROVE ACCESS</span>
                <span className={styles.clipSubtext}>GRAB PASSES</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
