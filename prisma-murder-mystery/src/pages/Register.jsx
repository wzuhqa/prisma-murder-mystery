import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, MapPin, Mail, Instagram, Shield } from 'lucide-react'
import Footer from '../components/common/Footer'
import './ContactNoir.css'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    teamName: ''
  })

  // Pass and Hostel selection state
  const [passSelected, setPassSelected] = useState(true)
  const [day1Hostel, setDay1Hostel] = useState(null) // null | 'no-mess' | 'with-mess'
  const [day2Hostel, setDay2Hostel] = useState(null) // null | 'no-mess' | 'with-mess'

  const [focusedField, setFocusedField] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showStamp, setShowStamp] = useState(false)
  const [flicker, setFlicker] = useState(false)
  const [showEntry, setShowEntry] = useState(true)
  const [showWatching, setShowWatching] = useState(false)
  const [backgroundDistort, setBackgroundDistort] = useState(false)
  const [caseRef, setCaseRef] = useState('')
  const idleTimerRef = useRef(null)

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

  // Extra flicker on any field focus
  useEffect(() => {
    if (focusedField && Math.random() > 0.7) {
      setFlicker(true)
      setTimeout(() => setFlicker(false), 80)
    }
  }, [focusedField])

  // Background distortion on focus
  useEffect(() => {
    if (focusedField) {
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

  // Price Calculation
  const calculateTotal = () => {
    let total = 0
    if (passSelected) total += 1000
    if (day1Hostel === 'no-mess') total += 300
    if (day1Hostel === 'with-mess') total += 500
    if (day2Hostel === 'no-mess') total += 300
    if (day2Hostel === 'with-mess') total += 500
    return total
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const submissionData = {
      ...formData,
      passDetails: {
        eventPass: passSelected,
        day1Hostel,
        day2Hostel,
        totalPrice: calculateTotal()
      }
    }

    // Simulate submission with tension
    await new Promise(resolve => setTimeout(resolve, 2500))

    setIsSubmitting(false)
    setCaseRef(`PRISMA-${Date.now().toString(36).toUpperCase()}`)
    setShowStamp(true)

    // Show stamp then success message
    setTimeout(() => {
      setShowStamp(false)
      setSubmitted(true)
    }, 2000)

    // Reset after showing success
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', college: '', teamName: '' })
      setPassSelected(true)
      setDay1Hostel(null)
      setDay2Hostel(null)
      setSubmitted(false)
    }, 8000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
              <div className="entry-line">REGISTRATION INITIATED</div>
              <div className="entry-case">PRISMA-2K26</div>
              <div className="entry-status">STATUS: PENDING</div>
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
            <div className={`noir-spotlight ${flicker ? 'flicker' : ''} ${focusedField ? 'intensified' : ''}`} />
            <div className="red-ambient-pulse" />
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
                  Monitoring active.
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
                <div className="evidence-tag">RESTRICTED ACCESS</div>

                <h1 className="noir-title">
                  REGISTRATION
                </h1>

                <p className="noir-subtitle">
                  Every operative must be logged.
                </p>

                <div className="case-number">DIRECTORATE PRIORITY</div>
              </motion.div>

              {/* Background Story */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="story-panel"
              >
                <p>
                  To access restricted files and engage in the investigation, you must register your unit.
                  All personal credentials remain <span className="highlight">confidential</span>.
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
                  <div className="status-header">SYSTEM STATUS</div>
                  <div className="status-divider" />

                  <div className="status-item">
                    <span className="status-label">ENROLLMENT:</span>
                    <span className="status-value status-active">
                      <span className="status-dot" />
                      OPEN
                    </span>
                  </div>

                  <div className="status-item">
                    <span className="status-label">CLEARANCE:</span>
                    <span className="status-value status-high">PENDING</span>
                  </div>

                  <div className="status-item">
                    <span className="status-label">EVENT DATES:</span>
                    <span className="status-value">MAR 13 – MAR 14</span>
                  </div>

                  <div className="status-divider" />

                  <div className="status-footer">
                    AWAITING INPUT
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
                    <div className="dossier-label">OPERATIVE REGISTRATION</div>
                    <div className="dossier-stamp">CONFIDENTIAL</div>
                  </div>

                  <form onSubmit={handleSubmit} className="dossier-form">
                    {/* Pass Selection */}
                    <div className="form-section-title">SELECT PASS</div>
                    <div className="pass-selection-card">
                      <div className="pass-option main-pass">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={passSelected}
                            onChange={(e) => setPassSelected(e.target.checked)}
                          />
                          <span className="checkmark" />
                          <div className="option-info">
                            <span className="option-name">Event Pass</span>
                            <span className="option-price">₹1000</span>
                          </div>
                        </label>
                      </div>

                      <div className="form-section-title mt-6">HOSTEL ACCOMMODATION (OPTIONAL)</div>

                      {/* Day 1 Options */}
                      <div className="hostel-day-cluster">
                        <div className="day-label">DAY 1</div>
                        <div className="hostel-options">
                          <label className={`radio-container ${day1Hostel === 'no-mess' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="day1Hostel"
                              checked={day1Hostel === 'no-mess'}
                              onChange={() => setDay1Hostel(day1Hostel === 'no-mess' ? null : 'no-mess')}
                              onClick={() => setDay1Hostel(day1Hostel === 'no-mess' ? null : 'no-mess')}
                            />
                            <span className="radio-mark" />
                            <div className="option-info">
                              <span className="option-name">Without Mess</span>
                              <span className="option-price">+₹300</span>
                            </div>
                          </label>
                          <label className={`radio-container ${day1Hostel === 'with-mess' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="day1Hostel"
                              checked={day1Hostel === 'with-mess'}
                              onChange={() => setDay1Hostel(day1Hostel === 'with-mess' ? null : 'with-mess')}
                              onClick={() => setDay1Hostel(day1Hostel === 'with-mess' ? null : 'with-mess')}
                            />
                            <span className="radio-mark" />
                            <div className="option-info">
                              <span className="option-name">With Mess</span>
                              <span className="option-price">+₹500</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Day 2 Options */}
                      <div className="hostel-day-cluster mt-4">
                        <div className="day-label">DAY 2</div>
                        <div className="hostel-options">
                          <label className={`radio-container ${day2Hostel === 'no-mess' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="day2Hostel"
                              checked={day2Hostel === 'no-mess'}
                              onChange={() => setDay2Hostel(day2Hostel === 'no-mess' ? null : 'no-mess')}
                              onClick={() => setDay2Hostel(day2Hostel === 'no-mess' ? null : 'no-mess')}
                            />
                            <span className="radio-mark" />
                            <div className="option-info">
                              <span className="option-name">Without Mess</span>
                              <span className="option-price">+₹300</span>
                            </div>
                          </label>
                          <label className={`radio-container ${day2Hostel === 'with-mess' ? 'active' : ''}`}>
                            <input
                              type="radio"
                              name="day2Hostel"
                              checked={day2Hostel === 'with-mess'}
                              onChange={() => setDay2Hostel(day2Hostel === 'with-mess' ? null : 'with-mess')}
                              onClick={() => setDay2Hostel(day2Hostel === 'with-mess' ? null : 'with-mess')}
                            />
                            <span className="radio-mark" />
                            <div className="option-info">
                              <span className="option-name">With Mess</span>
                              <span className="option-price">+₹500</span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Total Display */}
                      <div className="price-summary-box">
                        <div className="total-label">TOTAL INVESTIGATION FEE</div>
                        <div className="total-amount">₹{calculateTotal()}</div>
                      </div>
                    </div>

                    <div className="form-section-title mt-8">OPERATIVE DETAILS</div>
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

                    {/* Contact Channel (Email) */}
                    <div className="form-field">
                      <label htmlFor="email" className="field-label">
                        <span className="label-text">CONTACT CHANNEL (EMAIL)</span>
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

                    {/* Comm Frequency (Phone) */}
                    <div className="form-field">
                      <label htmlFor="phone" className="field-label">
                        <span className="label-text">COMM FREQUENCY (PHONE)</span>
                        <span className="label-required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="dossier-input"
                          placeholder="Direct line..."
                          disabled={isSubmitting || submitted}
                        />
                        <div className={`focus-line ${focusedField === 'phone' ? 'active' : ''}`} />
                      </div>
                    </div>

                    {/* Affiliation (College) */}
                    <div className="form-field">
                      <label htmlFor="college" className="field-label">
                        <span className="label-text">AFFILIATION (COLLEGE)</span>
                        <span className="label-required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('college')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="dossier-input"
                          placeholder="Institution..."
                          disabled={isSubmitting || submitted}
                        />
                        <div className={`focus-line ${focusedField === 'college' ? 'active' : ''}`} />
                      </div>
                    </div>

                    {/* Unit Designation (Team Name) */}
                    <div className="form-field">
                      <label htmlFor="teamName" className="field-label">
                        <span className="label-text">UNIT DESIGNATION (TEAM NAME)</span>
                        <span className="label-required">*</span>
                      </label>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          id="teamName"
                          name="teamName"
                          value={formData.teamName}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('teamName')}
                          onBlur={() => setFocusedField(null)}
                          required
                          className="dossier-input"
                          placeholder="Codename..."
                          disabled={isSubmitting || submitted}
                        />
                        <div className={`focus-line ${focusedField === 'teamName' ? 'active' : ''}`} />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-actions" style={{ marginTop: '2rem' }}>
                      <motion.button
                        type="submit"
                        disabled={isSubmitting || submitted}
                        className="evidence-stamp-button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <span className="stamp-text">
                          {isSubmitting ? 'PROCESSING...' : submitted ? 'AUTHORIZED' : 'INITIATE REGISTRATION'}
                        </span>
                        <div className="stamp-border" />
                        {!isSubmitting && !submitted && <Shield size={16} className="stamp-icon" />}
                      </motion.button>

                      <div className="warning-notice">
                        <AlertTriangle size={14} />
                        <span>Registration is mandatory for entering the active investigation zone.</span>
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
                          AUTHORIZED
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
                        <p className="success-text">Operative verified.</p>
                        <p className="success-subtext">UID: {caseRef}</p>
                        <p className="success-subtext mt-2" style={{ opacity: 0.6, fontSize: '0.9rem' }}>Await further briefing.</p>
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

export default Register
