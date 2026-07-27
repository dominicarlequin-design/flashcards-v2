import { LEVEL_ORDER, getCat } from '../../constants/categories';
import { INK, FONTS, RADII, SHADOWS, NUMERALS } from '../../constants/theme';

export default function MapView({ isDesktop, isLarge, isXLarge, cards, masteredIds, isLevelUnlocked, isLevelComplete, enterLevel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: isXLarge ? '48px' : isDesktop ? '24px' : '10px' }}>
      <p style={{
        fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase',
        color: INK.dim, margin: '0 0 30px',
      }}>Your path through the law</p>

      {LEVEL_ORDER.map((cat, i) => {
        const unlocked = isLevelUnlocked(i);
        const complete = isLevelComplete(cat);
        const cc = getCat(cat);
        const size = isXLarge ? '150px' : isLarge ? '120px' : isDesktop ? '100px' : '96px';
        const offsetAmt = isXLarge ? 260 : isLarge ? 160 : isDesktop ? 56 : 70;
        const offset = i % 2 === 0 ? `-${offsetAmt}px` : `${offsetAmt}px`;
        const catCards = cards.filter(c => c.category === cat);
        const done = catCards.filter(c => masteredIds.includes(c.id)).length;

        const glyph = complete ? '✓' : unlocked ? (NUMERALS[i] || i + 1) : '🔒';
        const sub = complete ? 'Mastered' : unlocked ? `${done}/${catCards.length} cards` : 'Locked';

        return (
          <div key={cat} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button
              onClick={() => unlocked && enterLevel(cat)}
              disabled={!unlocked}
              className="fc-tap"
              style={{
                marginLeft: offset,
                width: size, height: size, borderRadius: RADII.circle,
                border: unlocked ? `2px solid ${cc.accent}` : `2px solid ${INK.hairline}`,
                background: complete ? cc.accent : unlocked ? `${cc.accent}1f` : INK.panel,
                color: complete ? '#14120b' : unlocked ? cc.accent : INK.faint,
                fontFamily: FONTS.serif, fontSize: isDesktop ? '30px' : '28px',
                cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: unlocked && !complete ? SHADOWS.mapSealGlow(cc.accent) : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {glyph}
            </button>
            <p style={{
              marginLeft: offset, marginTop: '10px', marginBottom: '0',
              fontFamily: FONTS.sans, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: '600',
              color: unlocked ? cc.accent : INK.faint,
            }}>{cat}</p>
            <p style={{
              marginLeft: offset, fontFamily: FONTS.sans, fontSize: '10px', color: INK.dim, margin: '2px 0 0',
            }}>{sub}</p>
            {i < LEVEL_ORDER.length - 1 && (
              <div style={{
                width: '2px', height: isDesktop ? '44px' : '36px', margin: '14px 0',
                background: unlocked ? INK.hairlineStrong : INK.divider,
              }} />
            )}
          </div>
        );
      })}

      <p style={{
        fontFamily: FONTS.serif, fontStyle: 'italic', color: INK.dim, fontSize: '14px',
        marginTop: '20px', textAlign: 'center',
      }}>Master every card in a level to unlock the next.</p>
    </div>
  );
}
