import { useEffect, useRef } from 'react'

/**
 * Film Grain Canvas Component
 * 
 * Procedural film grain using Canvas API
 * Optimizations:
 * - 24fps (film standard, imperceptible vs 30fps)
 * - 1/4 resolution with CSS scaling (imperceptible for noise)
 * - Reduced motion support
 */

const FilmGrainCanvas = ({ intensity = 0.05, opacity = 0.15 }) => {
    const canvasRef = useRef(null)
    const rafRef = useRef(null)
    const lastFrameTimeRef = useRef(0)

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReducedMotion) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })
        const fps = 24 // Film standard
        const frameInterval = 1000 / fps
        const scale = 0.25 // Render at 1/4 resolution

        // Set canvas size (smaller for performance)
        const resize = () => {
            canvas.width = Math.floor(window.innerWidth * scale)
            canvas.height = Math.floor(window.innerHeight * scale)
        }
        resize()
        window.addEventListener('resize', resize)

        // Generate grain
        const renderGrain = (timestamp) => {
            // Throttle to target fps
            if (timestamp - lastFrameTimeRef.current < frameInterval) {
                rafRef.current = requestAnimationFrame(renderGrain)
                return
            }
            lastFrameTimeRef.current = timestamp

            const { width, height } = canvas
            const imageData = ctx.createImageData(width, height)
            const data = imageData.data

            // Generate noise
            for (let i = 0; i < data.length; i += 4) {
                const noise = (Math.random() - 0.5) * intensity * 255
                data[i] = noise     // R
                data[i + 1] = noise // G
                data[i + 2] = noise // B
                data[i + 3] = opacity * 255 // A
            }

            ctx.putImageData(imageData, 0, 0)
            rafRef.current = requestAnimationFrame(renderGrain)
        }

        rafRef.current = requestAnimationFrame(renderGrain)

        return () => {
            window.removeEventListener('resize', resize)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [intensity, opacity])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9998,
                mixBlendMode: 'overlay',
                imageRendering: 'pixelated' // Crisp upscaling for noise
            }}
        />
    )
}

export default FilmGrainCanvas
