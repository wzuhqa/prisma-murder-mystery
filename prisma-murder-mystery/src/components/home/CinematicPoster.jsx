/**
 * Cinematic Horror Tech Fest Poster
 * Aggressive analog horror / cyberpunk nightmare aesthetic
 * 16:9 aspect ratio, 4K resolution ready
 */

import { Link } from 'react-router-dom'
import { Search, Ticket } from 'lucide-react'

const CinematicPoster = ({
  className = '',
  eventDate = '28 February to 1 March 2026'
}) => {
  return (
    <div className={`horror-poster ${className}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        
        .horror-poster {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: visible;
          background: linear-gradient(180deg, #02020a 0%, #050510 50%, #020208 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
        }
        
        /* Breathing light background effect */
        .horror-poster::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(139, 0, 0, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(139, 0, 0, 0.05) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 50%, rgba(10, 10, 30, 0.3) 0%, transparent 70%);
          animation: breathingGlow 6s ease-in-out infinite alternate;
          pointer-events: none;
          z-index: 1;
        }
        
        @keyframes breathingGlow {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        
        /* Heavy vignette */
        .horror-poster::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 20%,
            rgba(0, 0, 0, 0.3) 50%,
            rgba(0, 0, 0, 0.6) 75%,
            rgba(0, 0, 0, 0.9) 100%
          );
          pointer-events: none;
          z-index: 2;
        }
        
        /* Moving fog/smoke layer */
        .fog-layer {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(90deg, transparent 0%, rgba(139, 0, 0, 0.02) 50%, transparent 100%);
          animation: fogDrift 15s linear infinite;
          pointer-events: none;
          z-index: 3;
          opacity: 0.5;
        }
        
        @keyframes fogDrift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        /* Static interference overlay */
        .static-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.08;
          animation: staticFlicker 0.15s infinite steps(3);
          pointer-events: none;
          z-index: 4;
          mix-blend-mode: overlay;
        }
        
        @keyframes staticFlicker {
          0% { opacity: 0.06; }
          50% { opacity: 0.1; }
          100% { opacity: 0.07; }
        }
        
        /* Red glitch scan lines */
        .scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(139, 0, 0, 0.03) 2px,
            rgba(139, 0, 0, 0.03) 4px
          );
          animation: scanlineMove 8s linear infinite;
          pointer-events: none;
          z-index: 5;
        }
        
        @keyframes scanlineMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        /* Horizontal distortion bars */
        .distortion-bar {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(139, 0, 0, 0.2);
          opacity: 0;
          animation: distortionBar 7s infinite;
          z-index: 6;
        }
        
        .distortion-bar:nth-child(1) { top: 25%; animation-delay: 0s; }
        .distortion-bar:nth-child(2) { top: 50%; animation-delay: 2s; }
        .distortion-bar:nth-child(3) { top: 75%; animation-delay: 4s; }
        
        @keyframes distortionBar {
          0%, 90%, 100% { opacity: 0; transform: translateX(0); }
          92% { opacity: 0.4; }
          94% { opacity: 0.2; transform: translateX(20px); }
          96% { opacity: 0.3; transform: translateX(-15px); }
          98% { opacity: 0; }
        }
        
        /* Digital tearing in corners */
        .tear-corner {
          position: absolute;
          width: 150px;
          height: 150px;
          pointer-events: none;
          z-index: 7;
          opacity: 0.15;
        }
        
        .tear-corner.top-left {
          top: 0;
          left: 0;
          background: linear-gradient(135deg, rgba(139, 0, 0, 0.3) 0%, transparent 60%);
          animation: tearFlicker 3s ease-in-out infinite;
        }
        
        .tear-corner.top-right {
          top: 0;
          right: 0;
          background: linear-gradient(225deg, rgba(139, 0, 0, 0.3) 0%, transparent 60%);
          animation: tearFlicker 3s ease-in-out infinite 0.5s;
        }
        
        .tear-corner.bottom-left {
          bottom: 0;
          left: 0;
          background: linear-gradient(45deg, rgba(139, 0, 0, 0.3) 0%, transparent 60%);
          animation: tearFlicker 3s ease-in-out infinite 1s;
        }
        
        .tear-corner.bottom-right {
          bottom: 0;
          right: 0;
          background: linear-gradient(315deg, rgba(139, 0, 0, 0.3) 0%, transparent 60%);
          animation: tearFlicker 3s ease-in-out infinite 1.5s;
        }
        
        @keyframes tearFlicker {
          0%, 80%, 100% { opacity: 0.1; }
          85% { opacity: 0.25; }
          90% { opacity: 0.15; }
        }
        
        /* Corner frame markers with flicker */
        .corner-frame {
          position: absolute;
          width: 80px;
          height: 80px;
          border-color: rgba(139, 0, 0, 0.7);
          border-style: solid;
          border-width: 0;
          z-index: 1100;
          animation: cornerFlicker 4s ease-in-out infinite;
        }
        
        .corner-frame.top-left {
          top: 100px;
          left: 25px;
          border-top-width: 1.5px;
          border-left-width: 1.5px;
        }
        
        .corner-frame.top-right {
          top: 100px;
          right: 25px;
          border-top-width: 1.5px;
          border-right-width: 1.5px;
          animation-delay: 0.3s;
        }
        
        .corner-frame.bottom-left {
          bottom: 25px;
          left: 25px;
          border-bottom-width: 1.5px;
          border-left-width: 1.5px;
          animation-delay: 0.6s;
        }
        
        .corner-frame.bottom-right {
          bottom: 25px;
          right: 25px;
          border-bottom-width: 1.5px;
          border-right-width: 1.5px;
          animation-delay: 0.9s;
        }
        
        @keyframes cornerFlicker {
          0%, 85%, 100% { opacity: 1; border-color: rgba(139, 0, 0, 0.7); }
          86% { opacity: 0.6; border-color: rgba(139, 0, 0, 0.3); }
          87% { opacity: 1; }
          88% { opacity: 0.4; border-color: rgba(139, 0, 0, 0.9); }
          89% { opacity: 0.8; }
        }
        
        /* Top capsule with glitch flicker */
        .capsule-label {
          position: fixed;
          top: 100px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 24px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(139, 0, 0, 0.4);
          border-radius: 30px;
          z-index: 1100;
          animation: capsuleGlitch 5s ease-in-out infinite;
        }
        
        @keyframes capsuleGlitch {
          0%, 88%, 100% { transform: translateX(-50%); }
          89% { transform: translateX(-50.5%); }
          90% { transform: translateX(-49.5%); }
          91% { transform: translateX(-50%); }
          92% { transform: translateX(-50.3%); }
          93% { transform: translateX(-50%); }
        }
        
        .capsule-dot {
          width: 8px;
          height: 8px;
          background: #8b0000;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(139, 0, 0, 0.9);
          animation: dotPulse 1.5s ease-in-out infinite;
        }
        
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px rgba(139, 0, 0, 0.9); }
          50% { opacity: 0.5; box-shadow: 0 0 6px rgba(139, 0, 0, 0.5); }
        }
        
        .capsule-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #b8960c;
          text-shadow: 0 0 10px rgba(184, 150, 12, 0.3);
          animation: textGlitch 6s ease-in-out infinite;
        }
        
        @keyframes textGlitch {
          0%, 90%, 100% { opacity: 1; }
          91% { opacity: 0.7; transform: translateX(1px); }
          92% { opacity: 1; }
          93% { opacity: 0.8; transform: translateX(-1px); }
          94% { opacity: 1; }
        }
        
        /* Main content wrapper */
        .poster-content {
          position: relative;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 20px;
        }
        
        /* Main title - PRISMA with aggressive glitch */
        .main-title {
          font-family: 'Cinzel', serif;
          font-size: clamp(5rem, 14vw, 12rem);
          font-weight: 700;
          color: #5a0000;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          line-height: 1;
          margin-bottom: 12px;
          position: relative;
          text-shadow: 
            0 0 30px rgba(90, 0, 0, 0.7),
            0 0 60px rgba(90, 0, 0, 0.4),
            0 8px 20px rgba(0, 0, 0, 0.8);
          animation: titleBreath 4s ease-in-out infinite alternate;
        }
        
        @keyframes titleBreath {
          0% { 
            text-shadow: 
              0 0 30px rgba(90, 0, 0, 0.7),
              0 0 60px rgba(90, 0, 0, 0.4),
              0 8px 20px rgba(0, 0, 0, 0.8);
          }
          100% { 
            text-shadow: 
              0 0 40px rgba(90, 0, 0, 0.9),
              0 0 80px rgba(90, 0, 0, 0.5),
              0 8px 20px rgba(0, 0, 0, 0.8);
          }
        }
        
        /* Glitch layers for title */
        .main-title::before,
        .main-title::after {
          content: 'PRISMA';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        
        .main-title::before {
          color: #ff0000;
          animation: mainGlitchRed 2.5s infinite;
        }
        
        .main-title::after {
          color: #00ffff;
          animation: mainGlitchCyan 2.5s infinite 0.1s;
        }
        
        @keyframes mainGlitchRed {
          0%, 82%, 100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
            opacity: 0;
          }
          83% {
            clip-path: inset(15% 0 55% 0);
            transform: translate(-5px, 3px);
            opacity: 0.6;
          }
          84% {
            clip-path: inset(45% 0 30% 0);
            transform: translate(7px, -3px);
            opacity: 0.4;
          }
          85% {
            clip-path: inset(25% 0 50% 0);
            transform: translate(-3px, 2px);
            opacity: 0.5;
          }
          86% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
            opacity: 0;
          }
        }
        
        @keyframes mainGlitchCyan {
          0%, 85%, 100% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
            opacity: 0;
          }
          86% {
            clip-path: inset(30% 0 45% 0);
            transform: translate(4px, -2px);
            opacity: 0.45;
          }
          87% {
            clip-path: inset(55% 0 20% 0);
            transform: translate(-5px, 3px);
            opacity: 0.35;
          }
          88% {
            clip-path: inset(10% 0 65% 0);
            transform: translate(3px, -2px);
            opacity: 0.4;
          }
          89% {
            clip-path: inset(0 0 0 0);
            transform: translate(0);
            opacity: 0;
          }
        }
        
        /* Fragment slices across letters */
        .glitch-slice {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(139, 0, 0, 0.4);
          opacity: 0;
          animation: sliceGlitch 3s infinite;
          pointer-events: none;
        }
        
        .glitch-slice:nth-of-type(1) { top: 25%; animation-delay: 0s; }
        .glitch-slice:nth-of-type(2) { top: 50%; animation-delay: 0.8s; }
        .glitch-slice:nth-of-type(3) { top: 75%; animation-delay: 1.6s; }
        
        @keyframes sliceGlitch {
          0%, 75%, 100% { opacity: 0; transform: translateX(0); }
          76% { opacity: 0.5; }
          77% { opacity: 0.3; transform: translateX(30px); }
          78% { opacity: 0.4; transform: translateX(-20px); }
          79% { opacity: 0; }
        }
        
        /* Subtitle with flicker */
        .subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.85rem, 1.8vw, 1.25rem);
          font-weight: 300;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          color: #a89f8f;
          margin-bottom: 8px;
          opacity: 0.75;
          animation: subtitleFlicker 5s ease-in-out infinite;
        }
        
        @keyframes subtitleFlicker {
          0%, 88%, 100% { opacity: 0.75; }
          89% { opacity: 0.5; }
          90% { opacity: 0.7; }
          91% { opacity: 0.4; }
          92% { opacity: 0.75; }
        }
        
        /* Tagline with smear effect */
        .tagline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.1rem, 2.2vw, 1.6rem);
          font-weight: 400;
          font-style: italic;
          color: #b8960c;
          letter-spacing: 0.12em;
          text-shadow: 0 0 20px rgba(184, 150, 12, 0.25);
          margin-bottom: 12px;
          animation: taglineGlitch 4s ease-in-out infinite;
        }
        
        @keyframes taglineGlitch {
          0%, 90%, 100% { 
            opacity: 1;
            transform: translateX(0);
            filter: blur(0);
          }
          91% { 
            opacity: 0.8;
            transform: translateX(2px);
            filter: blur(0.5px);
          }
          92% { 
            opacity: 1;
            transform: translateX(-1px);
          }
          93% { 
            opacity: 0.9;
            transform: translateX(1px);
            filter: blur(0.3px);
          }
          94% { opacity: 1; }
        }
        
        /* Ghost-like date */
        .event-date {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.65rem, 1.3vw, 0.9rem);
          font-weight: 300;
          letter-spacing: 0.25em;
          color: rgba(184, 150, 12, 0.35);
          margin-bottom: 45px;
          animation: ghostPulse 8s ease-in-out infinite;
        }
        
        @keyframes ghostPulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
        
        /* Buttons container */
        .buttons-container {
          display: flex;
          gap: 18px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 50px;
        }
        
        /* Button base styles */
        .poster-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 15px 30px;
          border-radius: 30px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }
        
        .poster-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: currentColor;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        /* Dark red button */
        .btn-investigate {
          color: #5a0000;
          border: 1.5px solid #5a0000;
          text-shadow: 0 0 8px rgba(90, 0, 0, 0.3);
        }
        
        .btn-investigate:hover {
          background: rgba(90, 0, 0, 0.15);
          box-shadow: 0 0 30px rgba(90, 0, 0, 0.5);
          text-shadow: 0 0 15px rgba(90, 0, 0, 0.7);
          animation: buttonGlitch 0.3s ease-in-out;
        }
        
        /* Gold button */
        .btn-passes {
          color: #b8960c;
          border: 1.5px solid #b8960c;
          text-shadow: 0 0 8px rgba(184, 150, 12, 0.3);
        }
        
        .btn-passes:hover {
          background: rgba(184, 150, 12, 0.15);
          box-shadow: 0 0 30px rgba(184, 150, 12, 0.5);
          text-shadow: 0 0 15px rgba(184, 150, 12, 0.7);
          animation: buttonGlitch 0.3s ease-in-out;
        }
        
        @keyframes buttonGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, -1px); }
          80% { transform: translate(1px, 1px); }
          100% { transform: translate(0); }
        }
        
        /* Corrupted pixel fragments */
        .pixel-fragment {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(139, 0, 0, 0.6);
          opacity: 0;
          animation: pixelCorrupt 6s infinite;
          z-index: 8;
        }
        
        @keyframes pixelCorrupt {
          0%, 95%, 100% { opacity: 0; }
          96% { opacity: 0.8; }
          97% { opacity: 0; }
          98% { opacity: 0.5; }
        }
        
        /* Scroll indicator */
        .scroll-indicator {
          position: absolute;
          bottom: 35px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          z-index: 1100;
          animation: scrollBounce 2.5s ease-in-out infinite;
        }
        
        @keyframes scrollBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        
        .scroll-icon {
          width: 22px;
          height: 36px;
          border: 1.5px solid rgba(184, 150, 12, 0.5);
          border-radius: 11px;
          position: relative;
        }
        
        .scroll-icon::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 5px;
          background: rgba(184, 150, 12, 0.7);
          border-radius: 1px;
          animation: scrollWheel 1.8s ease-in-out infinite;
        }
        
        @keyframes scrollWheel {
          0%, 100% { opacity: 1; top: 5px; }
          50% { opacity: 0.4; top: 12px; }
        }
        
        .scroll-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.6rem;
          font-weight: 300;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(184, 150, 12, 0.45);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .corner-frame {
            width: 50px;
            height: 50px;
          }
          
          .buttons-container {
            flex-direction: column;
            gap: 10px;
          }
          
          .poster-button {
            padding: 13px 26px;
            font-size: 0.75rem;
          }
          
          .main-title {
            letter-spacing: 0.08em;
          }
        }
      `}</style>

      {/* Atmospheric layers */}
      <div className="fog-layer" />
      <div className="static-overlay" />
      <div className="scanlines" />
      <div className="distortion-bar" />
      <div className="distortion-bar" />
      <div className="distortion-bar" />

      {/* Digital tearing */}
      <div className="tear-corner top-left" />
      <div className="tear-corner top-right" />
      <div className="tear-corner bottom-left" />
      <div className="tear-corner bottom-right" />

      {/* Corrupted pixel fragments */}
      <div className="pixel-fragment" style={{ top: '15%', left: '20%', animationDelay: '0s' }} />
      <div className="pixel-fragment" style={{ top: '35%', left: '75%', animationDelay: '1s' }} />
      <div className="pixel-fragment" style={{ top: '65%', left: '10%', animationDelay: '2s' }} />
      <div className="pixel-fragment" style={{ top: '80%', left: '85%', animationDelay: '3s' }} />
      <div className="pixel-fragment" style={{ top: '45%', left: '55%', animationDelay: '4s' }} />

      {/* Corner frame markers */}
      <div className="corner-frame top-left" />
      <div className="corner-frame top-right" />
      <div className="corner-frame bottom-left" />
      <div className="corner-frame bottom-right" />

      {/* Top capsule label */}
      <div className="capsule-label">
        <span className="capsule-dot" />
        <span className="capsule-text">SRM University Delhi-NCR</span>
      </div>

      {/* Main content */}
      <div className="poster-content">
        <h1 className="main-title">
          PRISMA
          {/* Glitch slices */}
          <span className="glitch-slice" />
          <span className="glitch-slice" />
          <span className="glitch-slice" />
        </h1>
        <p className="subtitle">Annual Tech & Cultural Fest</p>
        <p className="tagline">#TheMysteryUnfolds</p>
        <p className="event-date">{eventDate}</p>

        {/* Buttons */}
        <div className="buttons-container">
          <Link to="/events" className="poster-button btn-investigate">
            <Search size={15} />
            Investigate Events
          </Link>
          <Link to="/register" className="poster-button btn-passes">
            <Ticket size={15} />
            Grab Your Passes
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="scroll-icon" />
        <span className="scroll-text">Scroll</span>
      </div>
    </div>
  )
}

export default CinematicPoster

