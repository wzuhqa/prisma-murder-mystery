import { motion } from 'framer-motion'

const EventCard = ({ name }) => {
    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(122, 0, 0, 0.15)",
                borderColor: "rgba(122, 0, 0, 0.4)",
                boxShadow: "0 0 20px rgba(122, 0, 0, 0.2)"
            }}
            className="group relative flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7a0000]/0 via-[#7a0000]/10 to-[#7a0000]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <span className="text-[#7a0000] text-xl group-hover:scale-110 transition-transform duration-300">›</span>
            <span className="text-gray-300 group-hover:text-white font-medium tracking-wide transition-colors duration-300">
                {name}
            </span>

            {/* Glow Effect */}
            <div className="absolute right-0 top-0 h-full w-1 bg-[#7a0000] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
    )
}

export default EventCard
