import { CATEGORY_LIST, CATEGORY_EMOJI, getCat } from '../../constants/categories';
import { INK, FONTS, RADII } from '../../constants/theme';
import TopMissesPanel from './TopMissesPanel';

export default function StatsView({ isDesktop, isLarge, isXLarge, accent, cards, masteredIds, streak, overallMastery, onStartReview }) {
  return (
    <div style={{ maxWidth: isXLarge ? '960px' : isLarge ? '760px' : isDesktop ? '640px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '18px' }}>
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px 12px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '30px', fontWeight: '600', color: INK.cream, margin: 0 }}>{cards.length}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, margin: '5px 0 0' }}>Total</p>
        </div>
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px 12px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '30px', fontWeight: '600', color: accent, margin: 0 }}>{masteredIds.length}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, margin: '5px 0 0' }}>Mastered</p>
        </div>
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px 12px', textAlign: 'center' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '30px', fontWeight: '600', color: INK.streakAmber, margin: 0 }}>🔥 {streak.count}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, margin: '5px 0 0' }}>Streak</p>
        </div>
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: INK.mutedGoldGrey }}>Overall mastery</span>
          <span style={{ fontFamily: FONTS.serif, fontSize: '20px', fontWeight: '600', color: accent }}>{overallMastery}%</span>
        </div>
        <div style={{ height: '8px', background: INK.hairline, borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ width: `${overallMastery}%`, height: '100%', background: `linear-gradient(90deg,${accent},${INK.goldHover})`, borderRadius: '999px', transition: 'width 0.4s' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap: '10px' }}>
        {CATEGORY_LIST.filter(cat => cards.some(c => c.category === cat)).map(cat => {
          const cc = getCat(cat);
          const catCards = cards.filter(c => c.category === cat);
          const catMastered = catCards.filter(c => masteredIds.includes(c.id)).length;
          const m = catCards.length ? Math.round((catMastered / catCards.length) * 100) : 0;
          return (
            <div key={cat} style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.nav, padding: '15px 17px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontFamily: FONTS.sans, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600', color: cc.accent }}>
                  {CATEGORY_EMOJI[cat] || '✦'} {cat}
                </span>
                <span style={{ fontFamily: FONTS.sans, fontSize: '11px', color: INK.dim }}>{catMastered}/{catCards.length}</span>
              </div>
              <div style={{ height: '6px', background: INK.hairline, borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${m}%`, height: '100%', background: cc.accent, borderRadius: '999px' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px', marginTop: '18px' }}>
        <TopMissesPanel cards={cards} accent={accent} onStartReview={onStartReview} />
      </div>
    </div>
  );
}
