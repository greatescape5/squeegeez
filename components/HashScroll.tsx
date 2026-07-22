'use client';

import { useEffect } from 'react';

// Next.js App Router doesn't reliably scroll to a #hash on initial load
// (hydration resets scroll). This scrolls to the target after mount.
export default function HashScroll() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    }
  }, []);
  return null;
}
