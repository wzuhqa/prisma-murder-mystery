import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const ArchiveInput = ({
    id,
    name,
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    autoComplete,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef(null);

    const hasValue = value && value.length > 0;

    return (
        <div className="relative group mb-3 md:mb-4"> {/* Added more bottom margin to the group itself */}
            {/* Label */}
            <label
                htmlFor={id}
                className="block text-xs md:text-sm font-special-elite tracking-[0.2em] font-bold uppercase mb-3 md:mb-4" // Increased margin and text size
                style={{
                    color: isFocused ? '#C41E3A' : '#808088',
                    transition: 'color 0.3s ease',
                    textShadow: isFocused ? '0 0 8px rgba(196, 30, 58, 0.4)' : 'none',
                }}
            >
                {label}
                {required && <span className="ml-2 font-mono" style={{ color: '#C41E3A' }}>*</span>}
            </label>

            {/* Input Wrapper */}
            <motion.div
                className="relative"
                animate={{
                    scale: isFocused ? 1.01 : 1,
                }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
            >
                {/* Glitch streak on focus */}
                <AnimatePresence>
                    {isFocused && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="absolute h-px w-full"
                                style={{ background: 'rgba(196, 30, 58, 0.6)', top: '30%' }}
                                initial={{ x: '-100%', opacity: 0.8 }}
                                animate={{ x: '100%', opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut', delay: 0.05 }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input field */}
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    required={required}
                    autoComplete={autoComplete}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    placeholder={placeholder}
                    className="w-full px-4 py-3.5 md:py-4 md:text-lg font-special-elite font-bold tracking-widest outline-none rounded-none transition-all duration-300"
                    style={{
                        background: 'rgba(18, 18, 22, 0.75)',
                        color: '#E5E5E5',
                        border: '1px solid rgba(255,255,255,0.03)',
                        borderBottom: 'none',
                        boxShadow: error
                            ? '0 0 0 1px rgba(255, 23, 68, 0.3), inset 0 0 20px rgba(255, 23, 68, 0.05)'
                            : isFocused
                                ? 'inset 0 0 40px rgba(0,0,0,0.9), 0 0 15px rgba(139,0,0,0.1)'
                                : isHovered
                                    ? 'inset 0 0 25px rgba(0,0,0,0.5), 0 0 10px rgba(139,0,0,0.05)'
                                    : 'inset 0 0 20px rgba(0,0,0,0.7)',
                        caretColor: '#C41E3A',
                        /* Typewriter cursor simulation */
                        caretShape: 'block',
                    }}
                />

                {/* Distressed physical tape underline */}
                <motion.div
                    className="absolute bottom-0 left-0 w-full"
                    style={{
                        height: isFocused ? '2px' : '1px',
                        background: isFocused
                            ? 'repeating-linear-gradient(45deg, #8B0000, #8B0000 5px, #C41E3A 5px, #C41E3A 10px)'
                            : 'rgba(255,255,255,0.1)',
                        boxShadow: isFocused ? '0 0 8px rgba(196,30,58,0.4)' : 'none',
                    }}
                    transition={{ duration: 0.2 }}
                />
            </motion.div>

            {/* Error message */}
            <AnimatePresence>
                {error && (
                    <motion.p
                        id={`${id}-error`}
                        role="alert"
                        className="mt-2 text-xs md:text-sm font-special-elite tracking-wider font-bold"
                        style={{ color: '#FF1744' }}
                        initial={{ opacity: 0, y: -4, x: [-2, 2, -2, 1, 0] }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        ✗ {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};

ArchiveInput.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    required: PropTypes.bool,
    autoComplete: PropTypes.string,
};

export default ArchiveInput;
