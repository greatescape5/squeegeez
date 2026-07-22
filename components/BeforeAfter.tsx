'use client';

import { useRef, useState } from 'react';

type Props = {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
};

// Drag (or use arrow keys) to wipe between the before and after image.
export default function BeforeAfter({ before, after, beforeLabel = 'Before', afterLabel = 'After' }: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  function updateFromX(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    setPos(pct);
  }

  return (
    <div
      ref={ref}
      className="ba"
      role="slider"
      aria-label="Before and after comparison — drag to reveal"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos)}
      tabIndex={0}
      onPointerDown={(e) => {
        dragging.current = true;
        updateFromX(e.clientX);
        try { (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId); } catch {}
      }}
      onPointerMove={(e) => { if (dragging.current) updateFromX(e.clientX); }}
      onPointerUp={() => { dragging.current = false; }}
      onPointerCancel={() => { dragging.current = false; }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4));
        if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4));
      }}
    >
      {/* After fills the base; before is clipped on top from the left */}
      <img className="ba-img" src={after} alt={afterLabel} draggable={false} />
      <img
        className="ba-img ba-before"
        src={before}
        alt={beforeLabel}
        draggable={false}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />

      <span className="ba-label ba-label--before" style={{ opacity: pos > 14 ? 1 : 0 }}>{beforeLabel}</span>
      <span className="ba-label ba-label--after" style={{ opacity: pos < 86 ? 1 : 0 }}>{afterLabel}</span>

      <div className="ba-divider" style={{ left: `${pos}%` }} aria-hidden="true" />
      <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 8l-4 4 4 4M14 8l4 4-4 4" />
        </svg>
      </div>
    </div>
  );
}
