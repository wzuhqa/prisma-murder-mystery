import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import styles from './HeroSection.module.css';
import GlitchTitle from '../common/GlitchTitle/GlitchTitle';
import TerminalDecrypt from '../common/TerminalDecrypt/TerminalDecrypt';

const HeroSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const [investigateHover, setInvestigateHover] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const lampRef = useRef(null);

  const navigate = (to) => {
    if (isOpening) return;
    setIsOpening(true);

    const tl = gsap.timeline();

    // Phase 1: Blade Slice (Sharp and swift)
    tl.to('[data-slice-line]', {
      width: '100%',
      duration: 0.15,
      ease: 'power4.in'
    });

    // Phase 2: Split & Separate (The "Sealed File" being opened)
    tl.to('[data-split-top]', {
      y: -40,
      x: -5,
      rotate: -2,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, '+=0.05');

    tl.to('[data-split-bottom]', {
      y: 40,
      x: 5,
      rotate: 2,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    }, '<');

    // Phase 3: Final Page Transition
    tl.to(sectionRef.current, {
      opacity: 0,
      scale: 1.1,
      filter: 'blur(20px)',
      duration: 0.8,
      onComplete: () => {
        window.location.href = import.meta.env.BASE_URL + to.substring(1);
      }
    }, '-=0.2');
  };

  // Cinematic Entrance: "Lamp Turn On" (V2.5)
  useEffect(() => {
    const tl = gsap.timeline();

    // Initial State: Darkness
    gsap.set(sectionRef.current, { opacity: 0 });
    gsap.set(lampRef.current, { scale: 0, opacity: 0 });
    if (cardRef.current) {
      gsap.set(cardRef.current, { y: 60, opacity: 0, rotateX: 20 });
    }

    // Step 1: Flicker & Lamp On
    tl.to(sectionRef.current, { opacity: 1, duration: 0.1 });
    tl.to(lampRef.current, {
      scale: 1,
      opacity: 1,
      duration: 1.2,
      ease: "power4.out"
    }, "+=0.5");

    // Step 2: Physical Elements Rise
    if (cardRef.current) {
      tl.to(cardRef.current, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1.5,
        ease: "power3.out"
      }, "-=0.8");

      // Step 3: Staggered text reveal for inner card elements
      const metaRows = cardRef.current.querySelectorAll('[class*="metaRow"]');
      if (metaRows && metaRows.length) {
        tl.fromTo(
          metaRows,
          { opacity: 0, y: 20, rotateX: -90 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out"
          },
          "-=0.5"
        );
      }

      // Step 4: Buttons fade in with stagger
      const buttons = cardRef.current.querySelectorAll('button');
      if (buttons && buttons.length) {
        tl.fromTo(
          buttons,
          { opacity: 0, y: 15, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.5)"
          },
          "-=0.3"
        );
      }
    }
  }, []);

  // Hidden Terminal Easter Egg (Invisible Ink / Code)
  useEffect(() => {
    let keyBuffer = '';
    const secretCode = 'truth'; // Type 'truth' to unlock

    const handleKeyDown = (e) => {
      keyBuffer += e.key.toLowerCase();
      if (keyBuffer.length > secretCode.length) {
        keyBuffer = keyBuffer.slice(-secretCode.length);
      }
      if (keyBuffer === secretCode) {
        setEasterEggActive(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.heroRoot}
    >
      {/* Cinematic Lamp Glow (V2.5) */}
      <div ref={lampRef} className={styles.lampGlow} />

      {/* Hidden Unease Text (V2.5) */}
      <div className={styles.hiddenUneaseText}>
        <p>THE TRUTH IS OUT THERE</p>
        <p>YOU ARE NOT ALONE</p>
        <p>THEY ARE WATCHING</p>
      </div>

      {/* Background: Red string lines (Atmospheric) */}
      <svg className={styles.redStrings} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M50,100 L300,350 L700,200 L950,450" stroke="rgba(139,0,0,0.15)" fill="none" strokeWidth="1" />
        <path d="M100,500 L400,250 L650,400 L900,150" stroke="rgba(139,0,0,1,0.12)" fill="none" strokeWidth="0.8" />
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
            <div className={`${styles.handwrittenScribble} scratched-text`}>
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
              <div className={`${styles.titleWrapper} scratched-text-heavy`}>
                <GlitchTitle text="PRISMA" />
                <span className={`${styles.reopenNote} scratched-text`}>Reopen inquiry?</span>
              </div>
            </div>

            <p className={styles.subtitle}>
              <TerminalDecrypt text="ANNUAL TECH & CULTURAL FEST" speed={40} delay={800} />
            </p>
            <p className={styles.hashtag}>
              <TerminalDecrypt text="#TheMysteryUnfolds" speed={50} delay={1200} />
            </p>
            <p className={styles.date}>
              <TerminalDecrypt text="FEB 28 – MAR 01, 2026" speed={60} delay={1600} />
            </p>

            {/* Confidential Stamp */}
            <div className={styles.confidentialStamp}>CONFIDENTIAL</div>

            {/* Evidence Tag (Pinned on top) */}
            <div className={styles.evidenceTag}>
              <span className={styles.tagLabel}>EVIDENCE</span>
              <span className={styles.tagId}>#204</span>
            </div>

            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>LEAD INVESTIGATOR:       <TerminalDecrypt text="UNKNOWN" speed={80} delay={2000} /></div>
              <div className={styles.metaRow}>CASE STATUS:             <TerminalDecrypt text="ACTIVE" speed={80} delay={2200} /></div>
              <div className={styles.metaRow}>THREAT CLASSIFICATION:   <TerminalDecrypt text="HIGH" speed={80} delay={2400} /></div>
            </div>

            {/* CTA Buttons */}
            <div className={styles.buttonGroup}>
              <button
                onClick={() => navigate('/events')}
                onMouseEnter={() => setInvestigateHover(true)}
                onMouseLeave={() => setInvestigateHover(false)}
                className={styles.tabButton}
                data-cursor="target"
              >
                <div className={styles.buttonSeal} />
                <div className={styles.sliceLine} data-slice-line />

                {/* Stamp element */}
                <div className={styles.buttonStamp}>CONFIDENTIAL</div>

                {/* Split Text Container */}
                <div className={styles.splitTextContainer}>
                  <div className={styles.splitTop} data-split-top>
                    <span className={styles.tabIcon}>⌕</span>
                    INVESTIGATE
                  </div>
                  <div className={styles.splitBottom} data-split-bottom aria-hidden="true">
                    <span className={styles.tabIcon}>⌕</span>
                    INVESTIGATE
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate('/register')}
                className={styles.approvalClip}
                data-cursor="target"
              >
                <div className={styles.buttonSeal} />
                <div className={styles.sliceLine} data-slice-line />

                {/* Stamp element */}
                <div className={styles.buttonStamp}>APPROVED</div>

                {/* Split Text Container */}
                <div className={styles.splitTextContainer}>
                  <div className={styles.splitTop} data-split-top>
                    <span className={styles.clipText}>REGISTER ACCESS</span>
                  </div>
                  <div className={styles.splitBottom} data-split-bottom aria-hidden="true">
                    <span className={styles.clipText}>REGISTER ACCESS</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Easter Egg Terminal */}
      {easterEggActive && (
        <div className={styles.easterEggTerminal}>
          <div className={styles.terminalHeader}>CLASSIFIED TERMINAL OVERRIDE</div>
          <div className={styles.terminalBody}>
            <p><TerminalDecrypt text="ACCESS GRANTED: SHADOW PROTOCOL INITIATED." speed={20} /></p>
            <p><TerminalDecrypt text="Welcome, Investigator. We have been waiting." speed={30} delay={1000} /></p>
            <p><TerminalDecrypt text="Find the fragments scattered across the pages" speed={30} delay={2500} /></p>
            <p className={styles.terminalBlink}>_</p>
          </div>
          <button className={styles.terminalClose} onClick={() => setEasterEggActive(false)}>[ X ] TERMINATE CONNECTION</button>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
