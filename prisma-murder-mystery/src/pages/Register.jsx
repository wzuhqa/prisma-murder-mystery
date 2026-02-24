import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import ArchiveInput from '../components/register/ArchiveInput';
import ArchiveButton from '../components/register/ArchiveButton';

/* ─── Typewriter helper ─────────────────────────────────────── */
const useTypewriter = (text, speed = 40, delay = 0) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    setDisplayed('');
    let i = 0;
    let iv = null;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(t);
      if (iv) clearInterval(iv);
    };
  }, [text, speed, delay]);
  return displayed;
};

/* ─── Success Screen ────────────────────────────────────────── */
const SuccessScreen = ({ caseRef }) => {
  const text = useTypewriter(`ACCESS GRANTED — CASE FILE ${caseRef} OPENED.`, 30, 300);
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ background: '#080808' }}
    >
      {/* Venetian Blind Shadows Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `repeating-linear-gradient(
            transparent,
            transparent 60px,
            rgba(0, 0, 0, 0.2) 60px,
            rgba(0, 0, 0, 0.2) 120px
          )`,
          mixBlendMode: 'multiply',
          opacity: 0.5,
        }}
      />

      {/* Interrogation Lamp Effect */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '5%', left: '10%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(255,255,230,0.1) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      />

      {/* Film grain noise overlay - simplified for performance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      <div className="text-center max-w-lg mx-auto space-y-10 relative z-10">

        {/* Physical seal or stamp */}
        <motion.div
          className="mx-auto w-24 h-24 flex items-center justify-center relative"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        >
          {/* Outer dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#8B0000] opacity-50 animate-[spin_10s_linear_infinite]" />
          {/* Inner seal */}
          <div
            className="w-20 h-20 bg-[#1A1A1A] flex items-center justify-center"
            style={{ clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)' }}
          >
            <span style={{ fontSize: '2.5rem', color: '#C41E3A' }}>✓</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          {/* Typewriter text */}
          <p className="font-special-elite font-bold text-sm tracking-[0.2em] uppercase mb-6" style={{ color: '#E8E8E8' }}>
            {text}<span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse align-middle" />
          </p>

          {/* Forensic Reference Docket */}
          <div
            className="relative p-8 md:p-10 font-special-elite text-sm md:text-base tracking-[0.2em] bg-[#0A0A0C] border border-white/5 mx-auto max-w-xl"
            style={{
              color: '#808088',
              boxShadow: '0 20px 50px rgba(0,0,0,1), inset 0 0 30px rgba(0,0,0,0.8)',
              clipPath: 'polygon(0 0, 95% 0, 100% 10%, 100% 100%, 0 100%)'
            }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B0000] to-transparent opacity-50" />

            <div className="flex flex-col space-y-4 text-left">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="opacity-50">STATUS:</span>
                <span style={{ color: '#C41E3A', fontWeight: 'bold' }}>VERIFIED</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="opacity-50">OPERATIVE UID:</span>
                <span style={{ color: '#C41E3A', fontWeight: 'bold', fontSize: '1.2rem' }}>{caseRef}</span>
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs font-mono tracking-widest uppercase" style={{ color: '#505058' }}>
            Transmission logged. Await further operative briefing.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ─── Glitch Title ──────────────────────────────────────────── */
const GlitchTitle = ({ text }) => {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 300);
    }, 8000 + Math.random() * 4000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative inline-block">
      <h1
        className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.12em] uppercase"
        style={{
          color: '#E8E8E8',
          textShadow: glitching
            ? '2px 0 rgba(196,30,58,0.7), -2px 0 rgba(196,30,58,0.4)'
            : '0 2px 8px rgba(0,0,0,0.6)',
          transform: glitching ? `translateX(${(Math.random() * 4 - 2).toFixed(1)}px)` : 'none',
          transition: 'all 0.05s',
        }}
      >
        {text}
      </h1>
      {glitching && (
        <h1
          aria-hidden="true"
          className="absolute inset-0 font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.12em] uppercase pointer-events-none"
          style={{ color: 'rgba(196,30,58,0.35)', transform: 'translateX(3px) translateY(-1px)', top: 0 }}
        >
          {text}
        </h1>
      )}
    </div>
  );
};

/* ─── Main Register Page ────────────────────────────────────── */
const Register = () => {
  const cardRef = useRef(null);

  /* 3D tilt via Framer Motion springs */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [1.2, -1.2]), { stiffness: 60, damping: 15 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-1.2, 1.2]), { stiffness: 60, damping: 15 });

  /* Lamp spotlight — tracks mouse using motion values (no re-renders) */
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);

  // Create a memoized spotlight gradient string using motion values
  const spotlightGradient = useMotionTemplate`radial-gradient(circle 280px at ${spotX}% ${spotY}%, rgba(255,255,230,0.04) 0%, transparent 80%)`;

  // Throttled mouse handler using requestAnimationFrame
  const rafRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (rafRef.current) return; // Skip if frame already scheduled

    rafRef.current = requestAnimationFrame(() => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mouseX.set(nx);
      mouseY.set(ny);
      spotX.set((e.clientX / window.innerWidth) * 100);
      spotY.set((e.clientY / window.innerHeight) * 100);
      rafRef.current = null;
    });
  }, [mouseX, mouseY, spotX, spotY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  /* Form state */
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', college: '', teamName: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseRef, setCaseRef] = useState('');

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = 'Subject identity required';
    if (!formData.email.trim()) e.email = 'Contact channel required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid address format';
    if (!formData.phone.trim()) e.phone = 'Comm frequency required';
    if (!formData.college.trim()) e.college = 'Affiliation required';
    if (!formData.teamName.trim()) e.teamName = 'Unit designation required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSubmitting(false);
    setCaseRef(`PRISMA-${Date.now().toString(36).toUpperCase()}`);
    setSubmitted(true);
  };

  if (submitted) return <SuccessScreen caseRef={caseRef} />;

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        /* Deep cinematic darkroom aesthetic - simplified for performance */
        background: '#080808',
        backgroundImage: `
          radial-gradient(circle at 60% 30%, rgba(139, 0, 0, 0.03) 0%, transparent 55%),
          radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.6) 100%)
        `,
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1rem, 4vw, 2rem) clamp(3rem, 6vh, 5rem)',
        perspective: '2000px',
      }}
    >
      {/* ── Venetian Blind Shadows Overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `repeating-linear-gradient(
            transparent,
            transparent 60px,
            rgba(0, 0, 0, 0.25) 60px,
            rgba(0, 0, 0, 0.25) 120px
          )`,
          mixBlendMode: 'multiply',
          opacity: 0.6,
        }}
      />

      {/* ── Atmospheric Haze (Static, no animation for performance) ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(139,0,0,0.05) 0%, transparent 50%)',
          willChange: 'auto',
        }}
      />

      {/* ── Lamp glow (Harsher interrogation lamp, top-left) ── */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '5%', left: '10%',
          width: 'min(700px, 100vw)',
          height: 'min(700px, 100vh)',
          background: 'radial-gradient(circle, rgba(255,255,230,0.12) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      />

      {/* ── Mouse-tracking narrow spotlight (GPU accelerated via motion) ── */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: spotlightGradient,
          willChange: 'background',
        }}
      />

      {/* ── Film grain noise overlay (CSS-only for performance) ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          willChange: 'auto',
        }}
      />

      {/* ── Background Centered Watermarks (match hero style) ── */}
      <div
        className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
        style={{
          zIndex: 0,
        }}
      >
        <div
          style={{
            fontSize: 'clamp(6rem, 20vw, 15rem)',
            fontFamily: 'Courier New, monospace',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.012)',
            transform: 'rotate(-10deg)',
            textAlign: 'center',
            lineHeight: 0.8,
            whiteSpace: 'nowrap',
          }}
        >
          CLASSIFIED<br />
          RESTRICTED
        </div>
      </div>

      {/* ─────── CASE FILE CARD ─────── */}
      <motion.div
        ref={cardRef}
        className="relative z-10 w-full"
        style={{
          maxWidth: '1080px', // Increased from 960px for a massive, cinematic feel
          margin: '0 auto',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 60, rotateX: 15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Physical Folder Tab Overlay */}
        <div
          className="absolute flex items-center justify-center"
          style={{
            top: '-32px', right: '5%',
            height: 34,
            width: 'min(40%, 140px)',
            background: 'rgba(139, 0, 0, 0.85)',
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)',
            boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.1)',
            zIndex: -1,
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <span
            className="font-special-elite font-bold tracking-[0.2em] uppercase"
            style={{ color: '#fff', fontSize: '0.65rem' }}
          >
            TOP SECRET
          </span>
        </div>

        {/* Card Main Body */}
        <div
          className="relative"
          style={{
            background: '#121216',
            backgroundImage: `
              radial-gradient(circle at 100% 0%, rgba(139, 0, 0, 0.03) 0%, transparent 40%),
              linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4))
            `,
            boxShadow: '0 40px 80px rgba(0,0,0,1), inset 0 0 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            // Asymmetrical weathered document clip path with scorched corners
            clipPath: `polygon(2% 0%, 95% 0%, 100% 5%, 100% 95%, 98% 100%, 0% 100%)`,
            overflow: 'hidden',
            willChange: 'auto',
          }}
        >
          {/* Scorched Corner Effect */}
          <div
            className="absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-20"
            style={{
              background: 'radial-gradient(circle at top right, #000 0%, transparent 70%)',
              zIndex: 20,
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none opacity-15"
            style={{
              background: 'radial-gradient(circle at bottom left, #000 0%, transparent 60%)',
              zIndex: 20,
            }}
          />
          {/* Subtle weathered edges overlay */}
          <div className="absolute inset-0 pointer-events-none z-10 opacitiy-30"
            style={{
              boxShadow: 'inset 0 0 150px rgba(0,0,0,0.8), inset 0 0 50px rgba(139,0,0,0.05)',
              mixBlendMode: 'multiply'
            }}
          />

          {/* Environmental Storytelling: Coffee Ring Stain */}
          <div
            className="absolute pointer-events-none opacity-[0.08]"
            style={{
              top: '15%',
              right: '10%',
              width: '180px',
              height: '180px',
              border: '2px solid rgba(139,0,0,0.4)',
              borderRadius: '50%',
              filter: 'blur(1px)',
              transform: 'scale(1.1, 0.95) rotate(-15deg)',
              zIndex: 5,
            }}
          />

          {/* Faint internal CONFIDENTIAL rubber stamp watermark */}
          <div
            className="absolute inset-0 pointer-events-none select-none flex items-center justify-center overflow-hidden"
            style={{ zIndex: 0 }}
          >
            <div
              className="font-special-elite font-bold"
              style={{
                fontSize: '14rem',
                color: 'rgba(139,0,0,0.025)',
                transform: 'rotate(-35deg) scale(1.6)',
                whiteSpace: 'nowrap',
                border: '12px solid rgba(139,0,0,0.025)',
                padding: '2rem 4rem',
                letterSpacing: '0.2em'
              }}
            >
              CLASSIFIED
            </div>
          </div>

          <div style={{ padding: 'clamp(3rem, 7vw, 5rem)' }} className="space-y-10 relative z-10">

            {/* ── Header ── */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Department ID */}
              <div
                className="font-special-elite text-xs md:text-sm tracking-[0.4em] uppercase"
                style={{
                  color: '#C41E3A',
                  marginBottom: '1.5rem',
                  textShadow: '0 0 10px rgba(196,30,58,0.2)'
                }}
              >
                // DEPT. OF INVESTIGATION // REGISTRATION
              </div>

              <div className="mb-6">
                <GlitchTitle text="JOIN THE INVESTIGATION" />
              </div>

              {/* Red accent slash — matches hero style */}
              <motion.div
                className="h-px"
                style={{ background: 'linear-gradient(90deg, #8B0000, #C41E3A 40%, transparent)' }}
                initial={{ width: 0 }}
                animate={{ width: '55%' }}
                transition={{ delay: 0.5, duration: 0.7 }}
              />

              <p className="font-mono text-sm tracking-[0.15em]" style={{ color: '#505058' }}>
                Registration required to access restricted files
              </p>
            </motion.div>

            {/* ── Meta row ── */}
            <motion.div
              className="font-special-elite text-sm md:text-base space-y-3"
              style={{ borderLeft: '2px solid rgba(139,0,0,0.5)', paddingLeft: '1.5rem', color: '#606068' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div>CASE STATUS: <span style={{ color: '#C41E3A', fontWeight: 'bold' }}>ACCEPTING OPERATIVES</span></div>
              <div>DEADLINE: <span style={{ color: '#808088' }}>FEB 25, 2026</span></div>
            </motion.div>

            {/* ── Divider ── */}
            <div className="flex items-center gap-4 py-6 md:py-10">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))' }} />
              <span className="font-special-elite text-base tracking-[0.4em] uppercase" style={{ color: '#4a4a5a' }}>
                OPERATIVE ID
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(-90deg, transparent, rgba(255,255,255,0.1))' }} />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} noValidate>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.4 } },
                }}
              >
                {[
                  { id: 'name', name: 'name', label: 'Full Name', placeholder: 'Subject identity', type: 'text', autoComplete: 'name', fullWidth: false },
                  { id: 'email', name: 'email', label: 'Email Address', placeholder: 'operative@domain.com', type: 'email', autoComplete: 'email', fullWidth: false },
                  { id: 'phone', name: 'phone', label: 'Phone Number', placeholder: '+91 98765 43210', type: 'tel', autoComplete: 'tel', fullWidth: false },
                  { id: 'college', name: 'college', label: 'Institution / Affiliation', placeholder: 'Your college or institution', type: 'text', fullWidth: false },
                  { id: 'teamName', name: 'teamName', label: 'Team Name', placeholder: 'Operative unit designation', type: 'text', fullWidth: true },
                ].map(f => (
                  <motion.div
                    key={f.id}
                    className={f.fullWidth ? "md:col-span-2" : ""}
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <ArchiveInput
                      {...f}
                      value={formData[f.name]}
                      onChange={handleChange}
                      error={errors[f.name]}
                      required
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Massive Spacer & Section Header */}
              <div className="pt-24 md:pt-40" />

              <motion.div
                className="space-y-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center gap-6">
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(139,0,0,0.4))' }} />
                  <div
                    className="font-special-elite text-sm md:text-base tracking-[0.5em] uppercase px-4 py-2 border-2 border-[#8B0000]/30 transform rotate-[-2deg]"
                    style={{
                      color: '#8B0000',
                      boxShadow: 'inset 0 0 10px rgba(139,0,0,0.1)'
                    }}
                  >
                    SUBMISSION PROTOCOL
                  </div>
                  <div className="flex-1 h-px" style={{ background: 'linear-gradient(-90deg, transparent, rgba(139,0,0,0.4))' }} />
                </div>

                {/* Submit button container */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-center">
                    <ArchiveButton type="submit" isLoading={isSubmitting} className="w-full" style={{ borderRadius: '2px' }}>
                      <span
                        className="font-mono text-sm md:text-base tracking-[0.4em] uppercase"
                        style={{ color: 'rgba(235,235,235,0.95)', letterSpacing: '0.4em' }}
                      >
                        ⌕ Initiate Registration
                      </span>
                    </ArchiveButton>
                  </div>
                </motion.div>
              </motion.div>
            </form>

            {/* Footer */}
            <div
              className="flex items-center justify-between pt-6 mt-10 md:mt-12"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="font-special-elite text-xs md:text-sm tracking-[0.3em] uppercase" style={{ color: '#404048' }}>
                PRISMA 2026 // RESTRICTED
              </span>
              <span className="font-special-elite text-xs md:text-sm tracking-[0.3em] uppercase" style={{ color: '#404048' }}>
                SRM UNIVERSITY NCR
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
