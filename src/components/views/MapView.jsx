import { LEVEL_ORDER, CATEGORY_EMOJI, getCat } from '../../constants/categories';

export default function MapView({ isDesktop, isLarge, isXLarge, isLevelUnlocked, isLevelComplete, enterLevel }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop: isXLarge ? '48px' : isDesktop ? '24px' : '10px' }}>
      {LEVEL_ORDER.map((cat, i) => {
        const unlocked = isLevelUnlocked(i);
        const complete = isLevelComplete(cat);
        const cc = getCat(cat);
        const size = isXLarge ? '150px' : isLarge ? '120px' : isDesktop ? '100px' : '84px';
        const offsetAmt = isXLarge ? 260 : isLarge ? 160 : isDesktop ? 56 : 40;
        const offset = i % 2 === 0 ? `-${offsetAmt}px` : `${offsetAmt}px`;
        return (
          <div key={cat} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <button
              onClick={() => unlocked && enterLevel(cat)}
              disabled={!unlocked}
              style={{
                marginLeft: offset,
                width:size, height:size, borderRadius:'50%',
                border: unlocked ? `2.5px solid ${cc.accent}` : '2.5px solid #1e2538',
                background: complete ? cc.accent : unlocked ? cc.pill : '#111827',
                color: complete ? '#000' : unlocked ? cc.accent : '#334155',
                fontSize: isDesktop ? '32px' : '28px', cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: unlocked && !complete ? `0 0 24px ${cc.accent}55` : 'none',
                display:'flex', alignItems:'center', justifyContent:'center',
                position:'relative',
              }}
            >
              {complete ? '✓' : unlocked ? (CATEGORY_EMOJI[cat] || '✨') : '🔒'}
            </button>
            <p style={{
              marginLeft: offset, marginTop:'8px', marginBottom:'0',
              fontSize: isDesktop ? '14px' : '13px', fontWeight:'600',
              color: unlocked ? cc.accent : '#334155',
            }}>{cat}</p>
            {i < LEVEL_ORDER.length - 1 && (
              <div style={{ width:'3px', height: isDesktop ? '44px' : '36px', background: unlocked ? '#1e2538' : '#111827', margin:'8px 0' }} />
            )}
          </div>
        );
      })}
      <p style={{ color:'#475569', fontSize:'12px', marginTop:'20px', textAlign:'center' }}>
        Master every card in a level to unlock the next
      </p>
    </div>
  );
}
