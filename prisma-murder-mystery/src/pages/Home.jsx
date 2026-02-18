import { lazy, Suspense } from 'react'
import HeroSection from '../components/hero/HeroSection'

// Lazy load heavy sections for better performance
const EnhancedCountdown = lazy(() => import('../components/home/EnhancedCountdown'))
const EventLineupReveal = lazy(() => import('../components/home/EventLineupReveal'))
const SpecterArchive = lazy(() => import('../components/home/SpecterArchive'))
const EvidenceBoard = lazy(() => import('../components/evidence/EvidenceBoard/EvidenceBoard'))

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
    <main className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <HeroSection />

      {/* ===== ENHANCED COUNTDOWN SECTION ===== */}
      <section className="relative">
        <Suspense fallback={<SectionLoader />}>
          <EnhancedCountdown targetTime="2026-02-28T00:00:00" />
        </Suspense>
      </section>

      {/* ===== ARTIST LINEUP SECTION ===== */}
      <section className="relative">
        <Suspense fallback={<SectionLoader />}>
          <EventLineupReveal />
        </Suspense>
      </section>

      {/* ===== EVIDENCE BOARD (SPONSORS) ===== */}
      <Suspense fallback={<SectionLoader />}>
        <EvidenceBoard />
      </Suspense>

      {/* ===== SPECTER ARCHIVE SECTION ===== */}
      <section className="relative">
        <Suspense fallback={<SectionLoader />}>
          <SpecterArchive />
        </Suspense>
      </section>
    </main>
  )
}

export default Home

