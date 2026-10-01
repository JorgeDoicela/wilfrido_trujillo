import { useState, useEffect, useRef } from 'react';

export interface UseLandingHeaderScrollOptions {
  reposeZonePx?: number;
  hideIntentPx?: number;
  revealIntentPx?: number;
}

export function useLandingHeaderScroll({
  reposeZonePx = 80,
  hideIntentPx = 100,
  revealIntentPx = 25,
}: UseLandingHeaderScrollOptions = {}): boolean {
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollYRef = useRef(0);
  const accumulatedDeltaRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('up');
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    lastScrollYRef.current = Math.max(0, window.scrollY);

    const updateVisibility = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollYRef.current;

      if (Math.abs(delta) < 2) {
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (currentScrollY <= reposeZonePx) {
        setIsVisible(true);
        accumulatedDeltaRef.current = 0;
        scrollDirectionRef.current = 'up';
      } else if (delta > 0) {
        if (scrollDirectionRef.current !== 'down') {
          scrollDirectionRef.current = 'down';
          accumulatedDeltaRef.current = 0;
        }

        const effectiveDelta =
          lastScrollYRef.current <= reposeZonePx
            ? currentScrollY - reposeZonePx
            : delta;

        if (effectiveDelta > 0) {
          accumulatedDeltaRef.current += effectiveDelta;
        }

        if (accumulatedDeltaRef.current >= hideIntentPx) {
          setIsVisible(false);
        }
      } else if (delta < 0) {
        if (scrollDirectionRef.current !== 'up') {
          scrollDirectionRef.current = 'up';
          accumulatedDeltaRef.current = 0;
        }

        accumulatedDeltaRef.current += Math.abs(delta);

        if (accumulatedDeltaRef.current >= revealIntentPx) {
          setIsVisible(true);
        }
      }

      lastScrollYRef.current = currentScrollY;
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) return;
      rafIdRef.current = window.requestAnimationFrame(() => {
        updateVisibility();
        rafIdRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [reposeZonePx, hideIntentPx, revealIntentPx]);

  return isVisible;
}
