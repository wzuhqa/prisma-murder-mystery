import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import CinematicIntro from './components/cinematic/CinematicIntro'
import SlashNavbar from './components/common/SlashNavbar'
import Footer from './components/common/Footer'
import GlobalParticles from './components/common/GlobalParticles'
import { NavigationProvider } from './context/NavigationContext'

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
    background: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#c0c0c0',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    letterSpacing: '2px'
  }}>
    LOADING...
  </div>
)

// Main app content with router
const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true)
  const loadingCompleteRef = useRef(false)

  const handleSkip = () => {
    if (!loadingCompleteRef.current) {
      loadingCompleteRef.current = true
      setIsLoading(false)
    }
  }

  const handleLoadingComplete = useCallback(() => {
    // Guard against multiple calls
    if (loadingCompleteRef.current) {
      return
    }
    loadingCompleteRef.current = true

    // Add delay to allow fade animation to complete before unmounting
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [])

  if (isLoading) {
    return <CinematicIntro onComplete={handleLoadingComplete} />
  }

  return (
    <div className="min-h-screen bg-midnight">
      {/* Global Particle System */}
      <GlobalParticles enabled={false} intensity="medium" />

      {/* Global Ambient Effects (Grain, Scanlines, Flicker) */}
      <div className="global-ambient-overlay">
        <div className="global-grain"></div>
        <div className="global-scanlines"></div>
        <div className="global-vignette"></div>
      </div>

      {/* Navigation */}
      <SlashNavbar />

      {/* Page content - lazy loaded with Suspense */}
      <div className="pt-24">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<ContactNoir />} />
            <Route path="/about" element={<About />} />
          </Routes>

          {/* Footer - inside Suspense so it loads after page content */}
          <Footer />
        </Suspense>
      </div>
    </div>
  )
}

import ErrorBoundary from './components/ErrorBoundary'

function App() {
  useEffect(() => {
    console.log("PRISMA APP V1.7 - HASHROUTER ACTIVE - KRAFTON SYNC - 25 SUSPECTS");
  }, []);

  return (
    <ErrorBoundary>
      <BrowserRouter basename="/prisma-event-page">
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App


