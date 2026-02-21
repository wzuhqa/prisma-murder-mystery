import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SpecterArchive.css';

gsap.registerPlugin(ScrollTrigger);

const artists = [
  {
    id: 1,
    name: 'NECROMANTIC SYMPHONY',
    year: '2019',
    description: 'Their cursed melodies summoned entities from beyond the veil. The crowd vanished into static.',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop&sat=-100&bri=-30&con=50'
  },
  {
    id: 2,
    name: 'VOID WALKER',
    year: '2020',
    description: 'Stepped through the membrane between dimensions. Footage corrupted beyond recovery.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop&sat=-100&bri=-30&con=50'
  },
  {
    id: 3,
    name: 'ETHEREAL DECAY',
    year: '2021',
    description: 'Their sound dissolved reality itself. Only whispers remain in the data stream.',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=300&fit=crop&sat=-100&bri=-30&con=50'
  },
  {
    id: 4,
    name: 'PHANTOM FREQUENCY',
    year: '2022',
    description: 'Broadcast from the other side. The signal was intercepted but the source was never found.',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&h=300&fit=crop&sat=-100&bri=-30&con=50'
  },
  {
    id: 5,
    name: 'SPECTRAL ECHO',
    year: '2023',
    description: 'Their final performance was erased. Only artifacts remain in the corrupted archive.',
    image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop&sat=-100&bri=-30&con=50'
  },
  {
    id: 6,
    name: 'PRISMA PHANTOM',
    year: '2026',
    description: 'The mystery returns. An unprecedented auditory experience awaits at Prisma 2026.',
    image: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&h=300&fit=crop&sat=-100&bri=-30&con=50'
  }
];

// Card component with 3D tilt and interactions
function ArtistCard({ artist, index, isActive, onMouseMove, onMouseLeave }) {
  const cardRef = useRef(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: '50%', y: '50%' });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    onMouseMove?.(index);
  }, [index, onMouseMove]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onMouseLeave?.(index);
  }, [index, onMouseLeave]);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className={`artist-card ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `scale(${isHovered ? 1.02 : 1})`,
        '--spotlight-x': spotlightPos.x,
        '--spotlight-y': spotlightPos.y,
        zIndex: 10 - index
      }}
    >
      <div className="card-spotlight" />
      <div className="card-background" style={{ backgroundImage: `url(${artist.image})` }} />
      <div className="card-glitch-overlay" />

      <div className="card-inner-glow" />

      <div className="card-content">
        <div className={`year-badge ${isActive ? 'active' : ''}`}>
          <span className="year-number">{artist.year}</span>
          <div className="year-glow" />
        </div>
        <h3 className="artist-name">{artist.name}</h3>
        <p className="artist-description">{artist.description}</p>
      </div>

      {/* Background image optimized for lazy loading */}
      <img
        src={artist.image}
        alt={`Visual representation for ${artist.name}`}
        loading="lazy"
        className="hidden" // Just to trigger lazy load while being handled by CSS background
      />

      <div className="card-scan-line" />
    </motion.div>
  );
}

// Horizontal scroll timeline component
function HorizontalTimeline({ artists }) {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.3 });

  useEffect(() => {
    if (!isInView || !containerRef.current) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll('.h-timeline-card');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${container.scrollWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      cards.forEach((card, i) => {
        tl.fromTo(card,
          { opacity: 0.3, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
          },
          i * 0.3
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isInView]);

  return (
    <div className="horizontal-timeline-section" ref={sectionRef}>
      <div className="h-timeline-container" ref={containerRef}>
        {artists.map((artist, index) => (
          <div
            key={`h-${artist.id}`}
            className="h-timeline-card"
            style={{ '--index': index }}
          >
            <div className="h-year-display">{artist.year}</div>
            <div className="h-card-image" style={{ backgroundImage: `url(${artist.image})` }} />
            <h4 className="h-card-title">{artist.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

// Parallax background component
function ParallaxBackground({ sectionRef }) {
  const fog1Ref = useRef(null);
  const fog2Ref = useRef(null);
  const fog3Ref = useRef(null);
  const scanlineRef = useRef(null);
  const grainRef = useRef(null);

  useEffect(() => {
    let rafId = null;
    let sectionTop = 0;

    const measure = () => {
      const el = sectionRef?.current;
      if (!el) return;
      sectionTop = el.offsetTop;
    };

    const apply = () => {
      rafId = null;
      const el = sectionRef?.current;
      if (!el) return;

      const relativeScroll = window.scrollY - sectionTop;
      if (relativeScroll < 0) return;

      // All updates are transform-only (GPU-friendly)
      fog1Ref.current && (fog1Ref.current.style.transform = `translate3d(0, ${relativeScroll * 0.1}px, 0)`);
      fog2Ref.current && (fog2Ref.current.style.transform = `translate3d(0, ${relativeScroll * 0.15}px, 0)`);
      fog3Ref.current && (fog3Ref.current.style.transform = `translate3d(0, ${relativeScroll * 0.2}px, 0)`);
      scanlineRef.current && (scanlineRef.current.style.transform = `translate3d(0, ${relativeScroll * 0.05}px, 0)`);
      grainRef.current && (grainRef.current.style.transform = `translate3d(0, ${relativeScroll * 0.03}px, 0)`);
    };

    const onScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(apply);
    };

    measure();
    apply();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, [sectionRef]);

  return (
    <>
      <div className="fog-layer fog-layer-1" ref={fog1Ref} />
      <div className="fog-layer fog-layer-2" ref={fog2Ref} />
      <div className="fog-layer fog-layer-3" ref={fog3Ref} />
      <div className="scan-lines" ref={scanlineRef} />
      <div className="film-grain" ref={grainRef} />
    </>
  );
}

// Main SpecterArchive component
function SpecterArchive() {
  const [activeCard, setActiveCard] = useState(0);
  const [showGhosts, setShowGhosts] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const sectionRef = useRef(null);
  const footerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const cardRefs = useRef({});
  const [stringLinks, setStringLinks] = useState([]);

  // Pre-defined connections between artists (by index)
  const connections = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 4]
  ];

  const updateStrings = useCallback(() => {
    if (!cardsContainerRef.current) return;
    const containerRect = cardsContainerRef.current.getBoundingClientRect();

    const newLinks = connections.map(([startIdx, endIdx]) => {
      const startEl = cardRefs.current[startIdx];
      const endEl = cardRefs.current[endIdx];

      if (!startEl || !endEl) return null;

      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();

      // Pin positions (top center of the card wrapper)
      const startX = startRect.left + startRect.width / 2 - containerRect.left;
      const startY = startRect.top + 10 - containerRect.top;

      const endX = endRect.left + endRect.width / 2 - containerRect.left;
      const endY = endRect.top + 10 - containerRect.top;

      // Calculate droop for the thread
      const midX = (startX + endX) / 2;
      const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const midY = (startY + endY) / 2 + distance * 0.15; // 15% droop

      return {
        id: `${startIdx}-${endIdx}`,
        path: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`
      };
    }).filter(Boolean);

    setStringLinks(newLinks);
  }, []);

  useEffect(() => {
    // Initial calculation after layout
    const timer = setTimeout(updateStrings, 300);
    window.addEventListener('resize', updateStrings);

    let observer;
    if (cardsContainerRef.current) {
      observer = new ResizeObserver(updateStrings);
      observer.observe(cardsContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateStrings);
      if (observer) observer.disconnect();
    };
  }, [updateStrings]);



  // Ghosts animation
  useEffect(() => {
    const timer = setTimeout(() => setShowGhosts(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Rare glitch effect - triggered every 20-30 seconds
  useEffect(() => {
    const triggerGlitch = () => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    };

    const scheduleNextGlitch = () => {
      const delay = 20000 + Math.random() * 10000; // 20-30 seconds
      return setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    };

    const timeoutId = scheduleNextGlitch();
    return () => clearTimeout(timeoutId);
  }, []);

  // Footer visibility tracking
  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const footerVariants = {
    hidden: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section
      className={`specter-archive`}
      ref={sectionRef}
    >
      <div className="microfilm-jitter" />
      <div className="forensic-stamp stamp-restricted">RESTRICTED ACCESS</div>
      <div className="forensic-stamp stamp-corrupted">DATA CORRUPTED</div>
      <div className="specter-bg-gradient evidence-board-bg" />

      <ParallaxBackground sectionRef={sectionRef} />

      {/* Glitch overlay */}
      <div className={`global-glitch ${glitchActive ? 'active' : ''}`}>
        <div className="glitch-r" />
        <div className="glitch-g" />
        <div className="glitch-b" />
      </div>

      <div className={`ghost-silhouettes ${showGhosts ? 'visible' : ''}`}>
        <div className="ghost ghost-1" />
        <div className="ghost ghost-2" />
        <div className="ghost ghost-3" />
      </div>

      <div className="vignette" />

      <div className="specter-content" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="specter-heading-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h1 className="specter-heading scratched-text-heavy">
            <span className="heading-text">SUMMON THE SPECTERS</span>
            <span className="heading-sub">OF PAST PERFORMERS</span>
          </h1>
        </motion.div>

        <motion.p
          className="specter-subheading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          They once took the stage. Their energy still echoes.
        </motion.p>

        {/* Year indicators */}
        <div className="year-indicators">
          {artists.map((artist, index) => (
            <button
              key={artist.id}
              className={`year-indicator ${activeCard === index ? 'active' : ''}`}
              onClick={() => setActiveCard(index)}
            >
              <span className="year-dot" />
              <span className="year-label">{artist.year}</span>
            </button>
          ))}
        </div>

        <motion.div
          key="vertical"
          className="artist-cards-container evidence-scattered"
          ref={cardsContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(5px)' }}
          transition={{ duration: 0.5 }}
        >
          {/* Dynamic SVG Red Strings */}
          <svg className="global-red-strings">
            <defs>
              <filter id="string-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <AnimatePresence>
              {stringLinks.map((link) => (
                <motion.path
                  key={link.id}
                  d={link.path}
                  fill="none"
                  stroke="#8b0000"
                  strokeWidth="3"
                  filter="url(#string-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{
                    strokeDasharray: "10 3",
                  }}
                />
              ))}
            </AnimatePresence>
          </svg>

          {artists.map((artist, index) => {
            // Pseudo-random rotation for evidence board look
            const rotation = (index % 2 === 0 ? 1 : -1) * ((index * 3) % 8 + 2);
            return (
              <div
                key={artist.id}
                className="evidence-item-wrapper"
                ref={(el) => (cardRefs.current[index] = el)}
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="evidence-pin" />
                <ArtistCard
                  artist={artist}
                  index={index}
                  isActive={activeCard === index}
                  onMouseMove={(idx) => setActiveCard(idx)}
                  onMouseLeave={() => { }}
                />
              </div>
            );
          })}
        </motion.div>

        {/* Footer */}
        <motion.footer
          className="specter-footer"
          ref={footerRef}
          variants={footerVariants}
          initial="hidden"
          animate={footerVisible ? 'visible' : 'hidden'}
        >
          <div className="footer-mask-reveal">
            <span className="footer-text">THEIR LEGACY STILL LINGERS</span>
          </div>
          <div className="smoke-effect" />
          <div className="footer-underline" />
        </motion.footer>
      </div>
    </section>
  );
}

export default SpecterArchive;

