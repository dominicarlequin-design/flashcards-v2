// TopMissesPanel.jsx
//
// Shows the cards a user misses most often, pulled from Supabase via
// useMistakeLog().fetchMistakeCounts(), and lets them jump into a focused
// review session of just those cards.
//
// NOT WIRED IN YET — needs:
//   1. Supabase table + credentials set up (see hooks/useMistakeLog.js)
//   2. logAttempt(cardId, result) called at App.jsx line 209 so real data exists
//   3. This component rendered somewhere, e.g. as a new VIEWS.REVIEW,
//      or as a section inside StatsView.jsx
//
// Usage once wired in:
//   <TopMissesPanel cards={cards} onStartReview={(missedCards) => { ... }} />

import { useEffect, useState } from 'react';
import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';
import { useMistakeLog } from '../../hooks/useMistakeLog';

const TOP_N = 5;

export default function TopMissesPanel({ cards, accent = INK.gold, onStartReview }) {
  const { fetchMistakeCounts, pending, error } = useMistakeLog();
  const [topMisses, setTopMisses] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMistakeCounts().then(counts => {
      if (cancelled) return;
      const ranked = Object.entries(counts)
        .sort((a, b) => b[1] - a[1]) // most misses first
        .slice(0, TOP_N)
        .map(([cardId, missCount]) => {
          const card = cards.find(c => String(c.id) === String(cardId));
          return card ? { ...card, missCount } : null;
        })
        .filter(Boolean);
      setTopMisses(ranked);
      setLoaded(true);
    });
    return () => { cancelled = true; };
  }, [cards, fetchMistakeCounts]);

  if (!loaded && pending) {
    return (
      <p style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.dim, textAlign: 'center', padding: '20px 0' }}>
        Loading your mistake history…
      </p>
    );
  }

  if (error) {
    return (
      <p style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.reviewText, textAlign: 'center', padding: '20px 0' }}>
        Couldn't load review data. Try again shortly.
      </p>
    );
  }

  if (loaded && topMisses.length === 0) {
    return (
      <p style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.dim, textAlign: 'center', padding: '20px 0' }}>
        No missed cards yet — keep studying and this fills in automatically.
      </p>
    );
  }

  return (
    <div>
      <h3 style={{
        fontFamily: FONTS.serif, fontSize: '20px', fontWeight: '600', color: INK.cream, margin: '0 0 6px',
      }}>Your top misses</h3>
      <p style={{ fontFamily: FONTS.sans, fontSize: '12px', color: INK.dim, margin: '0 0 18px' }}>
        Built automatically from cards you've gotten wrong most often.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {topMisses.map(card => (
          <div key={card.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel,
            padding: '14px 16px',
          }}>
            <span style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.cream, flex: 1, marginRight: '12px' }}>
              {card.question}
            </span>
            <span style={{
              fontFamily: FONTS.sans, fontSize: '11px', fontWeight: '700', color: INK.reviewText,
              background: INK.reviewBg, border: `1px solid ${INK.reviewBorder}`, borderRadius: RADII.pill,
              padding: '3px 9px', whiteSpace: 'nowrap',
            }}>
              missed {card.missCount}×
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onStartReview(topMisses)}
        className="fc-tap"
        style={{
          fontFamily: FONTS.sans, marginTop: '20px', width: '100%', padding: '15px', borderRadius: RADII.btn,
          border: 'none', background: accent, color: '#14120b', fontSize: '14px', fontWeight: '700',
          letterSpacing: '.5px', boxShadow: SHADOWS.goldButton(accent),
        }}
      >
        Review these {topMisses.length} cards →
      </button>
    </div>
  );
}
