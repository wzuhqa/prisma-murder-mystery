import { lazy, Suspense } from 'react'
import HeroSection from '../components/hero/HeroSection'
import Footer from '../components/common/Footer'
import RedThreadConnector from '../components/home/RedThreadConnector'
import ScrollProgress from '../components/common/ScrollProgress'
import BackToTop from '../components/common/BackToTop'
import SectionDivider from '../components/home/SectionDivider'

// Lazy load heavy sections for better performance
const CaseSummaryPanel = lazy(() => import('../components/home/CaseSummaryPanel/CaseSummaryPanel'))
const EnhancedCountdown = lazy(() => import('../components/home/EnhancedCountdown'))
const EventLineupReveal = lazy(() => import('../components/home/EventLineupReveal'))
const SpecterArchive = lazy(() => import('../components/home/SpecterArchive'))
const SponsorsMarquee = lazy(() => import('../components/home/SponsorsMarquee'))

// Loading placeholder for lazy components
const SectionLoader = () => (
  <div className="h-96 flex items-center justify-center bg-noir/20">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-2 border-blood/30 border-t-blood rounded-full animate-spin" />
      <span className="font-mono text-xs text-blood tracking-widest uppercase animate-pulse">Initializing Component...</span>
    </div>
  </div>
)

const Home = () => {

  return (
    <main className="min-h-screen relative z-20">
      {/* Global Page Connector (Fixed background drawing effect) */}
      <RedThreadConnector />

      {/* ===== SCROLL PROGRESS INDICATOR ===== */}
      <ScrollProgress />

      {/* ===== BACK TO TOP BUTTON ===== */}
      <BackToTop />

      {/* ===== HERO SECTION ===== */}
      <HeroSection />

      <SectionDivider label="CASE BRIEFING BELOW" />

      {/* ===== SECTION 2: CASE SUMMARY PANEL (V2.6) ===== */}
      <Suspense fallback={<SectionLoader />}>
        <CaseSummaryPanel />
      </Suspense>

      <SectionDivider label="TIME SENSITIVE" />

      {/* ===== ENHANCED COUNTDOWN SECTION ===== */}
      <section className="relative z-20 bg-base">
        <Suspense fallback={<SectionLoader />}>
          <EnhancedCountdown targetTime="2026-02-28T00:00:00" />
        </Suspense>
      </section>

      <SectionDivider label="SUSPECT LINEUP" />

      {/* ===== ARTIST LINEUP SECTION ===== */}
      <section className="relative z-20 bg-base">
        <Suspense fallback={<SectionLoader />}>
          <EventLineupReveal />
        </Suspense>
      </section>

      <SectionDivider label="COLD CASE FILES" />

      {/* ===== SPECTER ARCHIVE SECTION ===== */}
      <section className="relative z-20 bg-base">
        <Suspense fallback={<SectionLoader />}>
          <SpecterArchive />
        </Suspense>
      </section>

      <SectionDivider label="CLASSIFIED BACKERS" />

      {/* ===== SPONSORS MARQUEE SECTION ===== */}
      <section className="relative z-20 bg-base">
        <Suspense fallback={<SectionLoader />}>
          <SponsorsMarquee />
        </Suspense>
      </section>

      <Footer />
    </main>
  )
}

export default Home

