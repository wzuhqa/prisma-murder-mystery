import { motion } from 'framer-motion'
import EventAccordion from './EventAccordion.jsx'

const CategorySection = ({ title, description, tagline, sections }) => {
    return (
        <section className="mb-16 last:mb-0">
            <div className="mb-8 border-l-2 border-[#7a0000] pl-6">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl font-bold tracking-tighter text-white mb-2"
                >
                    {title}
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 max-w-2xl text-sm leading-relaxed"
                >
                    {description}
                </motion.p>
                {tagline && (
                    <p className="text-[10px] uppercase tracking-[0.3em] text-[#7a0000] mt-3 opacity-60">
                        {tagline}
                    </p>
                )}
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-sm overflow-hidden shadow-2xl">
                {sections.map((section, index) => (
                    <EventAccordion
                        key={index}
                        type={section.type}
                        events={section.events}
                        isOpen={index === 0} // Open the first section by default
                    />
                ))}
            </div>
        </section>
    )
}

export default CategorySection
