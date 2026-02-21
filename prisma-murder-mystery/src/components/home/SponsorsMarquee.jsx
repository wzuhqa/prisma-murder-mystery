import { motion } from 'framer-motion'

// ============================================
// TIERED SPONSOR DATA
// ============================================
const SPONSOR_TIERS = {
  gold: {
    label: 'PRIME SUSPECTS',
    tag: '⭐ PRIME SUSPECT',
    sponsors: ['Red-Bull', 'Adobe', 'Siemens', 'krafton'],
    accentColor: 'rgba(255, 185, 0, 0.6)',
    borderColor: 'border-l-amber-500/60',
    textColor: 'text-amber-100',
    tagBg: 'bg-amber-900/30',
    tagBorder: 'border-amber-500/40',
    cardBg: 'bg-[#1c1a14]',
    glowColor: 'rgba(255, 185, 0, 0.15)',
    speed: 35,
  },
  silver: {
    label: 'PERSONS OF INTEREST',
    tag: '🔍 PERSON OF INTEREST',
    sponsors: ['3D Engineering', 'Federal', 'Timex', 'Playerone', 'Incredible', 'BigWig', 'Digiveda'],
    accentColor: 'rgba(192, 192, 210, 0.5)',
    borderColor: 'border-l-gray-400/50',
    textColor: 'text-gray-200',
    tagBg: 'bg-gray-800/40',
    tagBorder: 'border-gray-500/30',
    cardBg: 'bg-[#18181b]',
    glowColor: 'rgba(192, 192, 210, 0.08)',
    speed: 28,
  },
  bronze: {
    label: 'WITNESSES',
    tag: 'WITNESS',
    sponsors: ['Balaji', 'Caterman', 'Clovia', 'Coolberg', 'F9Kart', 'Insight', 'Mac-V', 'Mojo', 'Panchwati', 'Pardesi', 'Security', 'Sipp', 'Skivia', 'Svva', 'Vfission'],
    accentColor: 'rgba(139, 90, 43, 0.4)',
    borderColor: 'border-l-amber-800/40',
    textColor: 'text-gray-300',
    tagBg: 'bg-stone-900/30',
    tagBorder: 'border-amber-800/25',
    cardBg: 'bg-[#161614]',
    glowColor: 'rgba(139, 90, 43, 0.06)',
    speed: 22,
  },
}

// ============================================
// SINGLE MARQUEE ROW
// ============================================
const MarqueeRow = ({ tier, tierKey, reverse = false }) => {
  const doubled = [...tier.sponsors, ...tier.sponsors]
  const isGold = tierKey === 'gold'
  const isSilver = tierKey === 'silver'

  return (
    <div className="mb-8 last:mb-0">
      {/* Tier Label */}
      <div className="flex items-center gap-4 mb-5 px-8 max-w-7xl mx-auto">
        <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${isGold ? 'via-amber-500/30' : isSilver ? 'via-gray-500/20' : 'via-amber-800/15'} to-transparent`} />
        <span className={`font-mono text-[10px] tracking-[0.4em] uppercase ${isGold ? 'text-amber-400/70' : isSilver ? 'text-gray-400/60' : 'text-amber-700/50'}`}>
          {tier.label}
        </span>
        <div className={`h-[1px] flex-1 bg-gradient-to-r from-transparent ${isGold ? 'via-amber-500/30' : isSilver ? 'via-gray-500/20' : 'via-amber-800/15'} to-transparent`} />
      </div>

      {/* Marquee Track */}
      <div className="marquee-container relative overflow-hidden">
        {/* Edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-noir to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-noir to-transparent z-20 pointer-events-none" />

        <div
          className="marquee-content flex items-center"
          style={{
            animationDuration: `${tier.speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {doubled.map((sponsor, index) => {
            const rotation = (index % 3 === 0) ? '-rotate-1' : (index % 2 === 0) ? 'rotate-1' : '';

            return (
              <div
                key={`${tierKey}-${index}`}
                className={`flex items-center justify-center ${isGold ? 'mx-10 md:mx-14' : isSilver ? 'mx-7 md:mx-10' : 'mx-5 md:mx-8'} ${rotation} transition-all duration-500 hover:rotate-0 hover:scale-105 hover:z-30`}
              >
                <div
                  className={`relative group cursor-none rounded-sm border-l-4 ${tier.borderColor} border border-white/5 ${tier.cardBg} shadow-[12px_12px_30px_rgba(0,0,0,0.7)] hover:shadow-[0_0_30px_${tier.glowColor}] transition-all duration-500
                    ${isGold ? 'px-10 py-8 md:px-16 md:py-14 min-w-[260px] md:min-w-[360px]' : isSilver ? 'px-7 py-6 md:px-12 md:py-10 min-w-[200px] md:min-w-[280px]' : 'px-5 py-4 md:px-8 md:py-7 min-w-[140px] md:min-w-[200px]'}`}
                >
                  {/* Pin */}
                  <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full shadow-md z-20 ${isGold ? 'w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-600' : isSilver ? 'w-3 h-3 bg-gradient-to-br from-gray-300 to-gray-500' : 'w-2.5 h-2.5 bg-gradient-to-br from-amber-700 to-amber-900'}`}>
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/30 rounded-full" />
                  </div>

                  {/* Tape (gold only) */}
                  {isGold && (
                    <div className="absolute -top-3 -left-2 w-14 h-7 bg-amber-500/5 border border-amber-500/10 transform -rotate-12 opacity-40" />
                  )}

                  <div className="flex flex-col items-center gap-2">
                    {/* Tier Tag */}
                    <span className={`font-mono tracking-[0.3em] uppercase ${tier.tagBg} ${tier.tagBorder} border px-2 py-0.5 rounded-sm ${isGold ? 'text-[9px] text-amber-400/80' : isSilver ? 'text-[8px] text-gray-400/70' : 'text-[7px] text-amber-700/60'}`}>
                      {tier.tag}
                    </span>

                    {/* Sponsor Name */}
                    <span className={`font-heading whitespace-nowrap tracking-wide drop-shadow-lg group-hover:text-white transition-colors duration-400 ${tier.textColor} ${isGold ? 'text-3xl md:text-4xl' : isSilver ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
                      {sponsor}
                    </span>

                    {/* Divider line */}
                    <div className={`h-[1px] bg-current opacity-10 group-hover:opacity-30 group-hover:w-16 transition-all duration-500 ${isGold ? 'w-10' : isSilver ? 'w-6' : 'w-4'}`} />
                  </div>

                  {/* Thread hints */}
                  <div className={`absolute top-1/2 -left-3 h-[1px] bg-blood/15 group-hover:bg-blood/40 ${isGold ? 'w-3' : 'w-2'}`} />
                  <div className={`absolute top-1/2 -right-3 h-[1px] bg-blood/15 group-hover:bg-blood/40 ${isGold ? 'w-3' : 'w-2'}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================
const SponsorsMarquee = () => {
  return (
    <section className="relative py-20 md:py-28 border-y border-blood/20 bg-noir shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
      {/* Background noise */}
      <div className="absolute inset-0 forensic-smudge opacity-20 pointer-events-none select-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 mb-14 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block relative group">
            <h2 className="font-special-elite text-3xl md:text-5xl tracking-[0.2em] text-blood/90 uppercase bg-blood/5 px-10 py-5 border border-blood/20 relative z-10">
              Classified Backers
            </h2>
            <div className="absolute inset-0 bg-blood/5 blur-2xl -z-10 group-hover:bg-blood/10 transition-colors duration-700" />
            <div className="absolute -top-6 -right-12 text-xs md:text-sm text-blood/40 font-mono border-2 border-blood/30 px-3 py-1 rotate-12 select-none uppercase font-bold tracking-widest">
              Top Secret
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tiered Marquee Rows */}
      <div className="relative z-10 space-y-4">
        <MarqueeRow tier={SPONSOR_TIERS.gold} tierKey="gold" />
        <MarqueeRow tier={SPONSOR_TIERS.silver} tierKey="silver" reverse />
        <MarqueeRow tier={SPONSOR_TIERS.bronze} tierKey="bronze" />
      </div>
    </section>
  )
}

export default SponsorsMarquee
