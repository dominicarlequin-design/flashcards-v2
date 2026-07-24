import { CATEGORY_LIST, CATEGORY_EMOJI, getCat } from '../../constants/categories';

export default function StatsView({ isDesktop, isLarge, isXLarge, cards, masteredIds, streak, overallMastery }) {
  return (
    <div style={{ maxWidth: isXLarge ? '960px' : isLarge ? '760px' : isDesktop ? '640px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      <div style={{
        display:'grid', gridTemplateColumns: isDesktop ? 'repeat(3,1fr)' : 'repeat(2,1fr)', gap:'12px', marginBottom:'20px',
      }}>
        <div style={{ background:'#111827', borderRadius:'14px', padding:'18px', textAlign:'center' }}>
          <p style={{ margin:0, fontSize:'26px', fontWeight:'700', color:'#e2e8f0' }}>{cards.length}</p>
          <p style={{ margin:0, fontSize:'12px', color:'#64748b' }}>Total Cards</p>
        </div>
        <div style={{ background:'#111827', borderRadius:'14px', padding:'18px', textAlign:'center' }}>
          <p style={{ margin:0, fontSize:'26px', fontWeight:'700', color:'#4ade80' }}>{masteredIds.length}</p>
          <p style={{ margin:0, fontSize:'12px', color:'#64748b' }}>Mastered</p>
        </div>
        <div style={{ background:'#111827', borderRadius:'14px', padding:'18px', textAlign:'center', gridColumn: isDesktop ? 'auto' : 'span 2' }}>
          <p style={{ margin:0, fontSize:'26px', fontWeight:'700', color:'#fbbf24' }}>🔥 {streak.count}</p>
          <p style={{ margin:0, fontSize:'12px', color:'#64748b' }}>Day Streak</p>
        </div>
      </div>

      <div style={{ background:'#111827', borderRadius:'14px', padding:'18px', marginBottom:'20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
          <span style={{ fontSize:'13px', color:'#94a3b8', fontWeight:'600' }}>Overall Mastery</span>
          <span style={{ fontSize:'13px', color:'#4ade80', fontWeight:'700' }}>{overallMastery}%</span>
        </div>
        <div style={{ height:'8px', background:'#1e2538', borderRadius:'999px', overflow:'hidden' }}>
          <div style={{ width:`${overallMastery}%`, height:'100%', background:'#4ade80', borderRadius:'999px', transition:'width 0.3s' }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap:'10px' }}>
        {CATEGORY_LIST.filter(cat => cards.some(c => c.category === cat)).map(cat => {
          const cc = getCat(cat);
          const catCards = cards.filter(c => c.category === cat);
          const catMastered = catCards.filter(c => masteredIds.includes(c.id)).length;
          const m = catCards.length ? Math.round((catMastered / catCards.length) * 100) : 0;
          return (
            <div key={cat} style={{ background:'#111827', borderRadius:'12px', padding:'14px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px' }}>
                <span style={{ fontSize:'13px', color:cc.accent, fontWeight:'600' }}>{CATEGORY_EMOJI[cat]} {cat}</span>
                <span style={{ fontSize:'12px', color:'#64748b' }}>{catMastered}/{catCards.length}</span>
              </div>
              <div style={{ height:'6px', background:'#1e2538', borderRadius:'999px', overflow:'hidden' }}>
                <div style={{ width:`${m}%`, height:'100%', background:cc.accent, borderRadius:'999px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
