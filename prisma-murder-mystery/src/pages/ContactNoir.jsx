import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, AlertTriangle, Paperclip, MapPin, Mail, Instagram, Phone } from 'lucide-react'
import Footer from '../components/common/Footer'
import './ContactNoir.css'

const ContactNoir = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        statement: '',
        evidence: null
    })

    const [focusedField, setFocusedField] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [showStamp, setShowStamp] = useState(false)
    const [flicker, setFlicker] = useState(false)
    const [characterCount, setCharacterCount] = useState(0)
    const [showEntry, setShowEntry] = useState(true)
    const [showWatching, setShowWatching] = useState(false)
    const [deletionPulse, setDeletionPulse] = useState(false)
    const [backgroundDistort, setBackgroundDistort] = useState(false)
    const fileInputRef = useRef(null)
    const idleTimerRef = useRef(null)
    const lastStatementLength = useRef(0)

    // Entry animation sequence
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowEntry(false)
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    // Idle timeout - "We're listening" message
    useEffect(() => {
        const resetIdleTimer = () => {
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
            setShowWatching(false)

            idleTimerRef.current = setTimeout(() => {
                setShowWatching(true)
            }, 15000) // 15 seconds
        }

        const events = ['mousemove', 'keydown', 'click', 'scroll']
        events.forEach(event => window.addEventListener(event, resetIdleTimer))
        resetIdleTimer()

        return () => {
            events.forEach(event => window.removeEventListener(event, resetIdleTimer))
            if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
        }
    }, [])

    // Rare light flicker effect
    useEffect(() => {
        const flickerInterval = setInterval(() => {
            if (Math.random() > 0.95) {
                setFlicker(true)
                setTimeout(() => setFlicker(false), 100)
            }
        }, 3000)

        return () => clearInterval(flickerInterval)
    }, [])

    // Extra flicker on statement focus
    useEffect(() => {
        if (focusedField === 'statement' && Math.random() > 0.7) {
            setFlicker(true)
            setTimeout(() => setFlicker(false), 80)
        }
    }, [focusedField])

    // Background distortion on focus
    useEffect(() => {
        if (focusedField === 'statement') {
            setBackgroundDistort(true)
        } else {
            setBackgroundDistort(false)
        }
    }, [focusedField])

    // Subtle shadow movement
    useEffect(() => {
        const shadowElement = document.querySelector('.shadow-presence')
        if (!shadowElement) return

        let position = 0
        const moveShadow = () => {
            position += 0.05 // Slower movement
            const x = Math.sin(position) * 15
            const y = Math.cos(position * 0.7) * 10
            shadowElement.style.transform = `translate(${x}px, ${y}px)`
            requestAnimationFrame(moveShadow)
        }

        const animationId = requestAnimationFrame(moveShadow)
        return () => cancelAnimationFrame(animationId)
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate submission with tension
        await new Promise(resolve => setTimeout(resolve, 2500))

        setIsSubmitting(false)
        setShowStamp(true)

        // Show stamp then success message
        setTimeout(() => {
            setShowStamp(false)
            setSubmitted(true)
        }, 2000)

        // Reset after showing success
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', statement: '', evidence: null })
            setSubmitted(false)
            setCharacterCount(0)
            lastStatementLength.current = 0
            if (fileInputRef.current) fileInputRef.current.value = ''
        }, 6000)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === 'statement') {
            setCharacterCount(value.length)

            // Deletion pulse trigger
            if (lastStatementLength.current > 0 && value.length === 0) {
                setDeletionPulse(true)
                setTimeout(() => setDeletionPulse(false), 1000)
            }

            lastStatementLength.current = value.length
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        setFormData(prev => ({ ...prev, evidence: file }))
    }

    return (
        <>
            {/* Entry Animation Sequence */}
            <AnimatePresence>
                {showEntry && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="entry-sequence"
                    >
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: '120vw', opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="entry-slash"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            className="entry-text"
                        >
                            <div className="entry-line">CASE FILE OPENED</div>
                            <div className="entry-case glitch-hover" data-text="PRISMA-2K26">PRISMA-2K26</div>
                            <div className="entry-status">STATUS: ACTIVE</div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showEntry && (
                <>
                    <div className="noir-contact-container">
                        {/* Atmospheric layers */}
                        <div className="noir-vignette" />
                        <div className="noir-grain" />
                        <div className={`noir-spotlight ${flicker ? 'flicker' : ''} ${focusedField === 'statement' ? 'intensified' : ''}`} />
                        <div className={`red-ambient-pulse ${deletionPulse ? 'deletion-pulse' : ''}`} />
                        <div className="shadow-presence" />

                        {/* Background distortion */}
                        <div className={`background-distortion ${backgroundDistort ? 'active' : ''}`} />

                        {/* Drifting smoke */}
                        <div className="smoke-layer">
                            <div className="smoke smoke-1" />
                            <div className="smoke smoke-2" />
                            <div className="smoke smoke-3" />
                        </div>

                        {/* "We're listening" idle message */}
                        <AnimatePresence>
                            {showWatching && !focusedField && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 0.15 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 3 }}
                                    className="watching-message"
                                >
                                    We're listening.
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="noir-content-wrapper">
                            {/* Hero Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                className="noir-hero"
                            >
                                <div className="evidence-tag">CLASSIFIED</div>

                                <h1 className="noir-title">
                                    CONTACT
                                </h1>

                                <p className="noir-subtitle">
                                    Every statement becomes evidence.
                                </p>

                                <div className="case-number glitch-hover" data-text="CASE #2026-PRISMA">CASE #2026-PRISMA</div>
                            </motion.div>

                            {/* Background Story */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="story-panel"
                            >
                                <p>
                                    If you have information related to Prisma, submit your statement below.
                                    All reports remain <span className="highlight">confidential</span>.
                                </p>
                            </motion.div>

                            {/* Main Content Grid */}
                            <div className="content-grid">
                                {/* Case Status Side Panel */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="status-panel"
                                >
                                    <div className="status-header">CASE STATUS</div>
                                    <div className="status-divider" />

                                    <div className="status-item">
                                        <span className="status-label">CASE ID:</span>
                                        <span className="status-value glitch-hover" data-text="PRISMA-2K26">PRISMA-2K26</span>
                                    </div>

                                    <div className="status-item">
                                        <span className="status-label">STATUS:</span>
                                        <span className="status-value status-active">
                                            <span className="status-dot" />
                                            UNDER INVESTIGATION
                                        </span>
                                    </div>

                                    <div className="status-item">
                                        <span className="status-label">PRIORITY:</span>
                                        <span className="status-value status-high">HIGH</span>
                                    </div>

                                    <div className="status-item">
                                        <span className="status-label">RESPONSE TIME:</span>
                                        <span className="status-value">24–48 HRS</span>
                                    </div>

                                    <div className="status-divider" />

                                    <div className="status-footer">
                                        ACTIVE MONITORING
                                    </div>
                                </motion.div>

                                {/* Dossier Form */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                                    className="dossier-container"
                                >
                                    <div className="dossier-header">
                                        <div className="dossier-label">INTERROGATION FILE</div>
                                        <div className="dossier-stamp">CONFIDENTIAL</div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="dossier-form">
                                        {/* Subject Name */}
                                        <div className="form-field">
                                            <label htmlFor="name" className="field-label">
                                                <span className="label-text">SUBJECT NAME</span>
                                                <span className="label-required">*</span>
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('name')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="dossier-input"
                                                    placeholder="Identity required..."
                                                    disabled={isSubmitting || submitted}
                                                />
                                                <div className={`focus-line ${focusedField === 'name' ? 'active' : ''}`} />
                                            </div>
                                        </div>

                                        {/* Contact Channel */}
                                        <div className="form-field">
                                            <label htmlFor="email" className="field-label">
                                                <span className="label-text">CONTACT CHANNEL</span>
                                                <span className="label-required">*</span>
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="dossier-input"
                                                    placeholder="Secure channel..."
                                                    disabled={isSubmitting || submitted}
                                                />
                                                <div className={`focus-line ${focusedField === 'email' ? 'active' : ''}`} />
                                            </div>
                                        </div>

                                        {/* File Category */}
                                        <div className="form-field">
                                            <label htmlFor="subject" className="field-label">
                                                <span className="label-text">FILE CATEGORY</span>
                                                <span className="label-required">*</span>
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    type="text"
                                                    id="subject"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('subject')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    className="dossier-input"
                                                    placeholder="Classification..."
                                                    disabled={isSubmitting || submitted}
                                                />
                                                <div className={`focus-line ${focusedField === 'subject' ? 'active' : ''}`} />
                                            </div>
                                        </div>

                                        {/* Statement / Confession */}
                                        <div className="form-field">
                                            <label htmlFor="statement" className="field-label">
                                                <span className="label-text">STATEMENT / CONFESSION</span>
                                                <span className="label-required">*</span>
                                                <span className="character-counter">{characterCount} / 1000</span>
                                            </label>
                                            <div className="input-wrapper">
                                                <textarea
                                                    id="statement"
                                                    name="statement"
                                                    value={formData.statement}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('statement')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    maxLength={1000}
                                                    rows={6}
                                                    className="dossier-input dossier-textarea"
                                                    placeholder="Provide your testimony. Every detail is recorded..."
                                                    disabled={isSubmitting || submitted}
                                                />
                                                <div className={`focus-line ${focusedField === 'statement' ? 'active' : ''}`} />
                                            </div>
                                        </div>

                                        {/* Attach Evidence */}
                                        <div className="form-field">
                                            <label htmlFor="evidence" className="field-label">
                                                <span className="label-text">ATTACH EVIDENCE</span>
                                                <span className="label-optional">(OPTIONAL)</span>
                                            </label>
                                            <div className="evidence-upload-wrapper">
                                                <input
                                                    type="file"
                                                    id="evidence"
                                                    name="evidence"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="evidence-input"
                                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                                    disabled={isSubmitting || submitted}
                                                />
                                                <label htmlFor="evidence" className="evidence-label">
                                                    <Paperclip size={16} className="paperclip-icon" />
                                                    <span className="evidence-text">
                                                        {formData.evidence ? formData.evidence.name : 'SELECT FILE TO ATTACH'}
                                                    </span>
                                                    <span className="evidence-slot" />
                                                </label>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="form-actions">
                                            <motion.button
                                                type="submit"
                                                disabled={isSubmitting || submitted}
                                                className="evidence-stamp-button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.96 }}
                                            >
                                                <span className="stamp-text">
                                                    {isSubmitting ? 'PROCESSING...' : submitted ? 'FILED' : 'SUBMIT STATEMENT'}
                                                </span>
                                                <div className="stamp-border" />
                                                {!isSubmitting && !submitted && <Send size={16} className="stamp-icon" />}
                                            </motion.button>

                                            <div className="warning-notice">
                                                <AlertTriangle size={14} />
                                                <span>All statements are recorded and may be used in ongoing investigations</span>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Confidential Stamp Animation */}
                                    <AnimatePresence>
                                        {showStamp && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
                                                animate={{ opacity: 1, scale: 1, rotate: -8 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                                                className="confidential-stamp-overlay"
                                            >
                                                <div className="stamp-received">
                                                    FILED
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Success Message */}
                                    <AnimatePresence>
                                        {submitted && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                                                className="success-message"
                                            >
                                                <div className="success-icon">✓</div>
                                                <p className="success-text">Statement recorded.</p>
                                                <p className="success-subtext">We'll be in touch.</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            {/* Investigation Office */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="official-records"
                            >
                                <div className="records-header">
                                    <div className="header-line" />
                                    <h3 className="records-title">INVESTIGATION OFFICE</h3>
                                    <div className="header-line" />
                                </div>

                                <div className="records-grid">
                                    <div className="record-item">
                                        <MapPin size={16} className="record-icon" />
                                        <div className="record-content">
                                            <span className="record-label">LOCATION</span>
                                            <span className="record-value">SRM University, Delhi-NCR<br />Sonepat, Haryana 131029</span>
                                        </div>
                                    </div>

                                    <div className="record-item">
                                        <Mail size={16} className="record-icon" />
                                        <div className="record-content">
                                            <span className="record-label">EMAIL</span>
                                            <a href="mailto:prisma@srmuh.in" className="record-value record-link">prisma@srmuh.in</a>
                                        </div>
                                    </div>

                                    <div className="record-item">
                                        <Instagram size={16} className="record-icon" />
                                        <div className="record-content">
                                            <span className="record-label">SOCIAL</span>
                                            <a href="https://instagram.com/prisma.srmuh" target="_blank" rel="noopener noreferrer" className="record-value record-link">@prisma.srmuh</a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Lead Investigators */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="personnel-section"
                            >
                                <div className="personnel-header">
                                    <div className="header-line" />
                                    <h3 className="personnel-title">LEAD INVESTIGATORS</h3>
                                    <div className="header-line" />
                                </div>

                                <div className="personnel-grid">
                                    {/* Lakshay Card */}
                                    <div className="detective-card">
                                        <div className="card-stamp">GENERAL SECRETARY</div>
                                        <div className="detective-name">LAKSHAY</div>
                                        <div className="detective-contact">
                                            <span className="contact-label">DIRECT LINE:</span>
                                            <a href="tel:+919306023815" className="contact-number">
                                                +91 93060 23815
                                            </a>
                                        </div>
                                        <div className="card-corner top-left" />
                                        <div className="card-corner bottom-right" />
                                    </div>

                                    {/* Kartik Card */}
                                    <div className="detective-card">
                                        <div className="card-stamp">LEAD DETECTIVE</div>
                                        <div className="detective-name">KARTIK</div>
                                        <div className="detective-contact">
                                            <span className="contact-label">DIRECT LINE:</span>
                                            <a href="tel:+918827425114" className="contact-number">
                                                +91 88274 25114
                                            </a>
                                        </div>
                                        <div className="card-corner top-left" />
                                        <div className="card-corner bottom-right" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Footer warning */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.3 }}
                                transition={{ delay: 0.6, duration: 1 }}
                                className="noir-footer"
                            >
                                <p>This communication is monitored. Proceed with caution.</p>
                            </motion.div>
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}

export default ContactNoir
