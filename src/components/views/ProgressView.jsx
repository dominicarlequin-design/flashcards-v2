import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';
import TopMissesPanel from './TopMissesPanel';

const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function ProgressView({ isDesktop, streakCount, totalReviewed, last7Days, decks, mistakeLogCards, onStartMissesReview }) {
  return (
    <div className="scrolly" style={{ overflowY: 'auto', height: '100%' }}>
      <h1 style={{ fontFamily: FONTS.serif, fontSize: isDesktop ? '32px' : '26px', fontWeight: '600', color: INK.ink, margin: '0 0 22px' }}>Progress</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ flex: 1, background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🔥</span>
          <div>
            <p style={{ fontFamily: FONTS.serif, fontSize: '22px', fontWeight: '600', color: INK.ink, margin: 0 }}>{streakCount}</p>
            <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '.5px', textTransform: 'uppercase', color: INK.inkMuted, margin: 0 }}>Day streak</p>
          </div>
        </div>
        <div style={{ flex: 1, background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '18px 16px' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '22px', fontWeight: '600', color: INK.accent, margin: 0 }}>{totalReviewed}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '.5px', textTransform: 'uppercase', color: INK.inkMuted, margin: 0 }}>Cards reviewed</p>
        </div>
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '20px', marginBottom: '24px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: INK.inkMuted, margin: '0 0 16px' }}>Last 7 days</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {last7Days.map((day, i) => (
            <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: RADII.circle,
                background: day.count > 0 ? INK.accent : 'transparent',
                border: `1.5px solid ${day.count > 0 ? INK.accent : INK.border}`,
              }} />
              <span style={{ fontFamily: FONTS.sans, fontSize: '11px', color: INK.inkFaint }}>{DAY_LETTERS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: FONTS.serif, fontSize: '18px', fontWeight: '600', color: INK.ink, margin: '0 0 12px' }}>Mastery by deck</p>
      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: '10px' }}>
        {decks.map(deck => (
          <div key={deck.id} style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.sm, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: FONTS.sans, fontSize: '13px', fontWeight: '600', color: INK.ink }}>
                <span style={{ width: '9px', height: '9px', borderRadius: RADII.circle, background: deck.color, display: 'inline-block' }} />
                {deck.name}
              </span>
              <span style={{ fontFamily: FONTS.sans, fontSize: '12px', color: INK.inkMuted }}>{deck.masteryPct}%</span>
            </div>
            <div style={{ height: '6px', background: INK.border, borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ width: `${deck.masteryPct}%`, height: '100%', background: deck.color, borderRadius: '999px' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '20px', marginTop: '20px' }}>
        <TopMissesPanel cards={mistakeLogCards} accent={INK.accent} onStartReview={onStartMissesReview} />
      </div>
    </div>
  );
}
