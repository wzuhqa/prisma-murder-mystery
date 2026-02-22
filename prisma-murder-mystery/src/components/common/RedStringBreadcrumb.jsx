import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRedString } from '../../context/RedStringContext';
import './RedStringBreadcrumb.css';

// Page configuration with display names and icons
const pageConfig = {
    '/': { name: 'Home', icon: '◈' },
    '/events': { name: 'Events', icon: '◇' },
    '/team': { name: 'Team', icon: '◆' },
    '/contact': { name: 'Contact', icon: '◊' },
    '/about': { name: 'About', icon: '○' },
    '/register': { name: 'Register', icon: '□' }
};

const RedStringBreadcrumb = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { visitedPages: history } = useRedString();
    const containerRef = useRef(null);
    const [lineCoords, setLineCoords] = useState([]);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    // Calculate coordinates for the red string SVG lines
    useEffect(() => {
        if (!containerRef.current || history.length < 2) {
            setLineCoords([]);
            return;
        }

        const calculateLines = () => {
            const containerRect = containerRef.current.getBoundingClientRect();
            const coords = [];

            for (let i = 0; i < history.length - 1; i++) {
                const startEl = containerRef.current.querySelector(`[data-index="${i}"]`);
                const endEl = containerRef.current.querySelector(`[data-index="${i + 1}"]`);

                if (startEl && endEl) {
                    const startRect = startEl.getBoundingClientRect();
                    const endRect = endEl.getBoundingClientRect();

                    coords.push({
                        start: {
                            x: startRect.right - containerRect.left,
                            y: startRect.top + startRect.height / 2 - containerRect.top
                        },
                        end: {
                            x: endRect.left - containerRect.left,
                            y: endRect.top + endRect.height / 2 - containerRect.top
                        }
                    });
                }
            }

            setLineCoords(coords);
        };

        // Calculate after a small delay to ensure DOM is ready
        const timer = setTimeout(calculateLines, 50);
        window.addEventListener('resize', calculateLines);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', calculateLines);
        };
    }, [history]);

    const handleNavigate = (path, index) => {
        // Navigate to the page at the given index in history
        navigate(path);
    };

    if (history.length < 2) return null;

    // Base thickness for the string
    const baseThickness = 2;

    return (
        <motion.div
            className="red-string-breadcrumb"
            ref={containerRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {/* SVG canvas for drawing the red strings */}
            {lineCoords.length > 0 && (
                <svg className="red-string-canvas">
                    <defs>
                        {/* Gradient for string depth */}
                        <linearGradient id="string-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b0000" />
                            <stop offset="50%" stopColor="#ff1a1a" />
                            <stop offset="100%" stopColor="#8b0000" />
                        </linearGradient>

                        {/* Glow filter */}
                        <filter id="string-glow-breadcrumb" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {lineCoords.map((segment, i) => {
                        // Calculate control point for a slight droop (catenary effect)
                        const midX = (segment.start.x + segment.end.x) / 2;
                        const midY = (segment.start.y + segment.end.y) / 2 + 8; // 8px droop

                        return (
                            <React.Fragment key={i}>
                                {/* Shadow layer */}
                                <motion.line
                                    x1={segment.start.x} y1={segment.start.y}
                                    x2={segment.end.x} y2={segment.end.y}
                                    className="red-string-shadow"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.3 }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                />
                                {/* Main string */}
                                <motion.line
                                    x1={segment.start.x} y1={segment.start.y}
                                    x2={segment.end.x} y2={segment.end.y}
                                    className="red-string"
                                    strokeWidth={baseThickness}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.8 }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                />
                                {/* Fray effect - thinner overlapping line */}
                                <motion.line
                                    x1={segment.start.x} y1={segment.start.y}
                                    x2={segment.end.x} y2={segment.end.y}
                                    className="red-string-fray"
                                    strokeWidth={baseThickness * 0.8}
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 0.4 }}
                                    transition={{ duration: 0.8, delay: i * 0.1 + 0.2 }}
                                />
                            </React.Fragment>
                        );
                    })}
                </svg>
            )}

            {/* Breadcrumb items */}
            <div className="breadcrumb-items">
                {history.map((path, index) => {
                    const config = pageConfig[path] || { name: path, icon: '◈' };
                    const isLast = index === history.length - 1;
                    const isCurrent = path === location.pathname;

                    return (
                        <motion.div
                            key={`${path}-${index}`}
                            data-index={index}
                            className={`breadcrumb-item ${isCurrent ? 'current' : ''} ${isLast ? 'last' : ''}`}
                            onClick={() => handleNavigate(path, index)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            {/* Pin decoration */}
                            <div className="breadcrumb-pin" />

                            {/* Icon */}
                            <span className="breadcrumb-icon">{config.icon}</span>

                            {/* Name */}
                            <span className="breadcrumb-name">{config.name}</span>

                            {/* Red string attachment point */}
                            {!isLast && <div className="string-attachment" />}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default RedStringBreadcrumb;
