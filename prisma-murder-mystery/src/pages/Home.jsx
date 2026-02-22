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
const FAQSection = lazy(() => import('../components/home/FAQSection'))

// Skeleton loader for lazy components with forensic theme
const SectionLoader = ({ height = 'h-96', label = 'DECIPHERING DATA...' }) => (
  <div className={`${height} flex items-center justify-center bg-noir/20 relative overflow-hidden`}>
    {/* Scan line effect */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blood/5 to-transparent animate-scan" />

    <div className="flex flex-col items-center gap-4">
      {/* Forensic scanner animation */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-blood/20 rounded-lg" />
        <div className="absolute inset-2 border border-blood/40 rounded" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blood/30 border-t-blood rounded-full animate-spin" />
        </div>
        {/* Corner brackets */}
        <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-blood/60" />
        <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blood/60" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-blood/60" />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blood/60" />
      </div>

      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-blood rounded-full animate-pulse" />
        <span className="font-mono text-xs text-blood tracking-widest uppercase animate-pulse">{label}</span>
      </div>
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

      {/* ===== CASE SUMMARY PANEL ===== */}
      <Suspense fallback={<SectionLoader />}>
        <CaseSummaryPanel />
      </Suspense>

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

      <SectionDivider label="ENCRYPTED QUERIES" />

      {/* ===== FAQ SECTION ===== */}
      <section className="relative z-20 bg-base">
        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>
      </section>

      <Footer />

    </main>
  )
}

export default Home

