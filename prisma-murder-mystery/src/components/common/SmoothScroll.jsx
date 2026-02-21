import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactLenis, useLenis } from 'lenis/react';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
    const lenis = useLenis(ScrollTrigger.update);
    const { pathname } = useLocation();
    const lenisRef = useRef(lenis);

    // Keep ref in sync without re-creating callback
    useEffect(() => {
        lenisRef.current = lenis;
    }, [lenis]);

    // Stable ticker callback — created once, never changes
    const tickerCallback = useCallback((time) => {
        if (lenisRef.current) {
            lenisRef.current.raf(time * 1000);
        }
    }, []);

    useEffect(() => {
        gsap.ticker.add(tickerCallback);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerCallback);
        };
    }, [tickerCallback]);

    // Reset scroll position on route change
    useEffect(() => {
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, lenis]);

    return (
        <ReactLenis root options={{
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        }}>
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
