import { useState } from 'react';
import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const SORTS = ['Default', 'Most due', 'A–Z', 'Needs review'];

function sortDecks(decks, sort) {
  const arr = [...decks];
  if (sort === 'Most due') return arr.sort((a, b) => b.dueCount - a.dueCount);
  if (sort === 'A–Z') return arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'Needs review') return arr.sort((a, b) => a.masteryPct - b.masteryPct);
  return arr;
}

export default function HomeView({ isDesktop, streakCount, dueTodayCount, decks, onStartReview, onSelectDeck }) {
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState('Default');
  const sorted = sortDecks(decks, sort);

  return (
    <div className="scrolly" style={{ overflowY: 'auto', height: '100%' }}>
      {/* Greeting + streak */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
        <h1 style={{
          fontFamily: FONTS.serif, fontSize: isDesktop ? '32px' : '26px', fontWeight: '600',
          color: INK.ink, margin: 0, letterSpacing: '-0.3px',
        }}>{getGreeting()}</h1>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', background: INK.panel,
          border: `1px solid ${INK.border}`, borderRadius: '999px', padding: '7px 14px',
          boxShadow: SHADOWS.panel, flexShrink: 0,
        }}>
          <span style={{ fontSize: '15px' }}>🔥</span>
          <span style={{ fontFamily: FONTS.sans, fontSize: '14px', fontWeight: '700', color: INK.ink }}>{streakCount}</span>
        </div>
      </div>

      {/* Due today banner */}
      <div style={{
        background: INK.ink, borderRadius: RADII.panel, padding: isDesktop ? '28px 32px' : '22px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
        boxShadow: SHADOWS.card, marginBottom: '28px', flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#B8AF98', margin: '0 0 6px' }}>Due today</p>
          <p style={{ fontFamily: FONTS.serif, fontSize: isDesktop ? '44px' : '36px', fontWeight: '600', color: INK.panel, margin: 0 }}>{dueTodayCount} <span style={{ fontSize: isDesktop ? '18px' : '15px', fontWeight: '400', color: '#B8AF98' }}>card{dueTodayCount === 1 ? '' : 's'}</span></p>
        </div>
        <button onClick={onStartReview} disabled={dueTodayCount === 0} className="fc-tap" style={{
          fontFamily: FONTS.sans, padding: '14px 26px', borderRadius: RADII.pill, border: 'none',
          background: dueTodayCount === 0 ? '#5B5648' : INK.accent, color: INK.panel,
          fontSize: '14px', fontWeight: '700', cursor: dueTodayCount === 0 ? 'default' : 'pointer',
          whiteSpace: 'nowrap',
        }}>Start review →</button>
      </div>

      {/* Your decks */}
      <div style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: isDesktop ? '10px 20px' : '8px 16px', marginBottom: '24px' }}>
        <button onClick={() => setExpanded(e => !e)} className="fc-tap" style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer',
        }}>
          <span style={{ fontFamily: FONTS.serif, fontSize: '19px', fontWeight: '600', color: INK.ink }}>
            Your decks <span style={{ fontFamily: FONTS.sans, fontSize: '13px', fontWeight: '400', color: INK.inkMuted }}>({decks.length})</span>
          </span>
          <span style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.inkMuted, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>⌄</span>
        </button>

        {!expanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '14px' }}>
            <div style={{ display: 'flex' }}>
              {decks.slice(0, 5).map((d, i) => (
                <span key={d.id} style={{
                  width: '22px', height: '22px', borderRadius: RADII.circle, background: d.color,
                  border: `2px solid ${INK.panel}`, marginLeft: i === 0 ? 0 : '-8px', display: 'inline-block',
                }} />
              ))}
            </div>
            <span style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.inkMuted, flex: 1 }}>
              {decks.length} decks · {dueTodayCount} due
            </span>
            <button onClick={() => setExpanded(true)} className="fc-tap" style={{ fontFamily: FONTS.sans, fontSize: '13px', fontWeight: '600', color: INK.accent, background: 'none', border: 'none', cursor: 'pointer' }}>View</button>
          </div>
        )}

        {expanded && (
          <div style={{ paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{
                fontFamily: FONTS.sans, fontSize: '13px', color: INK.ink, background: INK.bg,
                border: `1px solid ${INK.border}`, borderRadius: RADII.sm, padding: '7px 10px', cursor: 'pointer',
              }}>
                {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : '1fr', gap: '12px' }}>
              {sorted.map(deck => (
                <button key={deck.id} onClick={() => onSelectDeck(deck.id)} className="fc-tap fc-lift" style={{
                  textAlign: 'left', background: INK.bg, border: `1.5px solid ${INK.border}`, borderRadius: RADII.sm,
                  padding: '14px 16px', cursor: 'pointer', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = deck.color; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = INK.border; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: RADII.circle, background: deck.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: FONTS.serif, fontSize: '15px', fontWeight: '600', color: INK.ink, flex: 1 }}>{deck.name}</span>
                    {deck.dueCount > 0 && (
                      <span style={{ fontFamily: FONTS.sans, fontSize: '11px', fontWeight: '700', color: INK.panel, background: deck.color, borderRadius: '999px', padding: '2px 8px' }}>{deck.dueCount}</span>
                    )}
                  </div>
                  <div style={{ height: '5px', background: INK.border, borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
                    <div style={{ width: `${deck.masteryPct}%`, height: '100%', background: deck.color, borderRadius: '999px' }} />
                  </div>
                  <span style={{ fontFamily: FONTS.sans, fontSize: '11px', color: INK.inkMuted }}>{deck.masteryPct}% mastered</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
