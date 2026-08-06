import { useRef, useState } from 'react';
import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

const COMMIT_THRESHOLD = 110; // px of horizontal drag needed to commit a swipe
const TAP_TOLERANCE = 6; // px of movement still counted as a tap, not a drag

export default function StudyView({ card, index, total, onAnswer, onExit }) {
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false); // drives the render-time transition style
  const draggingRef = useRef(false); // synchronous flag for the event handlers below
  const startX = useRef(0);
  const moved = useRef(false);

  const commit = (known) => {
    setDragX(0);
    setFlipped(false);
    onAnswer(known);
  };

  const onPointerDown = (e) => {
    draggingRef.current = true;
    setIsDragging(true);
    moved.current = false;
    startX.current = e.clientX;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > TAP_TOLERANCE) moved.current = true;
    setDragX(dx);
  };
  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (!moved.current) {
      setFlipped(f => !f);
      setDragX(0);
      return;
    }
    if (dragX > COMMIT_THRESHOLD) commit(true);
    else if (dragX < -COMMIT_THRESHOLD) commit(false);
    else setDragX(0);
  };

  const pct = total > 0 ? Math.round((index / total) * 100) : 0;
  const rotate = dragX / 18;
  const knowOpacity = Math.max(0, Math.min(dragX / COMMIT_THRESHOLD, 1));
  const dontKnowOpacity = Math.max(0, Math.min(-dragX / COMMIT_THRESHOLD, 1));

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
        <button onClick={onExit} className="fc-tap" style={{
          width: '34px', height: '34px', borderRadius: RADII.circle, border: `1px solid ${INK.border}`,
          background: INK.panel, color: INK.inkMuted, fontSize: '15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>×</button>
        <div style={{ flex: 1, height: '6px', background: INK.border, borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: INK.accent, borderRadius: '999px', transition: 'width .3s' }} />
        </div>
        <span style={{ fontFamily: FONTS.sans, fontSize: '12px', color: INK.inkMuted, flexShrink: 0 }}>{index + 1}/{total}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <div
          style={{ perspective: '1400px', position: 'relative', touchAction: 'pan-y', cursor: 'grab' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* swipe overlay labels */}
          <div style={{
            position: 'absolute', top: '20px', left: '20px', zIndex: 2, pointerEvents: 'none',
            fontFamily: FONTS.sans, fontWeight: '700', fontSize: '13px', letterSpacing: '1.5px',
            color: INK.danger, border: `2px solid ${INK.danger}`, borderRadius: RADII.sm, padding: '6px 12px',
            opacity: dontKnowOpacity, transform: `rotate(-8deg) scale(${0.9 + dontKnowOpacity * 0.1})`,
          }}>DON'T KNOW</div>
          <div style={{
            position: 'absolute', top: '20px', right: '20px', zIndex: 2, pointerEvents: 'none',
            fontFamily: FONTS.sans, fontWeight: '700', fontSize: '13px', letterSpacing: '1.5px',
            color: INK.success, border: `2px solid ${INK.success}`, borderRadius: RADII.sm, padding: '6px 12px',
            opacity: knowOpacity, transform: `rotate(8deg) scale(${0.9 + knowOpacity * 0.1})`,
          }}>KNOW IT</div>

          <div style={{
            width: '100%', display: 'grid', position: 'relative', transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform .4s cubic-bezier(0.23,1,0.32,1)',
            transform: `translateX(${dragX}px) rotate(${rotate}deg) ${flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'}`,
          }}>
            {/* front: term */}
            <div style={{
              gridArea: '1 / 1', minHeight: '320px', width: '100%', backfaceVisibility: 'hidden',
              borderRadius: RADII.card, background: INK.panel, border: `1px solid ${INK.border}`,
              boxShadow: SHADOWS.card, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '36px 30px', boxSizing: 'border-box', textAlign: 'center',
            }}>
              <span style={{
                fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                color: card.deckColor, marginBottom: '18px', fontWeight: '700',
              }}>{card.deckName}</span>
              <p style={{ fontFamily: FONTS.serif, fontSize: '30px', fontWeight: '600', color: INK.ink, margin: 0, lineHeight: 1.3 }}>
                {card.term}
              </p>
            </div>
            {/* back: definition */}
            <div style={{
              gridArea: '1 / 1', minHeight: '320px', width: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              borderRadius: RADII.card, background: INK.ink, border: `1px solid ${INK.ink}`,
              boxShadow: SHADOWS.card, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', padding: '36px 30px', boxSizing: 'border-box', textAlign: 'center',
            }}>
              <span style={{
                fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
                color: card.deckColor, marginBottom: '18px', fontWeight: '700',
              }}>Definition</span>
              <p style={{ fontFamily: FONTS.sans, fontSize: '18px', fontWeight: '400', color: INK.panel, margin: 0, lineHeight: 1.55 }}>
                {card.definition}
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: FONTS.sans, textAlign: 'center', color: INK.inkFaint, fontSize: '12px', margin: '18px 0 0' }}>
          Tap to flip · drag left or right to grade
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        <button onClick={() => commit(false)} className="fc-tap" style={{
          flex: 1, fontFamily: FONTS.sans, padding: '15px', borderRadius: RADII.pill, border: `1.5px solid ${INK.danger}66`,
          background: `${INK.danger}14`, color: INK.danger, fontSize: '14px', fontWeight: '700', cursor: 'pointer',
        }}>✗ Don't know</button>
        <button onClick={() => commit(true)} className="fc-tap" style={{
          flex: 1, fontFamily: FONTS.sans, padding: '15px', borderRadius: RADII.pill, border: 'none',
          background: INK.success, color: INK.panel, fontSize: '14px', fontWeight: '700', cursor: 'pointer',
        }}>✓ Know it</button>
      </div>
    </div>
  );
}
