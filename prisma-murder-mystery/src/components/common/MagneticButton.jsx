import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * MagneticButton
 * Wraps any children and creates a magnetic pull effect when the cursor
 * enters the element's proximity.
 *
 * Props:
 *   strength     - How strong the magnetic pull is (default: 0.4)
 *   className    - Extra classes for the wrapper div
 *   children     - Content inside the button
 */
const MagneticButton = ({ children, strength = 0.4, className = '' }) => {
    const ref = useRef(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e) => {
        if (!ref.current) return
        const { left, top, width, height } = ref.current.getBoundingClientRect()
        const centerX = left + width / 2
        const centerY = top + height / 2
        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength
        setPosition({ x: deltaX, y: deltaY })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <motion.div
            ref={ref}
            className={`inline-block ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 200, damping: 18, mass: 0.5 }}
        >
            {children}
        </motion.div>
    )
}

export default MagneticButton
