import { motion } from 'framer-motion'

const sponsors = [
  '3D Engineering', 'Adobe', 'Balaji', 'BigWig', 'Caterman',
  'Clovia', 'Coolberg', 'F9Kart', 'Federal', 'Incredible',
  'Insight', 'Mac-V', 'Mojo', 'Panchwati', 'Pardesi',
  'Playerone', 'Red-Bull', 'Security', 'Siemens', 'Sipp',
  'Skivia', 'Svva', 'Timex', 'Vfission', 'krafton', 'Digiveda'
];

const SponsorsMarquee = () => {
  return (
    <section className="relative py-32 border-y border-blood/20 bg-noir shadow-[0_0_50px_rgba(139,0,0,0.05)] overflow-hidden">
      {/* Background forensic smudge */}
      <div className="absolute inset-0 forensic-smudge opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block relative">
            <span className="font-special-elite text-lg tracking-[8px] text-blood uppercase bg-blood/10 px-8 py-3 border border-blood/30 rounded-sm">
              Classified Backers
            </span>
            <div className="absolute -top-3 -right-6 text-xs text-blood/50 font-mono rotate-12">CONFIDENTIAL</div>
          </div>
        </motion.div>
      </div>

      {/* Marquee Container */}
      <div className="marquee-container relative z-10">
        <div className="marquee-content group">
          {[...sponsors, ...sponsors].map((sponsor, index) => {
            // Pseudo-random rotation for scattered files look
            const rotation = (index % 3 === 0) ? '-rotate-2' : (index % 2 === 0) ? 'rotate-2' : '-rotate-1';

            return (
              <div
                key={index}
                className={`flex items-center justify-center mx-10 md:mx-16 ${rotation} transition-transform duration-500 hover:rotate-0 hover:scale-110 hover:z-20`}
              >
                <div className="px-14 py-8 bg-[#1a1a1e] border border-white/5 shadow-2xl hover:border-blood/40 hover:shadow-[0_0_25px_rgba(139,0,0,0.4)] transition-all duration-300 min-w-[280px] rounded-sm relative group-hover:opacity-100 cursor-none">
                  {/* Tape piece effect */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/10 backdrop-blur-sm transform -rotate-3 opacity-50" />

                  <span className="font-heading text-3xl text-gray-400 group-hover:text-gray-100 transition-colors whitespace-nowrap tracking-wider">
                    {sponsor}
                  </span>

                  {/* Small red dot detail */}
                  <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-blood/0 group-hover:bg-blood/80 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  )
}

export default SponsorsMarquee

