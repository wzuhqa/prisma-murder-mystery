import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EventCard from './EventCard.jsx'

const EventAccordion = ({ type, events, isOpen: initialOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initialOpen)

    return (
        <div className="mb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex flex-col items-center justify-center py-6 px-6 bg-black/20 border-b border-white/5 hover:bg-black/40 transition-colors duration-300 group gap-3"
            >
                <div className="flex flex-col items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#c41e3a] shadow-[0_0_8px_#c41e3a]" />
                    <span className="text-[0.85rem] uppercase tracking-[0.3em] text-gray-400 group-hover:text-[#e8e0d0] transition-colors duration-300 font-mono font-bold">
                        {type} // PARTICIPATION_TYPE
                    </span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="text-[#c41e3a] text-xs flex items-center justify-center"
                >
                    ▼
                </motion.div>
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
                        <div className="flex flex-wrap justify-center gap-3 p-4">
                            {events.map((event, index) => (
                                <div key={index} className="w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.5rem)] max-w-[400px]">
                                    <EventCard name={event} />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default EventAccordion
