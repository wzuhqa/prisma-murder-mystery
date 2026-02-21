import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const RedThreadConnector = () => {
    const pathRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const path = pathRef.current;
            if (!path) return;

            // Wait for path length calculation
            const length = path.getTotalLength();

            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
            });

            gsap.to(path, {
                strokeDashoffset: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5,
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <svg
            className="fixed top-0 left-0 w-full h-screen pointer-events-none z-[1]"
            viewBox="0 0 1000 3000"
            preserveAspectRatio="none"
            style={{ willChange: 'transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
        >
            {/* Soft glow for the red thread and fraying organic effect */}
            <defs>
                <filter id="blood-thread">
                    {/* Fraying / Organic noise — reduced complexity for GPU perf */}
                    <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="1" result="noise" />
                    {/* Displacing the line based on noise */}
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" result="frayed" />
                    {/* Adding glow to the frayed line */}
                    <feGaussianBlur in="frayed" stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="frayed" />
                    </feMerge>
                </filter>
            </defs>
            {/* Thematic, erratic path that sweeps across the page */}
            <path
                ref={pathRef}
                d="M500,0 C800,400 200,800 500,1200 S800,2000 600,2400 S100,2800 500,3000"
                fill="none"
                stroke="#660000"
                strokeWidth="4"
                style={{ opacity: 0.8, willChange: 'stroke-dashoffset' }}
                filter="url(#blood-thread)"
            />
        </svg>
    );
}

export default RedThreadConnector;
