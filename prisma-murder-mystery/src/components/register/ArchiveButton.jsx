import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const ArchiveButton = ({ children, type = 'button', onClick, disabled, isLoading, className }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [particles, setParticles] = useState([]);
    const btnRef = useRef(null);

    const handleClick = (e) => {
        if (disabled || isLoading) return;

        // Micro scale down
        setIsClicking(true);

        // Spawn micro red particles from click point
        const rect = btnRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const newParticles = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x,
            y,
            angle: (i / 8) * 360,
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 600);
        setTimeout(() => setIsClicking(false), 150);

        if (onClick) onClick(e);
    };

    return (
        <motion.button
            ref={btnRef}
            type={type}
            disabled={disabled || isLoading}
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`relative overflow-hidden select-none flex items-center justify-center ${className || ''}`}
            aria-disabled={disabled || isLoading}
            animate={{
                scale: isClicking ? 0.97 : 1,
                y: isHovered && !isClicking ? -2 : 0,
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
                width: '100%',
                maxWidth: '600px',
                minHeight: '80px',
                margin: '0 auto',
                paddingRight: '2.5rem', // Visual offset for the text
                background: disabled || isLoading
                    ? 'rgba(139, 0, 0, 0.3)'
                    : 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)',
                border: '1px solid rgba(139, 0, 0, 0.4)',
                boxShadow: disabled
                    ? 'none'
                    : isHovered
                        ? '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(139,0,0,0.2)'
                        : '0 4px 15px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.8)',
                cursor: disabled || isLoading ? 'not-allowed' : 'crosshair',
                // Physical folder tab cut matching home page
                clipPath: 'polygon(0 0, 90% 0, 100% 20%, 100% 100%, 0 100%)',
            }}
        >
            {/* Distressed Red Tape "Seal" matching the hero buttons */}
            <div
                className="absolute right-[-20px] top-[15px] pointer-events-none"
                style={{
                    width: '60px',
                    height: '25px',
                    background: 'repeating-linear-gradient(90deg, #8B0000, #8B0000 2px, #C41E3A 2px, #C41E3A 4px)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                    transform: 'rotate(45deg)',
                    zIndex: 5,
                    border: '1px solid rgba(0,0,0,0.5)',
                }}
            />

            {/* Forensic scan-line on hover */}
            <AnimatePresence>
                {isHovered && !disabled && !isLoading && (
                    <motion.div
                        className="absolute top-0 bottom-0 pointer-events-none"
                        style={{
                            width: '50%',
                            background: 'linear-gradient(to right, transparent, rgba(139, 0, 0, 0.2), transparent)',
                            zIndex: 3,
                        }}
                        initial={{ left: '-100%' }}
                        animate={{ left: '200%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                )}
            </AnimatePresence>
            <AnimatePresence>
                {isClicking && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.6, 0] }}
                        transition={{ duration: 0.15 }}
                        style={{
                            background: 'rgba(196, 30, 58, 0.3)',
                            mixBlendMode: 'overlay',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Red particle burst on click */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute pointer-events-none rounded-full"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: 4,
                        height: 4,
                        background: '#C41E3A',
                        boxShadow: '0 0 4px #FF1744',
                    }}
                    initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                    animate={{
                        scale: [0, 1, 0],
                        x: Math.cos((p.angle * Math.PI) / 180) * 30,
                        y: Math.sin((p.angle * Math.PI) / 180) * 30,
                        opacity: 0,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            ))}

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-3 w-full h-full pt-1">
                {isLoading ? (
                    <>
                        {/* Spinning loader */}
                        <motion.span
                            className="inline-block w-4 h-4 border-2 rounded-full"
                            style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        <span
                            className="font-special-elite font-bold tracking-[0.3em] uppercase leading-none"
                            style={{ color: 'rgba(255,255,255,0.7)' }}
                        >
                            PROCESSING
                        </span>
                    </>
                ) : (
                    <span
                        className="font-special-elite font-bold tracking-[0.3em] uppercase leading-none"
                        style={{ color: '#E8E8E8' }}
                    >
                        {children}
                    </span>
                )}
            </span>
        </motion.button>
    );
};

ArchiveButton.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
};

export default ArchiveButton;
