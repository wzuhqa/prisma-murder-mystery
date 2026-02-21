import { motion } from 'framer-motion'

/**
 * SectionDivider — a thematic red-string connector with push pins
 * that visually ties two homepage sections together.
 * Accepts an optional `label` prop for the evidence tag text.
 */
const SectionDivider = ({ label = 'CONNECTING EVIDENCE...' }) => {
    return (
        <div className="relative py-6 md:py-10 flex items-center justify-center overflow-hidden select-none pointer-events-none" aria-hidden="true">
            {/* Left pin */}
            <div className="relative z-10 flex-shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-500 to-blood shadow-[0_0_10px_rgba(139,0,0,0.6)]">
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/30 rounded-full" />
                </div>
            </div>

            {/* Thread line */}
            <div className="flex-1 relative mx-2 h-[2px]">
                {/* Main thread */}
                <div className="absolute inset-0 bg-gradient-to-r from-blood/60 via-blood/30 to-blood/60" />
                {/* Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blood/20 via-blood/10 to-blood/20 blur-sm" />

                {/* Center evidence tag */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                >
                    <div className="bg-noir border border-blood/25 px-4 py-1.5 rounded-sm shadow-lg">
                        <span className="font-mono text-[9px] md:text-[10px] text-blood/50 tracking-[0.35em] uppercase whitespace-nowrap">
                            {label}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* Right pin */}
            <div className="relative z-10 flex-shrink-0">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-red-500 to-blood shadow-[0_0_10px_rgba(139,0,0,0.6)]">
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/30 rounded-full" />
                </div>
            </div>
        </div>
    )
}

export default SectionDivider
