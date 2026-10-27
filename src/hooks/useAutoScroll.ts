/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AutoScrollOptions {
  speed?: number; // 1 (slowest) to 5 (fastest)
  onReachBottom?: () => void;
}

export function useAutoScroll(options: AutoScrollOptions = {}) {
  const { speed = 2, onReachBottom } = options;
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(speed);

  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isUserInteractingRef = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Speed multiplier: pixels per millisecond
  // Speed 1: ~15px/sec, Speed 2: ~30px/sec, Speed 3: ~50px/sec, Speed 4: ~80px/sec, Speed 5: ~120px/sec
  const getSpeedPxPerMs = (spd: number) => {
    switch (spd) {
      case 1:
        return 0.018;
      case 2:
        return 0.035;
      case 3:
        return 0.06;
      case 4:
        return 0.095;
      case 5:
        return 0.14;
      default:
        return 0.035;
    }
  };

  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    if (isActive) {
      setIsPaused(false);
      lastTimeRef.current = performance.now();
    }
  }, [isActive]);

  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
    lastTimeRef.current = performance.now();
  }, []);

  // Animation loop
  useEffect(() => {
    if (!isActive || isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const scrollStep = (currentTime: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = currentTime;
      }
      const delta = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (!isUserInteractingRef.current) {
        const pxPerMs = getSpeedPxPerMs(scrollSpeed);
        const scrollAmount = delta * pxPerMs;

        window.scrollBy({ top: scrollAmount, behavior: 'instant' });

        // Check if reached bottom
        const windowHeight = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;
        const currentScroll = window.scrollY + windowHeight;

        if (currentScroll >= fullHeight - 10) {
          stop();
          if (onReachBottom) onReachBottom();
          return;
        }
      }

      animationFrameRef.current = requestAnimationFrame(scrollStep);
    };

    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(scrollStep);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isActive, isPaused, scrollSpeed, onReachBottom, stop]);

  // Handle manual user scrolling without locking the page
  useEffect(() => {
    if (!isActive) return;

    const handleUserScroll = () => {
      isUserInteractingRef.current = true;
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
      // Resume gentle auto-scrolling 1.8 seconds after user finishes manual wheel/touch
      pauseTimeoutRef.current = setTimeout(() => {
        isUserInteractingRef.current = false;
        lastTimeRef.current = performance.now();
      }, 1800);
    };

    window.addEventListener('wheel', handleUserScroll, { passive: true });
    window.addEventListener('touchmove', handleUserScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleUserScroll);
      window.removeEventListener('touchmove', handleUserScroll);
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, [isActive]);

  return {
    isActive,
    isPaused,
    scrollSpeed,
    setScrollSpeed,
    start,
    pause,
    resume,
    stop,
    toggle: () => {
      if (!isActive) {
        start();
      } else if (isPaused) {
        resume();
      } else {
        pause();
      }
    },
  };
}
