import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import './ForensicCursor.css';

const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, select, textarea, label, [tabindex]';

const ForensicCursor = () => {
    const cursorRef = useRef(null);
    const spotlightRef = useRef(null);
    const isPointerRef = useRef(false);
    const isVisibleRef = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth <= 1024) return;

        const cursor = cursorRef.current;
        const spotlight = spotlightRef.current;
        if (!cursor || !spotlight) return;

        gsap.set([cursor, spotlight], { xPercent: -50, yPercent: -50 });

        const xToCursor = gsap.quickSetter(cursor, "x", "px");
        const yToCursor = gsap.quickSetter(cursor, "y", "px");
        const xToSpotlight = gsap.quickSetter(spotlight, "x", "px");
        const yToSpotlight = gsap.quickSetter(spotlight, "y", "px");

        const handleMouseMove = (e) => {
            xToCursor(e.clientX);
            yToCursor(e.clientY);
            xToSpotlight(e.clientX);
            yToSpotlight(e.clientY);

            const target = e.target;
            const isInteractive = target && (
                target.closest(INTERACTIVE_SELECTORS) !== null
            );

            // Check for specialized target cursor (V2.6)
            const isTarget = target && target.closest('[data-cursor="target"]');

            if (isInteractive !== isPointerRef.current || isTarget) {
                isPointerRef.current = isInteractive;
                cursor.classList.toggle('forensic-cursor--pointer', isInteractive && !isTarget);
                cursor.classList.toggle('forensic-cursor--target', isTarget);
                spotlight.classList.toggle('spotlight-focus', isInteractive);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Reset pointer state on navigation
    const location = useLocation();
    useEffect(() => {
        if (cursorRef.current && spotlightRef.current) {
            isPointerRef.current = false;
            cursorRef.current.classList.remove('forensic-cursor--pointer');
            spotlightRef.current.classList.remove('spotlight-focus');
        }
    }, [location.pathname]);

    if (typeof window !== 'undefined' && window.innerWidth <= 1024) return null;

    return (
        <>
            <div
                ref={spotlightRef}
                className="forensic-spotlight"
            />
            <div
                ref={cursorRef}
                className="forensic-cursor"
            >
                <div className="cursor-dot" />
                <div className="cursor-aura" />
            </div>
        </>
    );
};

export default ForensicCursor;
