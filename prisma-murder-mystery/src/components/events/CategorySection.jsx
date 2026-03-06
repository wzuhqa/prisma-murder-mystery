import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import EventAccordion from './EventAccordion.jsx'

// Alternating slight rotations & offsets for murder-board scatter effect
const SCATTER_ANGLES = [-1.2, 0.8, -0.5, 1.5, -0.9, 0.6, -1.8, 1.1]
const SCATTER_OFFSETS = [
    { x: 0, y: 0 },
    { x: 2, y: -4 },
    { x: -3, y: 2 },
    { x: 4, y: -2 },
    { x: -2, y: 4 },
    { x: 3, y: -3 },
]

const CategorySection = forwardRef(({ title, description, tagline, sections, index }, ref) => {
    const angle = SCATTER_ANGLES[index % SCATTER_ANGLES.length]
    const offset = SCATTER_OFFSETS[index % SCATTER_OFFSETS.length]

    return (
        <motion.section
            ref={ref}
            initial={{ y: 60, opacity: 0, rotate: angle * 2 }}
            whileInView={{ y: offset.y, opacity: 1, rotate: angle }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ rotate: 0, y: 0, scale: 1.01, transition: { duration: 0.3 } }}
            className={`folder-case ${index === 0 ? 'high-clearance' : ''}`}
            style={{ transformOrigin: 'top center', position: 'relative' }}
        >
            {/* Thumbtack pin at the top */}
            <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                pointerEvents: 'none',
            }}>
                <svg width="20" height="28" viewBox="0 0 20 28" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="9" r="7" fill="#c41e3a" stroke="#8b0000" strokeWidth="1.5" />
                    <circle cx="10" cy="9" r="3" fill="rgba(255,255,255,0.2)" />
                    <rect x="9" y="15" width="2" height="13" fill="#8b0000" rx="1" />
                </svg>
            </div>

            {/* Tape decoration (alternating corners by index) */}
            <div style={{
                position: 'absolute',
                top: index % 2 === 0 ? '-8px' : 'auto',
                bottom: index % 2 !== 0 ? '-8px' : 'auto',
                right: index % 3 === 0 ? '10%' : 'auto',
                left: index % 3 !== 0 ? '15%' : 'auto',
                width: '60px',
                height: '20px',
                background: 'rgba(232, 200, 122, 0.18)',
                borderTop: '1px solid rgba(232,200,122,0.15)',
                borderBottom: '1px solid rgba(232,200,122,0.15)',
                transform: `rotate(${index % 2 === 0 ? '-3' : '3'}deg)`,
                pointerEvents: 'none',
                zIndex: 15,
            }} />

            <div className="folder-texture" />
            <div className="high-clearance-glitch" />

            {/* Folder Tab at the top */}
            <div className="folder-tab">
                <span className="opacity-50">FILE NO.</span>
                <span>PR-{2026}-{(index + 1).toString().padStart(3, '0')}</span>
            </div>

            <div className="dossier-header relative z-10">
                <div className="dossier-label">PRIMARY CASE FILE</div>
                <div className="dossier-stamp">CONFIDENTIAL</div>
            </div>

            <div className="relative z-10 p-6 md:p-8">
                <div className="mb-10 flex flex-col items-center text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="category-title"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="category-description"
                    >
                        {description}
                    </motion.p>
                    {tagline && (
                        <p className="category-tagline">
                            {tagline}
                        </p>
                    )}
                </div>

                <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                    {sections.map((section, idx) => (
                        <EventAccordion
                            key={idx}
                            type={section.type}
                            events={section.events}
                            isOpen={idx === 0} // Open the first section by default
                        />
                    ))}
                </div>
            </div>
        </motion.section>
    )
})

CategorySection.displayName = 'CategorySection'

export default CategorySection
