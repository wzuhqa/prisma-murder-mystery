import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import CinematicIntro from './components/cinematic/CinematicIntro'
import SlashNavbar from './components/common/SlashNavbar'
import ForensicCursor from './components/common/ForensicCursor/ForensicCursor'
import { NavigationProvider } from './context/NavigationContext'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load page components for code splitting
const Home = lazy(() => import('./pages/Home'))
const Events = lazy(() => import('./pages/Events'))
const Team = lazy(() => import('./pages/Team'))
const ContactNoir = lazy(() => import('./pages/ContactNoir'))
const Register = lazy(() => import('./pages/Register'))
const About = lazy(() => import('./pages/About'))

// Suspense fallback component
const PageLoader = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: '#0A0A0D',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#E5E5E5',
    fontFamily: 'monospace',
    fontSize: '12px',
    letterSpacing: '2px'
  }}>
    INITIALIZING INTERFACE...
  </div>
)

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const loadingCompleteRef = useRef(false)

  // Adaptive Scroll Intensity Logic (Throttled)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = maxScroll > 0 ? scrolled / maxScroll : 0;
          document.documentElement.style.setProperty('--scroll-depth', scrollPercent.toFixed(2));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    if (loadingCompleteRef.current) return;
    loadingCompleteRef.current = true;
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  if (isLoading) {
    return <CinematicIntro onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-base">
      <SlashNavbar />
      <div className="pt-24 relative z-20">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<ContactNoir />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

function App() {
  useEffect(() => {
    console.log("PRISMA APP V2.3 - TRUE DARK UI SYSTEM ACTIVE");
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ForensicCursor />
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
