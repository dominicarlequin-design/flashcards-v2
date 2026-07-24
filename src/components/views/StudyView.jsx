import { ALL_CATEGORY, CATEGORY_EMOJI, getCat } from '../../constants/categories';

export default function StudyView({
  isDesktop, isLarge, isXLarge,
  cameFromMap, backToMap,
  categories, activeCategory, setActiveCategory, setCameFromMap,
  getMastery,
  sessionCards, known, dontKnow, pct, total, resetSession,
  index, filtered, results, currentCard, colors,
  flipCard, flipped,
  answerTab, setAnswerTab,
  markCard, prevCard, nextCard,
}) {
  return (
    <div style={{ maxWidth: isXLarge ? '740px' : isLarge ? '640px' : isDesktop ? '560px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      {cameFromMap && (
        <button onClick={backToMap} style={{
          marginBottom:'14px', padding:'8px 14px', background:'#111827', border:'1px solid #1e2538',
          borderRadius:'10px', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
        }}>← Back to Map</button>
      )}

      {/* Category pills */}
      <div style={{ display:'flex', gap:'8px', overflowX: isDesktop ? 'visible' : 'auto', flexWrap: isDesktop ? 'wrap' : 'nowrap', paddingBottom:'12px', marginBottom:'16px', scrollbarWidth:'none' }}>
        {categories.map(cat => {
          const isActive = cat === activeCategory;
          const cc = getCat(cat);
          const m = getMastery(cat);
          return (
            <button key={cat} onClick={() => { setActiveCategory(cat); setCameFromMap(false); }} style={{
              flexShrink:0, padding:'6px 14px', borderRadius:'999px', cursor:'pointer',
              border: isActive ? `1.5px solid ${cc.accent}` : '1.5px solid #1e2538',
              background: isActive ? cc.pill : 'transparent',
              color: isActive ? cc.accent : '#64748b',
              fontSize:'13px', fontWeight: isActive ? '600' : '400', whiteSpace:'nowrap',
            }}>
              {cat === ALL_CATEGORY ? `✦ All` : `${CATEGORY_EMOJI[cat]||'✨'} ${cat}`}
              {cat !== ALL_CATEGORY && m > 0 && <span style={{ marginLeft:'6px', opacity:0.6, fontSize:'11px' }}>{m}%</span>}
            </button>
          );
        })}
      </div>

      {/* Session mini-bar */}
      {sessionCards.length > 0 && (
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px', padding:'10px 14px', background:'#111827', borderRadius:'10px' }}>
          <span style={{ fontSize:'13px', color:'#4ade80', fontWeight:'600' }}>✓ {known}</span>
          <span style={{ fontSize:'13px', color:'#f87171', fontWeight:'600' }}>✗ {dontKnow}</span>
          <div style={{ flex:1, height:'4px', background:'#1e2538', borderRadius:'999px', overflow:'hidden' }}>
            <div style={{ width:`${pct}%`, height:'100%', background:'#4ade80', borderRadius:'999px', transition:'width 0.3s' }} />
          </div>
          <span style={{ fontSize:'12px', color:'#475569' }}>{sessionCards.length}/{total}</span>
          <button onClick={resetSession} style={{ fontSize:'11px', color:'#475569', background:'none', border:'none', cursor:'pointer', padding:0 }}>Reset</button>
        </div>
      )}

      {/* Counter */}
      <p style={{ textAlign:'center', color:'#475569', fontSize:'13px', marginBottom:'12px' }}>
        Card {index + 1} of {filtered.length}
        {results[currentCard?.id] && (
          <span style={{ marginLeft:'8px', color: results[currentCard.id]==='know' ? '#4ade80' : '#f87171' }}>
            {results[currentCard.id]==='know' ? '✓ Known' : '✗ Review'}
          </span>
        )}
      </p>

      {/* Card */}
      <div onClick={flipCard} style={{ perspective:'1000px', height: (currentCard?.explain ? (isXLarge ? 460 : isLarge ? 400 : isDesktop ? 340 : 300) : (isXLarge ? 420 : isLarge ? 360 : isDesktop ? 300 : 220)) + 'px', cursor:'pointer', marginBottom:'14px' }}>
        <div style={{
          width:'100%', height:'100%', position:'relative', transformStyle:'preserve-3d',
          transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          <div style={{
            position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
            borderRadius:'16px', background:`linear-gradient(145deg,${colors.bg},#0a0a0f)`,
            border:`1px solid ${colors.accent}22`, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent:'center', padding: isXLarge ? '48px' : isDesktop ? '36px' : '24px', boxSizing:'border-box',
            boxShadow:`0 0 40px ${colors.accent}15`,
          }}>
            <span style={{ fontSize:'11px', fontWeight:'600', letterSpacing:'1.5px', color:colors.accent, opacity:0.7, marginBottom:'14px', textTransform:'uppercase' }}>
              {CATEGORY_EMOJI[currentCard?.category]||'✨'} {currentCard?.category}
            </span>
            <p style={{ fontSize: isXLarge ? '27px' : isDesktop ? '22px' : '19px', fontWeight:'500', textAlign:'center', margin:0, lineHeight:1.5, color:'#f1f5f9' }}>
              {currentCard?.question}
            </p>
          </div>
          <div style={{
            position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
            borderRadius:'16px', background:`linear-gradient(145deg,${colors.bg},#0a0a0f)`,
            border:`1.5px solid ${colors.accent}55`, display:'flex', flexDirection:'column',
            alignItems:'center', justifyContent: currentCard?.explain ? 'flex-start' : 'center', padding: isXLarge ? '48px' : isDesktop ? '36px' : '24px', boxSizing:'border-box',
            transform:'rotateY(180deg)', boxShadow:`0 0 50px ${colors.accent}25`,
          }}>
            {currentCard?.explain && (
              <div onClick={e => e.stopPropagation()} style={{ display:'flex', gap:'6px', marginBottom:'16px', background:'#00000033', borderRadius:'999px', padding:'4px' }}>
                <button onClick={() => setAnswerTab('answer')} style={{
                  padding:'6px 16px', borderRadius:'999px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700',
                  background: answerTab === 'answer' ? colors.accent : 'transparent',
                  color: answerTab === 'answer' ? '#0a0a0f' : colors.accent,
                }}>Answer</button>
                <button onClick={() => setAnswerTab('explain')} style={{
                  padding:'6px 16px', borderRadius:'999px', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700',
                  background: answerTab === 'explain' ? colors.accent : 'transparent',
                  color: answerTab === 'explain' ? '#0a0a0f' : colors.accent,
                }}>Explain like I'm 5</button>
              </div>
            )}
            {!currentCard?.explain && (
              <span style={{ fontSize:'11px', fontWeight:'600', letterSpacing:'1.5px', color:colors.accent, opacity:0.7, marginBottom:'14px', textTransform:'uppercase' }}>Answer</span>
            )}
            <div style={{ flex:1, minHeight:0, overflowY:'auto', display:'flex', alignItems:'center', width:'100%' }}>
              {answerTab === 'answer' || !currentCard?.explain ? (
                <p style={{ fontSize: isXLarge ? '30px' : isDesktop ? '24px' : '21px', fontWeight:'600', textAlign:'center', margin:0, lineHeight:1.4, color:colors.accent, width:'100%' }}>
                  {currentCard?.answer}
                </p>
              ) : (
                <p style={{ fontSize: isXLarge ? '19px' : isDesktop ? '17px' : '15px', fontWeight:'500', textAlign:'center', margin:0, lineHeight:1.6, color:'#f1f5f9', width:'100%' }}>
                  {currentCard?.explain}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p style={{ textAlign:'center', color:'#1e2538', fontSize:'12px', marginBottom:'16px' }}>Tap to flip · Arrow keys to navigate</p>

      {flipped && (
        <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
          <button onClick={() => markCard(currentCard.id, 'dontknow')} style={{
            flex:1, padding:'14px', borderRadius:'12px', border:'1.5px solid #f8717155',
            background:'#f871711a', color:'#f87171', fontSize:'14px', fontWeight:'600', cursor:'pointer',
          }}>✗ Don't Know</button>
          <button onClick={() => markCard(currentCard.id, 'know')} style={{
            flex:1, padding:'14px', borderRadius:'12px', border:'1.5px solid #4ade8055',
            background:'#4ade801a', color:'#4ade80', fontSize:'14px', fontWeight:'600', cursor:'pointer',
          }}>✓ Know It</button>
        </div>
      )}

      <div style={{ display:'flex', gap:'10px' }}>
        <button onClick={prevCard} style={{
          flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #1e2538',
          background:'transparent', color:'#64748b', fontSize:'13px', cursor:'pointer',
        }}>← Prev</button>
        <button onClick={nextCard} style={{
          flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #1e2538',
          background:'transparent', color:'#64748b', fontSize:'13px', cursor:'pointer',
        }}>Next →</button>
      </div>
    </div>
  );
}
