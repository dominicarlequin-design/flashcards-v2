import { useState, useEffect } from 'react';

// desktop breakpoint hook
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 860);
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 860);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isDesktop;
}

// wide desktop (e.g. MacBook Pro 14"/16" — 1512px+/1728px+ viewports)
export function useIsLarge() {
  const [isLarge, setIsLarge] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  useEffect(() => {
    const fn = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isLarge;
}

// very wide desktop (MacBook Pro 16" and bigger external displays)
export function useIsXLarge() {
  const [isXLarge, setIsXLarge] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1440);
  useEffect(() => {
    const fn = () => setIsXLarge(window.innerWidth >= 1440);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isXLarge;
}
