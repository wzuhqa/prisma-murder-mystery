import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MagneticButton from '../components/common/MagneticButton'
import RedactedText from '../components/common/RedactedText'
import './Landing.css'

// ── Config ────────────────────────────────────────────────────────────────────
const EVENT_DATE = new Date('2026-03-15T09:00:00+05:30')

const LOADING_LINES = [
    'INITIALIZING PRISMA ARCHIVE…',
    'Verifying Structural Integrity…',
    'Architect Signature: AK-01',
    'System Status: STABLE'
]

// ── Countdown hook ────────────────────────────────────────────────────────────
const useCountdown = () => {
    const [t, setT] = useState({})
    useEffect(() => {
        const calc = () => {
            const diff = EVENT_DATE - new Date()
            if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 })
            setT({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000)
            })
        }
        calc()
        const id = setInterval(calc, 1000)
        return () => clearInterval(id)
    }, [])
    return t
}

// ── Tick unit ─────────────────────────────────────────────────────────────────
const Tick = ({ value, label }) => (
    <div className="lp-tick">
        <span className="lp-tick__value">{String(value ?? '00').padStart(2, '0')}</span>
        <span className="lp-tick__label">{label}</span>
    </div>
)

// ── Main ──────────────────────────────────────────────────────────────────────
const Landing = () => {
    const navigate = useNavigate()
    const countdown = useCountdown()
    const keyBufferRef = useRef('')

    // Sequences
    const [phase, setPhase] = useState('boot') // boot -> slash -> main
    const [currentLine, setCurrentLine] = useState(0)
    const [typedText, setTypedText] = useState('')
    const [visible, setVisible] = useState(false)
    const [glitching, setGlitching] = useState(false)
    const [pulseActive, setPulseActive] = useState(false)
    const [isHoveringTitle, setIsHoveringTitle] = useState(false)
    const [letters, setLetters] = useState('PRISMA'.split(''))

    const CHARS = '!@#$%&<>?'

    // ── Mouse Parallax ────────────────────────────────────────────────────────
    const mouseX = useMotionValue(0.5)
    const mouseY = useMotionValue(0.5)

    const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 200, mass: 0.5 })
    const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 200, mass: 0.5 })

    // Map [0, 1] screen position to [-5deg, 5deg] rotation (reversed for natural tilt)
    const rotateY = useTransform(smoothMouseX, [0, 1], [-4, 4])
    const rotateX = useTransform(smoothMouseY, [0, 1], [4, -4])

    const handleMouseMove = useCallback((e) => {
        if (phase !== 'main') return
        const x = e.clientX / window.innerWidth
        const y = e.clientY / window.innerHeight
        mouseX.set(x)
        mouseY.set(y)
    }, [phase, mouseX, mouseY])

    // ── Boot typewriter ───────────────────────────────────────────────────────
    useEffect(() => {
        if (phase !== 'boot') return
        if (currentLine >= LOADING_LINES.length) {
            setTimeout(() => {
                setPhase('slash')
                setTimeout(() => {
                    setPhase('main')
                    setTimeout(() => setVisible(true), 200)
                }, 700)
            }, 400)
            return
        }
        const line = LOADING_LINES[currentLine]
        let i = 0
        const id = setInterval(() => {
            if (i <= line.length) { setTypedText(line.slice(0, i)); i++ }
            else {
                clearInterval(id)
                setTimeout(() => { setCurrentLine(p => p + 1); setTypedText('') }, 350)
            }
        }, 40)
        return () => clearInterval(id)
    }, [currentLine, phase])

    // ── Keyword easter egg ────────────────────────────────────────────────────
    useEffect(() => {
        const fn = (e) => {
            keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-20)
            if (keyBufferRef.current.includes('archive')) {
                setPulseActive(true)
                setTimeout(() => setPulseActive(false), 800)
                keyBufferRef.current = ''
            }
        }
        window.addEventListener('keypress', fn)
        return () => window.removeEventListener('keypress', fn)
    }, [])

    // ── Periodic title glitch (very rare, ~30s) ───────────────────────────────
    const runGlitch = useCallback(() => {
        const orig = 'PRISMA'.split('')
        let frame = 0
        const total = 16
        const tick = () => {
            const resolved = Math.floor((frame / total) * orig.length)
            setLetters(orig.map((ch, i) =>
                i < resolved ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
            ))
            if (++frame <= total) requestAnimationFrame(tick)
            else { setLetters(orig); setGlitching(false) }
        }
        setGlitching(true)
        requestAnimationFrame(tick)
    }, [])

    useEffect(() => {
        if (phase !== 'main') return
        const id = setInterval(() => { if (Math.random() > 0.5) runGlitch() }, 30000)
        return () => clearInterval(id)
    }, [phase, runGlitch])

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="lp" onMouseMove={handleMouseMove}>

            {/* ── Layer 0: Premium background ── */}
            <div className="lp__bg-grain" />

            {/* Animated gradient mesh — 4 slow organic colour blobs */}
            <div className="lp__bg-mesh" aria-hidden="true">
                <div className="lp__mesh-blob lp__mesh-blob--1" />
                <div className="lp__mesh-blob lp__mesh-blob--2" />
                <div className="lp__mesh-blob lp__mesh-blob--3" />
                <div className="lp__mesh-blob lp__mesh-blob--4" />
            </div>

            <div className="lp__bg-vignette" />
            <div className="lp__bg-beam" />
            <div className="lp__bg-parallax-shadow" />
            {pulseActive && <div className="lp__arg-pulse" />}

            {/* ── Corner accents ── */}
            <div className="lp__corner lp__corner--tl" />
            <div className="lp__corner lp__corner--tr" />
            <div className="lp__corner lp__corner--bl" />
            <div className="lp__corner lp__corner--br" />

            {/* ── BOOT PHASE ── */}
            {phase === 'boot' && (
                <div className="lp__boot">
                    <div className="lp__terminal">
                        {LOADING_LINES.slice(0, currentLine).map((line, i) => (
                            <div key={i} className="lp__terminal-line lp__terminal-line--done">
                                <span className="lp__terminal-tick">✓</span>{line}
                            </div>
                        ))}
                        {currentLine < LOADING_LINES.length && (
                            <div className="lp__terminal-line">
                                <span className="lp__terminal-tick lp__terminal-tick--active">›</span>
                                {typedText}<span className="lp__cursor">_</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── SLASH TRANSITION ── */}
            {phase === 'slash' && <div className="lp__slash" />}

            {/* ── MAIN PHASE ── */}
            {phase === 'main' && (
                <motion.div
                    className="lp__scene"
                    style={{ rotateX, rotateY, transformPerspective: 1200 }}
                >

                    {/* ───────────────────────────────────────────────────────────
                        LEVEL 1 — PRIMARY FOCUS
                        PRISMA title + single primary CTA
                    ─────────────────────────────────────────────────────────── */}
                    <div className={`lp__hero ${visible ? 'lp__hero--visible' : ''}`}>

                        {/* Eyebrow */}
                        <p className="lp__eyebrow">SRM UNIVERSITY DELHI-NCR // EST. 2026</p>

                        {/* PRISMA — largest, highest contrast element */}
                        <h1
                            className={`lp__title ${glitching ? 'lp__title--glitch' : ''} ${isHoveringTitle ? 'lp__title--interactive-glitch' : ''}`}
                            onMouseEnter={() => setIsHoveringTitle(true)}
                            onMouseLeave={() => setIsHoveringTitle(false)}
                        >
                            {letters.map((ch, i) => (
                                <span key={i} className="lp__title-letter" data-char={ch} style={{ '--i': i }}>{ch}</span>
                            ))}
                        </h1>

                        {/* Tagline */}
                        <p className="lp__tagline">
                            <span className="lp__tagline-rule" />
                            SOLVE THE MYSTERY. CLAIM YOUR LEGACY.
                            <span className="lp__tagline-rule" />
                        </p>

                        {/* Primary CTA — single most important action */}
                        <MagneticButton strength={0.4}>
                            <button
                                className="lp__cta-primary"
                                onClick={() => navigate('/register')}
                            >
                                <span className="lp__cta-primary__label">REGISTER NOW</span>
                                <span className="lp__cta-primary__sub">Enlist as an investigator</span>
                                <span className="lp__cta-primary__arrow">→</span>
                            </button>
                        </MagneticButton>
                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        LEVEL 2 — GLASS PANEL: secondary info
                        Countdown + secondary CTA
                    ─────────────────────────────────────────────────────────── */}
                    <div className={`lp__glass-panel ${visible ? 'lp__glass-panel--visible' : ''}`}>

                        {/* Countdown */}
                        <div className="lp__panel-section">
                            <p className="lp__panel-label">CASE CLOSES IN</p>
                            <div className="lp__clock">
                                <Tick value={countdown.d} label="DAYS" />
                                <span className="lp__clock-sep">:</span>
                                <Tick value={countdown.h} label="HRS" />
                                <span className="lp__clock-sep">:</span>
                                <Tick value={countdown.m} label="MIN" />
                                <span className="lp__clock-sep">:</span>
                                <Tick value={countdown.s} label="SEC" />
                            </div>
                        </div>

                        <div className="lp__panel-divider" />

                        {/* Secondary CTA */}
                        <MagneticButton strength={0.2} className="w-full">
                            <button
                                className="lp__cta-secondary"
                                onClick={() => navigate('/events')}
                            >
                                VIEW EVENTS →
                            </button>
                        </MagneticButton>

                        {/* Investigation meta */}
                        <div className="lp__panel-section lp__panel-meta">
                            <RedactedText text="CASE #PR-2026-X" />
                            <RedactedText text="CLEARANCE: RESTRICTED" />
                        </div>
                    </div>

                    {/* ───────────────────────────────────────────────────────────
                        LEVEL 3 — Whisper: barely visible background text
                    ─────────────────────────────────────────────────────────── */}
                    <div className={`lp__whisper ${visible ? 'lp__whisper--visible' : ''}`}>
                        <RedactedText text="MONITORING IN PROGRESS // ALL VISITORS RECORDED // CASE #PR-2026-X" />
                    </div>

                </motion.div>
            )}
        </div>
    )
}


export default Landing
