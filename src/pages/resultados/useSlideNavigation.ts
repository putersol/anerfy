import { useState, useCallback, useEffect } from 'react';

export function useSlideNavigation(totalSlides: number) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= totalSlides) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide, totalSlides]);

  const next = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide(c => c + 1);
    }
  }, [currentSlide, totalSlides]);

  const prev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(c => c - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      if (e.key === 'End') { e.preventDefault(); goTo(totalSlides - 1); }
      // Fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, goTo, totalSlides]);

  return { currentSlide, direction, goTo, next, prev, totalSlides };
}
