import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from './EventCard.jsx'

const EventAccordion = ({ type, events, isOpen: initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen)

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-2 px-4 bg-white/[0.03] border-b border-white/5 hover:bg-white/[0.05] transition-colors duration-300 group"
            >
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#7a0000] transition-colors duration-300">
                    {type}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-[#7a0000]"
                >
                    ▼
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                            {events.map((event, index) => (
                                <EventCard key={index} name={event} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EventAccordion
