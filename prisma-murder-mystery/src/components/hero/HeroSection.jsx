import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import styles from './HeroSection.module.css';
import GlitchTitle from '../common/GlitchTitle/GlitchTitle';
import TerminalDecrypt from '../common/TerminalDecrypt/TerminalDecrypt';

/* ─── Police scanner ticker ──────────────────────────────── */
const SCANNER_MESSAGES = [
  'CASE #PR-2026-X: ACTIVE — SEARCHING FOR ARCHITECT',
  'FORENSICS REPORT: 3 ANOMALIES DETECTED',
  'LOCATION: SRM UNIVERSITY DELHI-NCR',
  'INCIDENT DATE: FEB 28 – MAR 01, 2026',
  'CLASSIFICATION: PRISMA ANOMALY — THREAT LEVEL CRITICAL',
  'DISPATCH: ALL INVESTIGATORS REPORT IMMEDIATELY',
  'EVIDENCE LOCKER: 7 ITEMS SEALED, 2 UNRESOLVED',
  'WITNESS ACCOUNTS: MATCH FOUND — IDENTITY: ARCHITECT',
];

const ScannerTicker = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimeout = null;
    const iv = setInterval(() => {
      setVisible(false);
      fadeTimeout = setTimeout(() => {
        setIdx(i => (i + 1) % SCANNER_MESSAGES.length);
        setVisible(true);
      }, 400);
    }, 3500);
    return () => {
      clearInterval(iv);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, []);

  return (
    <div className={styles.scannerTicker}>
      <span className={styles.scannerBadge}>◉ DISPATCH</span>
      <span
        className={styles.scannerText}
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.35s ease' }}
      >
        {SCANNER_MESSAGES[idx]}
      </span>
    </div>
  );
};

/* ─── Fingerprint SVG ───────────────────────────────────── */
const FingerprintStamp = () => (
  <div className={styles.fingerprint} aria-hidden="true">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M50 35 C40 35 30 41 30 50 C30 59 38 64 50 65" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 28 C35 28 22 37 22 50 C22 63 33 70 50 72" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 21 C31 21 15 33 15 50 C15 67 28 77 50 79" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 14 C27 14 8 29 8 50 C8 71 23 84 50 86" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 35 C60 35 70 41 70 50 C70 59 62 64 50 65" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 28 C65 28 78 37 78 50 C78 63 67 70 50 72" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 21 C69 21 85 33 85 50 C85 67 72 77 50 79" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M50 14 C73 14 92 29 92 50 C92 71 77 84 50 86" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  </div>
);

/* ─── Main Component ────────────────────────────────────── */
const HeroSection = () => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const routerNavigate = useNavigate();
  const [investigateHover, setInvestigateHover] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [easterEggActive, setEasterEggActive] = useState(false);
  const lampRef = useRef(null);

  /* ── Button navigation with cinematic animation ── */
  const handleNavigation = (to) => {
    if (isOpening) return;
    setIsOpening(true);
    const tl = gsap.timeline();
    tl.to('[data-slice-line]', { width: '100%', duration: 0.15, ease: 'power4.in' });
    tl.to('[data-button-text]', { y: -20, opacity: 0, duration: 0.4, ease: 'power2.inOut' }, '+=0.05');
    tl.to(sectionRef.current, {
      opacity: 0, scale: 1.1, filter: 'blur(20px)', duration: 0.8,
      onComplete: () => routerNavigate(to),
    }, '-=0.2');
  };

  /* ── Entrance: "Case file slammed on desk" ── */
  useEffect(() => {
    const tl = gsap.timeline();
    gsap.set(sectionRef.current, { opacity: 0 });
    gsap.set(lampRef.current, { scale: 0, opacity: 0 });
    if (cardRef.current) {
      // Start high + rotated, slam down with overshoot
      gsap.set(cardRef.current, { y: -120, opacity: 0, rotateX: -25, scale: 0.92 });
    }

    tl.to(sectionRef.current, { opacity: 1, duration: 0.1 });
    tl.to(lampRef.current, { scale: 1, opacity: 1, duration: 1.2, ease: 'power4.out' }, '+=0.3');

    if (cardRef.current) {
      // Slam down with a sharp bounce
      tl.to(cardRef.current, {
        y: 8, opacity: 1, rotateX: 0, scale: 1,
        duration: 0.45, ease: 'power4.in',
      }, '-=0.6');
      // Micro bounce after impact
      tl.to(cardRef.current, {
        y: 0, scale: 1,
        duration: 0.35, ease: 'elastic.out(1.2, 0.5)',
      });

      const metaRows = cardRef.current.querySelectorAll('[class*="metaRow"]');
      if (metaRows?.length) {
        tl.fromTo(metaRows,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' },
          '-=0.2'
        );
      }
      const buttons = cardRef.current.querySelectorAll('button');
      if (buttons?.length) {
        tl.fromTo(buttons,
          { opacity: 0, y: 12, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.5)' },
          '-=0.2'
        );
      }
    }
  }, []);

  /* ── 3D Mouse Tilt ── */
  useEffect(() => {
    if (!cardRef.current || isOpening) return;
    const handleMouseMove = (e) => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const rotateX = (((e.clientY - rect.top) - rect.height / 2) / (rect.height / 2)) * -1.5;
      const rotateY = (((e.clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 1.5;
      gsap.to(card, { rotateX, rotateY, duration: 0.6, ease: 'power2.out', overwrite: 'auto' });
    };
    const handleMouseLeave = () => {
      gsap.to(cardRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out', overwrite: 'auto' });
    };
    window.addEventListener('mousemove', handleMouseMove);
    cardRef.current.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cardRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpening]);

  /* ── Easter Egg ── */
  useEffect(() => {
    let buf = '';
    const secret = 'truth';
    const fn = (e) => {
      buf += e.key.toLowerCase();
      if (buf.length > secret.length) buf = buf.slice(-secret.length);
      if (buf === secret) setEasterEggActive(true);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, []);

  return (
    <section ref={sectionRef} className={styles.heroRoot}>
      <div ref={lampRef} className={styles.lampGlow} />

      <div className={styles.hiddenUneaseText}>
        <p>THE TRUTH IS OUT THERE</p>
        <p>YOU ARE NOT ALONE</p>
        <p>THEY ARE WATCHING</p>
      </div>

      <div className={styles.dustOverlay} />

      {/* ── Background Centered Watermarks ── */}
      <div className={styles.watermarkHeadingBacker}>
        CLASSIFIED<br />
        RESTRICTED
      </div>

      <div className={styles.deskBackground}>
        {/* Paperclip */}
        <div className={styles.paperclip}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </div>

        {/* Restricted Stamp */}
        <div className={styles.restrictedStamp}>RESTRICTED ACCESS</div>

        {/* Case File Card */}
        <div ref={cardRef} className={styles.caseCard}>
          {/* Folder Tab */}
          <div className={styles.folderTab}>
            <span className={styles.tabId}>FILE: #PR-2026-X</span>
          </div>

          <div className={styles.paperTexture} />
          <div className={styles.folderCrease} />

          {/* Fingerprint stamp — decorative */}
          <FingerprintStamp />

          <div className={styles.cardInner}>
            {/* Handwritten Scribble */}
            <div className={`${styles.handwrittenScribble} scratched-text`}>
              "Check the timestamps..."
            </div>

            <div className={styles.caseFileId}>DEPARTMENT OF INVESTIGATION: CLASSIFIED</div>

            {/* Title + Badge */}
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

            {/* Evidence Tag */}
            <div className={styles.evidenceTag}>
              <span className={styles.tagLabel}>EVIDENCE</span>
              <span className={styles.tagId}>#204</span>
            </div>

            <div className={styles.metaBlock}>
              <div className={styles.metaRow}>LEAD INVESTIGATOR:       <TerminalDecrypt text="AKUL" speed={80} delay={2000} /></div>
              <div className={styles.metaRow}>CASE STATUS:             <TerminalDecrypt text="ACTIVE" speed={80} delay={2200} /></div>
              <div className={styles.metaRow}>THREAT CLASSIFICATION:   <TerminalDecrypt text="HIGH" speed={80} delay={2400} /></div>
            </div>

            {/* ── Police Scanner Ticker ── */}
            <ScannerTicker />

            {/* CTA Buttons */}
            <div className={styles.buttonGroup}>
              <button
                onClick={() => handleNavigation('/events')}
                onMouseEnter={() => setInvestigateHover(true)}
                onMouseLeave={() => setInvestigateHover(false)}
                className={styles.tabButton}
                data-cursor="target"
              >
                <div className={styles.buttonSeal} />
                <div className={styles.buttonScanLine} />
                <div className={styles.sliceLine} data-slice-line />
                <div className={styles.buttonStamp}>CLASSIFIED</div>
                <div className={styles.buttonContent} data-button-text>
                  <span className={styles.tabIcon}>⌕</span>
                  OPEN INVESTIGATION
                </div>
              </button>

              <button
                onClick={() => handleNavigation('/register')}
                className={styles.approvalClip}
                data-cursor="target"
              >
                <div className={styles.buttonSeal} />
                <div className={styles.buttonScanLine} />
                <div className={styles.sliceLine} data-slice-line />
                <div className={styles.buttonStamp}>APPROVED</div>
                <div className={styles.buttonContent} data-button-text>
                  <span className={styles.tabIcon}>🎟</span>
                  <span className={styles.clipText}>BUY PASSES</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Easter Egg Terminal */}
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
