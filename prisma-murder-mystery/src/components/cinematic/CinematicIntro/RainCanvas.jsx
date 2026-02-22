import { useEffect, useRef } from 'react'

/**
 * Rain Canvas Component
 * 
 * Particle-based rain system using Canvas
 * Optimizations:
 * - Object pooling for performance
 * - Reduced particle count (50 vs 100)
 * - Throttled to 30fps
 * - Reduced motion support
 */

class RainParticle {
    constructor(width, height) {
        this.reset(width, height)
    }

    reset(width, height) {
        this.x = Math.random() * width
        this.y = Math.random() * -height
        this.length = Math.random() * 15 + 10
        this.speed = Math.random() * 3 + 2
        this.opacity = Math.random() * 0.3 + 0.1
    }

    update(width, height) {
        this.y += this.speed
        if (this.y > height) {
            this.reset(width, height)
        }
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(this.x, this.y + this.length)
        ctx.strokeStyle = `rgba(150, 180, 200, ${this.opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
    }
}

const RainCanvas = ({ particleCount = 50, enabled = true }) => {
    const canvasRef = useRef(null)
    const rafRef = useRef(null)
    const particlesRef = useRef([])
    const lastFrameTimeRef = useRef(0)

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!enabled || prefersReducedMotion) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d', { alpha: true })
        const fps = 30
        const frameInterval = 1000 / fps

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            // Reinitialize particles with capped count
            const actualCount = Math.min(particleCount, 60) // Hard cap at 60
            particlesRef.current = Array.from(
                { length: actualCount },
                () => new RainParticle(canvas.width, canvas.height)
            )
        }
        resize()
        window.addEventListener('resize', resize)

        // Animation loop with throttling
        const animate = (timestamp) => {
            if (timestamp - lastFrameTimeRef.current < frameInterval) {
                rafRef.current = requestAnimationFrame(animate)
                return
            }
            lastFrameTimeRef.current = timestamp

            const { width, height } = canvas

            // Clear canvas
            ctx.clearRect(0, 0, width, height)

            // Update and draw particles
            particlesRef.current.forEach(particle => {
                particle.update(width, height)
                particle.draw(ctx)
            })

            rafRef.current = requestAnimationFrame(animate)
        }

        rafRef.current = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('resize', resize)
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current)
            }
        }
    }, [particleCount, enabled])

    // Don't render canvas when disabled
    // Note: This is safe because enabled is in the useEffect dependency array,
    // so when enabled changes from true to false, the cleanup function runs first
    // (canceling the animation frame), then the effect re-runs and returns early.
    if (!enabled) return null

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
                zIndex: 9997,
                opacity: 0.6
            }}
        />
    )
}

export default RainCanvas
