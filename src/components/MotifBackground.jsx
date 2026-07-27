import { MOTIF_SETS, DENSITY, MOTIF_POS } from '../constants/theme';

// Fixed, low-opacity drifting law-symbol backdrop. Sits behind every screen;
// fully decorative (pointer-events:none) and respects both the in-app
// "Reduce motion" setting and the OS-level prefers-reduced-motion query
// (enforced in index.css with !important as a hard fallback).
export default function MotifBackground({ motif, density, reduceMotion }) {
  const set = MOTIF_SETS[motif] || MOTIF_SETS.law;
  let count = motif === 'off' ? 0 : (DENSITY[density] || DENSITY.normal);
  if (motif === 'minimal') count = Math.min(count, 4);

  return (
    <div className="fc-bg" aria-hidden="true">
      {MOTIF_POS.slice(0, count).map((p, i) => (
        <span
          key={i}
          style={{
            top: p.top,
            left: p.left ?? 'auto',
            right: p.right ?? 'auto',
            fontSize: p.size,
            opacity: p.opacity,
            animation: reduceMotion ? 'none' : `fcDrift ${p.dur}s ease-in-out infinite ${p.delay}s`,
          }}
        >
          {set[i % set.length]}
        </span>
      ))}
    </div>
  );
}
