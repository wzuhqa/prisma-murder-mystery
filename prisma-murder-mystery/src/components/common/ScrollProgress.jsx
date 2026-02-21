import { useState, useEffect, useRef, useCallback } from 'react'
import './ScrollProgress.css'

/**
 * ScrollProgress - Forensic-style scroll progress indicator
 * Shows investigation progress through the case file
 */
const ScrollProgress = () => {
    const [progress, setProgress] = useState(0)
    const tickingRef = useRef(false)
    const lastProgressRef = useRef(0)

    const updateProgress = useCallback(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        const currentProgress = totalHeight > 0 ? Math.round((window.scrollY / totalHeight) * 100) : 0
        const clamped = Math.min(100, Math.max(0, currentProgress))

        // Only trigger React re-render if rounded value actually changed
        if (clamped !== lastProgressRef.current) {
            lastProgressRef.current = clamped
            setProgress(clamped)
        }
        tickingRef.current = false
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (!tickingRef.current) {
                tickingRef.current = true
                requestAnimationFrame(updateProgress)
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        updateProgress() // Initial calculation

        return () => window.removeEventListener('scroll', handleScroll)
    }, [updateProgress])

    return (
        <div className="scroll-progress-container" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="scroll-progress-track">
                <div
                    className="scroll-progress-bar"
                    style={{ height: `${progress}%` }}
                />
                <div className="scroll-progress-glow" style={{ top: `${progress}%` }} />
            </div>
            <div className="scroll-progress-label">
                <span className="progress-icon">⌕</span>
                <span className="progress-text">INVESTIGATION: {progress}%</span>
            </div>
        </div>
    )
}

export default ScrollProgress
