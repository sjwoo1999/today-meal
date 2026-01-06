'use client';

import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'desktop-lg';

interface BreakpointConfig {
  mobile: { max: number };
  tablet: { min: number; max: number };
  desktop: { min: number; max: number };
  'desktop-lg': { min: number };
}

const BREAKPOINTS: BreakpointConfig = {
  mobile: { max: 767 },
  tablet: { min: 768, max: 1279 },
  desktop: { min: 1280, max: 1919 },
  'desktop-lg': { min: 1920 },
};

function getBreakpoint(width: number): Breakpoint {
  if (width <= BREAKPOINTS.mobile.max) return 'mobile';
  if (width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max) return 'tablet';
  if (width >= BREAKPOINTS.desktop.min && width <= BREAKPOINTS.desktop.max) return 'desktop';
  return 'desktop-lg';
}

interface UseBreakpointReturn {
  breakpoint: Breakpoint;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isDesktopLg: boolean;
  isDesktopOrLarger: boolean;
  isMobileOrTablet: boolean;
  width: number;
}

export function useBreakpoint(): UseBreakpointReturn {
  const [state, setState] = useState<{ breakpoint: Breakpoint; width: number }>({
    breakpoint: 'mobile',
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    // Set initial state
    const initialWidth = window.innerWidth;
    setState({
      breakpoint: getBreakpoint(initialWidth),
      width: initialWidth,
    });

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        breakpoint: getBreakpoint(width),
        width,
      });
    };

    // Debounced resize handler for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const { breakpoint, width } = state;

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isDesktopLg: breakpoint === 'desktop-lg',
    isDesktopOrLarger: breakpoint === 'desktop' || breakpoint === 'desktop-lg',
    isMobileOrTablet: breakpoint === 'mobile' || breakpoint === 'tablet',
    width,
  };
}

// Hook for checking specific breakpoint
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Convenience hooks
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1280px)');
}

export function useIsTabletOrLarger(): boolean {
  return useMediaQuery('(min-width: 768px)');
}
