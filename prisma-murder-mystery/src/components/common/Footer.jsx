import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Mail, MapPin, Phone, ExternalLink, Github, Twitter } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const [isFlickering, setIsFlickering] = useState(false)
  const [currentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const triggerFlicker = () => {
      if (Math.random() < 0.05) {
        setIsFlickering(true)
        setTimeout(() => setIsFlickering(false), 80)
      }
    }
    const interval = setInterval(triggerFlicker, 45000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className={`footer-container ${isFlickering ? 'micro-flicker' : ''}`}>
      {/* Atmospheric Overlays */}
      <div className="footer-grain" />
      <div className="footer-stain" />
      <div className="footer-pulse-line" />

      {/* Crime tape top border */}
      <div className="crime-tape w-full text-center text-[11px] tracking-[8px] py-2.5 bg-blood text-midnight font-black opacity-90 shadow-lg">
        ⚠ DO NOT CROSS — CRIME SCENE — DO NOT CROSS ⚠
      </div>

      <div className="footer-inner">
        {/* ===== TOP SECTION: Brand + Tagline ===== */}
        <div className="text-center mb-16 md:mb-20 relative">
          <div className="inline-block relative">
            <h3 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter text-blood mb-3" style={{ textShadow: '0 0 40px rgba(139, 0, 0, 0.3)' }}>
              PRISMA
            </h3>
            <p className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-gray-500 uppercase">
              SRM University Delhi-NCR
            </p>
          </div>
          <p className="max-w-lg mx-auto mt-6 text-gray-500 italic font-serif text-sm leading-relaxed">
            "Technical Excellence. Cultural Mystery. Some secrets are meant to be found."
          </p>

          {/* Social Icons — Prominent */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <a href="https://instagram.com/prisma.srmuh" target="_blank" rel="noopener noreferrer"
              className="group w-11 h-11 border border-white/10 rounded-full flex items-center justify-center hover:border-blood/50 hover:bg-blood/10 transition-all duration-300">
              <Instagram size={18} className="text-gray-500 group-hover:text-blood transition-colors" />
            </a>
            <a href="mailto:prisma@srmuh.in"
              className="group w-11 h-11 border border-white/10 rounded-full flex items-center justify-center hover:border-blood/50 hover:bg-blood/10 transition-all duration-300">
              <Mail size={18} className="text-gray-500 group-hover:text-blood transition-colors" />
            </a>
            <a href="tel:+91XXXXXXXXXX"
              className="group w-11 h-11 border border-white/10 rounded-full flex items-center justify-center hover:border-blood/50 hover:bg-blood/10 transition-all duration-300">
              <Phone size={18} className="text-gray-500 group-hover:text-blood transition-colors" />
            </a>
          </div>
        </div>

        {/* ===== DIVIDER ===== */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <span className="font-mono text-[8px] tracking-[0.5em] text-gray-600 uppercase">Case Interface</span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>

        {/* ===== LINK GRID ===== */}
        <div className="footer-grid">
          {/* Case Files */}
          <div>
            <h4 className="footer-heading">
              <span className="text-blood/30 mr-2">01</span>
              Case Files
            </h4>
            <ul className="space-y-4">
              {[
                { label: 'Case Overview', path: '/' },
                { label: 'Suspect Dossier', path: '/events' },
                { label: 'Investigators', path: '/team' },
                { label: 'Evidence Archive', path: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.path} className="footer-link">
                    <span className="text-blood/30">›</span>
                    <span className="link-text" data-text={item.label}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Evidence Room */}
          <div>
            <h4 className="footer-heading">
              <span className="text-blood/30 mr-2">02</span>
              Evidence Room
            </h4>
            <ul className="space-y-4">
              {['Fashion', 'Gaming', 'Photography', 'Dance', 'Music', 'Drama', 'Literary'].map(item => (
                <li key={item}>
                  <Link to="/events" className="footer-link">
                    <span className="text-blood/30">›</span>
                    <span className="link-text" data-text={item}>{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h4 className="footer-heading">
              <span className="text-blood/30 mr-2">03</span>
              Headquarters
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 group">
                <MapPin size={14} className="text-blood/60 shrink-0 mt-1" />
                <span className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
                  SRM University, Delhi-NCR,<br />Sonepat, Haryana, 131029
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-blood/60 shrink-0" />
                <a href="mailto:prisma@srmuh.in" className="footer-link">
                  <span className="link-text" data-text="prisma@srmuh.in">prisma@srmuh.in</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-blood/60 shrink-0" />
                <span className="text-gray-500 text-sm font-mono tracking-wider">+91 XXXXXXXXXX</span>
              </li>
            </ul>
          </div>

          {/* Quick Facts */}
          <div>
            <h4 className="footer-heading">
              <span className="text-blood/30 mr-2">04</span>
              Intel Brief
            </h4>
            <div className="space-y-4">
              <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4">
                <span className="font-mono text-[10px] text-blood/50 tracking-widest uppercase block mb-2">Event Date</span>
                <span className="text-gray-300 text-sm font-heading tracking-wide">FEB 28 – MAR 01, 2026</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4">
                <span className="font-mono text-[10px] text-blood/50 tracking-widest uppercase block mb-2">Venue</span>
                <span className="text-gray-300 text-sm font-heading tracking-wide">SRM University Campus</span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-sm p-4">
                <span className="font-mono text-[10px] text-blood/50 tracking-widest uppercase block mb-2">Case Status</span>
                <span className="text-blood text-sm font-heading tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blood animate-pulse" />
                  ACTIVE — INVESTIGATION ONGOING
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="footer-bottom">
          <div className="flex flex-col gap-2">
            <p className="text-gray-600 text-[11px] font-mono tracking-wider">
              © {currentYear} PRISMA FILES. ALL RIGHTS RESERVED.
            </p>
            <div className="case-remains-open">
              Case remains open.
            </div>
          </div>
          <p className="flex items-center gap-3 text-gray-600 text-[11px] font-mono tracking-wider">
            LAST UPDATED: ██/██/2026 <span className="w-1.5 h-1.5 rounded-full bg-blood animate-pulse" /> SRM UNIVERSITY
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
