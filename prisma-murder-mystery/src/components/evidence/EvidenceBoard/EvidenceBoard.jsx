import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Polaroid from './Polaroid'
import styles from './EvidenceBoard.module.css'

gsap.registerPlugin(ScrollTrigger)

const SPONSORS_DATA = [
    { name: "3D Engineering", codename: "The Architect", note: "Built the trap.", logo: "" },
    { name: "Adobe", codename: "The Creative", note: "Altered the documents.", logo: "" },
    { name: "Balaji", codename: "The Supplier", note: "Snacks at the crime scene.", logo: "" },
    { name: "BigWig", codename: "The Wig", note: "Disguise expert.", logo: "" },
    { name: "Caterman", codename: "The Chef", note: "Poison in the food?", logo: "" },
    { name: "Clovia", codename: "The Silk", note: "Left a fabric trace.", logo: "" },
    { name: "Coolberg", codename: "Zero Proof", note: "Sober witness.", logo: "" },
    { name: "F9Kart", codename: "The Racer", note: "Getaway driver.", logo: "" },
    { name: "Federal", codename: "The Bank", note: "Follow the money.", logo: "" },
    { name: "Incredible", codename: "The Myth", note: "Too good to be true.", logo: "" },
    { name: "Insight", codename: "The Eye", note: "Saw everything.", logo: "" },
    { name: "Mac-V", codename: "The Shade", note: "Hiding in plain sight.", logo: "" },
    { name: "Mojo", codename: "The Charm", note: "Hypnotic influence.", logo: "" },
    { name: "Panchwati", codename: "The Grove", note: "Meeting point confirmed.", logo: "" },
    { name: "Pardesi", codename: "The Outsider", note: "No alibi.", logo: "" },
    { name: "Playerone", codename: "The Gamer", note: "Played us all.", logo: "" },
    { name: "Red-Bull", codename: "The Wings", note: "Flight risk.", logo: "" },
    { name: "Security", codename: "The Guard", note: "Breached.", logo: "" },
    { name: "Siemens", codename: "The Tech", note: "Hacked the system.", logo: "" },
    { name: "Sipp", codename: "The Drink", note: "Spiked.", logo: "" },
    { name: "Skivia", codename: "The Skin", note: "DNA evidence found.", logo: "" },
    { name: "Svva", codename: "The Essence", note: "Lingering scent.", logo: "" },
    { name: "Timex", codename: "The Clock", note: "Running out of time.", logo: "" },
    { name: "Vfission", codename: "The Optic", note: "Caught on infrared lens.", logo: "" }
]

const EvidenceBoard = () => {
    const containerRef = useRef(null)
    const overlayRef = useRef(null)

    useEffect(() => {
        console.log(`EVIDENCE BOARD LOADED: ${SPONSORS_DATA.length} SUSPECTS ACTIVE`);
    }, []);

    // Flashlight Effect
    const handleMouseMove = (e) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        containerRef.current.style.setProperty('--x', `${x}px`)
        containerRef.current.style.setProperty('--y', `${y}px`)
    }

    // Entry Animation
    useEffect(() => {
        if (!containerRef.current) return

        const ctx = gsap.context(() => {
            // Staggered Drop of Polaroids
            gsap.from(`.${styles.polaroid}`, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 70%",
                },
                y: -100,
                opacity: 0,
                rotation: () => Math.random() * 20 - 10,
                stagger: 0.15,
                duration: 0.8,
                ease: "back.out(1.7)"
            })

            // Draw the red strings
            const lines = document.querySelectorAll(`.${styles.threadLine}`)
            lines.forEach(line => {
                const length = line.getTotalLength()
                gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
                gsap.to(line, {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                    },
                    strokeDashoffset: 0,
                    duration: 1.5,
                    delay: 0.5,
                    ease: "power2.out"
                })
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    // Generate random connecting lines
    // In a real scenario, you might calculate exact coordinates based on refs
    // For now, we'll draw some static thematic lines

    return (
        <section
            ref={containerRef}
            className={styles.boardSection}
            onMouseMove={handleMouseMove}
        >
            <div ref={overlayRef} className={styles.flashlightOverlay} />

            <div className={styles.boardHeader}>
                <h2 className={styles.title}>EVIDENCE BOARD</h2>
                <p className={styles.subtitle}>“Follow the money. The truth is pinned to the wall.”</p>
            </div>

            <div className={styles.boardContainer}>
                {/* SVG Thread Layer */}
                <svg className={styles.threadsSvg}>
                    {/* Abstract connections for visual flair */}
                    <line x1="20%" y1="30%" x2="50%" y2="50%" className={styles.threadLine} />
                    <line x1="50%" y1="50%" x2="80%" y2="30%" className={styles.threadLine} />
                    <line x1="50%" y1="50%" x2="30%" y2="80%" className={styles.threadLine} />
                    <line x1="80%" y1="30%" x2="70%" y2="70%" className={styles.threadLine} />
                </svg>

                {SPONSORS_DATA.map((sponsor, i) => (
                    <Polaroid
                        key={i}
                        sponsor={sponsor}
                        rotation={Math.random() * 12 - 6} // Random rotation -6 to +6
                    />
                ))}
            </div>
        </section>
    )
}

export default EvidenceBoard
