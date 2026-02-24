import { useEffect, useCallback, useRef } from 'react'
import useSceneMachine from './hooks/useSceneMachine'
import useCinematicAudio from './hooks/useCinematicAudio'
import FilmGrainCanvas from './FilmGrainCanvas'
import DarknessScene from './scenes/DarknessScene'
import LightFlickerScene from './scenes/LightFlickerScene'
import CaseFileScene from './scenes/CaseFileScene'
import FileOpenScene from './scenes/FileOpenScene'
import TitleReveal from './scenes/TitleReveal'
import styles from './CinematicIntro.module.css'

/**
 * Production-Grade Cinematic Intro
 * 
 * A high-budget streaming thriller opening sequence
 * Dark, tense, immersive, and unsettling
 * 
 * Features:
 * - State machine-based scene progression
 * - Canvas-based film grain
 * - GSAP timeline animations
 * - Cinematic audio system
 * - Skippable with ESC or click
 * - Reduced motion support
 */

const CinematicIntro = ({ onComplete }) => {
    const containerRef = useRef(null)
    const { currentScene, skip, SCENES } = useSceneMachine({
        onComplete,
        autoStart: true
    })

    const audio = useCinematicAudio({ enabled: true })

    // Handle user interaction for audio unlock
    const handleInteraction = useCallback(() => {
        audio.unlock()
    }, [audio])

    // Handle skip
    const handleSkip = useCallback((e) => {
        if (e.key === 'Escape' || e.type === 'click') {
            audio.stopAll({ fadeOut: 500 })
            skip()
        }
    }, [audio, skip])

    // Setup event listeners
    useEffect(() => {
        document.addEventListener('keydown', handleSkip)
        containerRef.current?.addEventListener('click', handleInteraction)

        return () => {
            document.removeEventListener('keydown', handleSkip)
            containerRef.current?.removeEventListener('click', handleInteraction)
        }
    }, [handleSkip, handleInteraction])

    // Scene-specific audio triggers
    useEffect(() => {
        switch (currentScene) {
            case SCENES.DARKNESS:
                // Ambient drone fade in
                audio.play('drone', { loop: true, volume: 0.2, fadeIn: 2000 })
                break
            case SCENES.LIGHT:
                // Fluorescent hum
                audio.play('flicker', { volume: 0.3 })
                break
            case SCENES.CASE_FILE:
                // Will be triggered by stamp impact
                break
            case SCENES.TITLE:
                // Typewriter clicks handled in TitleReveal component
                break
            default:
                break
        }
    }, [currentScene, audio, SCENES])

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
        // Simplified intro for reduced motion
        return (
            <div className={styles.container} onClick={handleSkip}>
                <div className={styles.scene}>
                    <h1 className={styles.title}>THE HOLLOW ROOM</h1>
                </div>
            </div>
        )
    }

    return (
        <div ref={containerRef} className={styles.container}>
            {/* Film grain canvas */}
            <FilmGrainCanvas intensity={0.08} opacity={0.15} />

            {/* Film effects */}
            <div className={styles.vignette} />
            <div className={styles.scanlines} />
            <div className={styles.chromaticAberration} />

            {/* Scenes */}
            <DarknessScene isActive={currentScene === SCENES.DARKNESS} />

            <LightFlickerScene
                isActive={currentScene === SCENES.LIGHT}
            />

            <CaseFileScene
                isActive={currentScene === SCENES.CASE_FILE}
                onStampImpact={() => audio.play('stamp', { volume: 0.5 })}
            />

            <FileOpenScene
                isActive={currentScene === SCENES.FILE_OPEN}
            />

            <TitleReveal
                isActive={currentScene === SCENES.TITLE}
            />

            {/* Skip hint */}
            <div className={styles.skipHint}>
                Press ESC or Click to Skip
            </div>
        </div>
    )
}

export default CinematicIntro
