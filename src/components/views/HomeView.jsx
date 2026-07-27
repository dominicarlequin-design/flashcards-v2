import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

export default function HomeView({ isDesktop, isXLarge, accent, cardsCount, masteredCount, streakCount, onStartStudying }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 0 8px' }}>
      <div style={{
        width: '110px', height: '110px', margin: '0 auto 26px', borderRadius: RADII.circle,
        border: `1.5px solid ${accent}44`, background: INK.panel, display: 'flex',
        alignItems: 'center', justifyContent: 'center', boxShadow: SHADOWS.heroSeal(accent),
      }}>
        <span style={{ fontFamily: FONTS.serif, fontSize: '46px', color: accent }}>⚖︎</span>
      </div>

      <h2 style={{
        fontFamily: FONTS.serif, fontSize: isXLarge ? '38px' : isDesktop ? '32px' : '28px', fontWeight: '600',
        color: INK.cream, margin: '0 0 12px', letterSpacing: '-0.4px',
      }}>Welcome back</h2>

      <p style={{
        fontSize: '15px', lineHeight: 1.6, color: '#a99a72', margin: '0 auto 30px', maxWidth: '360px',
      }}>
        Pick up where you left off. You've mastered {masteredCount} of {cardsCount} cards.
      </p>

      <button onClick={onStartStudying} className="fc-tap" style={{
        fontFamily: FONTS.sans, padding: isDesktop ? '16px 40px' : '15px 40px', borderRadius: RADII.btn,
        border: 'none', background: accent, color: '#14120b', fontSize: '14px', fontWeight: '700',
        letterSpacing: '.5px', boxShadow: SHADOWS.goldButton(accent),
      }}>Begin studying →</button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginTop: '38px' }}>
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '18px 12px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '28px', fontWeight: '600', color: INK.cream, margin: 0 }}>{cardsCount}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, margin: '4px 0 0' }}>Cards</p>
        </div>
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '18px 12px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '28px', fontWeight: '600', color: accent, margin: 0 }}>{masteredCount}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, margin: '4px 0 0' }}>Mastered</p>
        </div>
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '18px 12px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '28px', fontWeight: '600', color: INK.streakAmber, margin: 0 }}>{streakCount}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, margin: '4px 0 0' }}>Streak</p>
        </div>
      </div>
    </div>
  );
}
