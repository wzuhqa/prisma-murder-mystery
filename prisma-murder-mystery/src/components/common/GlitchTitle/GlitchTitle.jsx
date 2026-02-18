import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './GlitchTitle.module.css';

const GlitchTitle = ({ text = "PRISMA" }) => {
    const containerRef = useRef(null);
    const baseRef = useRef(null);
    const redRef = useRef(null);
    const cyanRef = useRef(null);
    const flashRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // 1. Continuous Micro-Glitch (Jitter & Flicker)
            gsap.to([redRef.current, cyanRef.current], {
                x: () => gsap.utils.random(-2, 2),
                y: () => gsap.utils.random(-1, 1),
                duration: 0.1,
                repeat: -1,
                ease: "none",
                yoyo: true
            });

            gsap.to(containerRef.current, {
                opacity: () => gsap.utils.random(0.95, 1),
                filter: () => `contrast(${gsap.utils.random(1, 1.1)}) brightness(${gsap.utils.random(1, 1.05)})`,
                duration: 0.05,
                repeat: -1,
                ease: "none"
            });

            // 2. Aggressive Burst Glitch (Periodic - V2.5 Refinement)
            const triggerBurst = () => {
                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.delayedCall(gsap.utils.random(15, 25), triggerBurst); // Slower, more threatening
                    }
                });

                // Violent Shake
                tl.to(containerRef.current, {
                    x: () => gsap.utils.random(-15, 15),
                    y: () => gsap.utils.random(-8, 8),
                    skewX: () => gsap.utils.random(-8, 8),
                    scale: 1.03,
                    duration: 0.05,
                    repeat: 4,
                });

                // Red Scratch Flicker (V2.5)
                tl.to(`.${styles.redScratch}`, {
                    opacity: 0.8,
                    scaleX: 1.1,
                    duration: 0.05,
                    repeat: 3,
                    yoyo: true
                }, 0);

                // RGB Split Expansion
                tl.to(redRef.current, { x: -10, duration: 0.03 }, 0);
                tl.to(cyanRef.current, { x: 10, duration: 0.03 }, 0);

                // Clip-path Slice
                tl.set([redRef.current, cyanRef.current, baseRef.current], {
                    clipPath: () => {
                        const y1 = gsap.utils.random(0, 80);
                        const y2 = y1 + gsap.utils.random(5, 15);
                        return `inset(${y1}% 0 ${100 - y2}% 0)`;
                    }
                }, 0.1);

                // Flash Overlay
                tl.to(flashRef.current, { opacity: 0.4, backgroundColor: "#7a0000", duration: 0.02 }, 0.05);
                tl.to(flashRef.current, { opacity: 0, duration: 0.02 }, 0.07);

                // Reset
                tl.set([redRef.current, cyanRef.current, baseRef.current], {
                    clipPath: "inset(0% 0 0% 0)",
                    x: 0,
                    y: 0,
                    scale: 1,
                    skewX: 0
                }, 0.2);

                // Random 1-frame blackout
                if (Math.random() > 0.8) {
                    tl.to(containerRef.current, { opacity: 0, duration: 0.05 }, 0.1);
                    tl.to(containerRef.current, { opacity: 1, duration: 0.01 }, 0.15);
                }
            };

            // Start the cycle with a long delay
            gsap.delayedCall(10, triggerBurst);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={styles.glitchContainer}>
            <div ref={flashRef} className="absolute inset-0 pointer-events-none z-[50] opacity-0" />
            <div className={styles.noiseOverlay} />
            <div className={styles.scanlines} />

            <div className={styles.titleWrapper}>
                <div className={styles.redScratch} />
                <span ref={redRef} className={`${styles.glitchLayer} ${styles.redLayer} select-none`}>
                    {text}
                </span>
                <span ref={baseRef} className={styles.baseLayer}>
                    {text}
                </span>
                <span ref={cyanRef} className={`${styles.glitchLayer} ${styles.cyanLayer} select-none`}>
                    {text}
                </span>
            </div>
        </div>
    );
};

export default GlitchTitle;
