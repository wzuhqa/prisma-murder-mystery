import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Paperclip } from 'lucide-react'

const EventCard = ({ name }) => {
    const [isClipped, setIsClipped] = useState(false)

    // Generate a mock status for forensics
    const statuses = ['UNRESOLVED', 'CASE CLOSED', 'UNDER REVIEW', 'ACTIVE']
    const status = statuses[Math.floor(Math.random() * name.length) % statuses.length]
    const isClosed = status === 'CASE CLOSED'

    const toggleClip = (e) => {
        e.stopPropagation()
        setIsClipped(!isClipped)
    }

    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(196, 30, 58, 0.05)",
                borderColor: "rgba(196, 30, 58, 0.4)",
                boxShadow: "0 0 30px rgba(0, 0, 0, 0.6)"
            }}
            onClick={toggleClip}
            className="group relative flex items-center justify-between p-4 rounded-sm border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Forensic Magnifier Surface */}
            <div className="magnifier-surface" />

            {/* Scanning Line Sweep */}
            <div className="scanning-line" />

            <div className="relative z-10 flex items-center gap-3">
                <span className="text-[#c41e3a] font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">[</span>
                <span className="text-gray-400 group-hover:text-[#e8e0d0] font-mono text-sm tracking-[0.2em] transition-all duration-300 uppercase group-hover:translate-x-1">
                    {name}
                </span>
                <span className="text-[#c41e3a] font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">]</span>
            </div>

            <div className="flex items-center gap-4 relative z-10">
                {/* Paperclip Interaction */}
                <AnimatePresence>
                    {isClipped && (
                        <motion.div
                            initial={{ y: -20, opacity: 0, rotate: -45 }}
                            animate={{ y: 0, opacity: 1, rotate: -15 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="bg-[#e8e0d0] p-1 rounded-sm shadow-lg border border-black/20"
                        >
                            <Paperclip size={12} className="text-black rotate-45" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Forensic Status Stamp */}
                <div className={`status-stamp ${isClosed ? 'status-stamp--closed' : ''}`}>
                    <span>{status}</span>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-[#c41e3a]/0 via-[#c41e3a]/5 to-[#c41e3a]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </motion.div>
    )
}

export default EventCard
