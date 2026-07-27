import { ALL_CATEGORY, CATEGORY_EMOJI, getCat } from '../../constants/categories';
import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

// Scales a base font size down for longer text so it's more likely to fit without clipping.
function scaledFontSize(text, base) {
  const len = text?.length || 0;
  if (len > 220) return base - 6;
  if (len > 140) return base - 3;
  if (len > 80) return base - 1;
  return base;
}

export default function StudyView({
  isDesktop, isLarge, isXLarge, accent,
  cameFromMap, backToMap,
  categories, activeCategory, setActiveCategory, setCameFromMap,
  getMastery,
  sessionCards, known, dontKnow, pct, total, resetSession,
  index, filtered, results, currentCard, colors,
  flipCard, flipped, reduceMotion, questionSerif,
  answerTab, setAnswerTab,
  markCard, prevCard, nextCard,
}) {
  const cardAccent = colors.accent;
  const cardLine = colors.line || INK.hairlineStrong;

  return (
    <div style={{ maxWidth: isXLarge ? '740px' : isLarge ? '640px' : isDesktop ? '560px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      {cameFromMap && (
        <button onClick={backToMap} className="fc-tap" style={{
          marginBottom: '14px', padding: '8px 14px', background: INK.panel, border: `1px solid ${INK.hairline}`,
          borderRadius: RADII.nav, color: INK.mutedGoldGrey, fontSize: '13px', fontFamily: FONTS.sans,
        }}>← Back to Map</button>
      )}

      {/* Category pills */}
      <div className="scrollx" style={{ display: 'flex', gap: '8px', overflowX: isDesktop ? 'visible' : 'auto', flexWrap: isDesktop ? 'wrap' : 'nowrap', paddingBottom: '2px', marginBottom: '18px' }}>
        {categories.map(cat => {
          const isActive = cat === activeCategory;
          const cc = cat === ALL_CATEGORY ? { accent } : getCat(cat);
          const m = getMastery(cat);
          return (
            <button key={cat} onClick={() => { setActiveCategory(cat); setCameFromMap(false); }} className="fc-tap" style={{
              flexShrink: 0, fontFamily: FONTS.sans, padding: '7px 15px', borderRadius: RADII.pill, cursor: 'pointer',
              fontSize: '11px', fontWeight: isActive ? '700' : '400', letterSpacing: '.8px', textTransform: 'uppercase',
              border: `1px solid ${isActive ? cc.accent : INK.hairline}`,
              background: isActive ? `${cc.accent}22` : 'transparent',
              color: isActive ? cc.accent : INK.dim, whiteSpace: 'nowrap',
            }}>
              {cat === ALL_CATEGORY ? 'All' : (m > 0 ? `${cat} · ${m}%` : cat)}
            </button>
          );
        })}
      </div>

      {/* Session mini-bar */}
      {sessionCards.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '11px 15px', background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.nav }}>
          <span style={{ fontFamily: FONTS.sans, fontSize: '12px', color: cardAccent, fontWeight: '700' }}>✓ {known}</span>
          <span style={{ fontFamily: FONTS.sans, fontSize: '12px', color: '#c77b5a', fontWeight: '700' }}>✗ {dontKnow}</span>
          <div style={{ flex: 1, height: '4px', background: INK.hairline, borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: cardAccent, borderRadius: '999px', transition: 'width 0.3s' }} />
          </div>
          <span style={{ fontFamily: FONTS.sans, fontSize: '11px', color: INK.dim }}>{sessionCards.length}/{total}</span>
          <button onClick={resetSession} className="fc-tap" style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.dim, background: 'none', border: 'none', padding: 0 }}>Reset</button>
        </div>
      )}

      {/* Counter */}
      <p style={{ fontFamily: FONTS.sans, textAlign: 'center', color: INK.dim, fontSize: '10px', letterSpacing: '2px', margin: '0 0 14px' }}>
        Card {index + 1} of {filtered.length}
        {results[currentCard?.id] && (
          <span style={{ marginLeft: '8px', color: results[currentCard.id] === 'know' ? cardAccent : INK.reviewText }}>
            {results[currentCard.id] === 'know' ? '✓ Mastered' : '✗ Review'}
          </span>
        )}
      </p>

      {/* Flip card */}
      <div onClick={flipCard} className="fc-tap" style={{ perspective: '1400px', cursor: 'pointer', marginBottom: '14px' }}>
        <div style={{
          width: '100%', display: 'grid', position: 'relative', transformStyle: 'preserve-3d',
          transition: reduceMotion ? 'none' : 'transform .5s cubic-bezier(0.23,1,0.32,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>
          {/* front */}
          <div style={{
            gridArea: '1 / 1',
            minHeight: (isXLarge ? 420 : isLarge ? 360 : isDesktop ? 300 : 288) + 'px',
            width: '100%', backfaceVisibility: 'hidden',
            borderRadius: RADII.card, background: INK.panel, border: `1px solid ${cardLine}`,
            boxShadow: SHADOWS.cardFront,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: isXLarge ? '48px' : isDesktop ? '36px' : '30px 24px', boxSizing: 'border-box', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: '22px', left: '30px', right: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: cardLine }} />
              <span style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: cardAccent }}>
                {CATEGORY_EMOJI[currentCard?.category] || '✦'} {currentCard?.category}
              </span>
              <div style={{ flex: 1, height: '1px', background: cardLine }} />
            </div>
            <p style={{
              fontFamily: questionSerif ? FONTS.serif : FONTS.sans,
              fontSize: scaledFontSize(currentCard?.question, isXLarge ? 28 : isDesktop ? 24 : 22) + 'px',
              fontWeight: '500', lineHeight: 1.42, color: INK.cream, textAlign: 'center', margin: 0,
            }}>
              {currentCard?.question}
            </p>
          </div>

          {/* back */}
          <div style={{
            gridArea: '1 / 1',
            minHeight: (currentCard?.explain ? (isXLarge ? 460 : isLarge ? 400 : isDesktop ? 340 : 320) : (isXLarge ? 420 : isLarge ? 360 : isDesktop ? 300 : 288)) + 'px',
            width: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
            borderRadius: RADII.card, background: `linear-gradient(160deg,#211c10,${INK.panel})`,
            border: `1.5px solid ${cardAccent}66`, boxShadow: SHADOWS.cardBack(cardAccent),
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: currentCard?.explain ? 'flex-start' : 'center',
            padding: isXLarge ? '48px' : isDesktop ? '36px' : '30px 24px', boxSizing: 'border-box', position: 'relative',
          }}>
            {!currentCard?.explain && (
              <div style={{ position: 'absolute', top: '22px', left: '30px', right: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ flex: 1, height: '1px', background: `${cardAccent}44` }} />
                <span style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase', color: cardAccent }}>Answer</span>
                <div style={{ flex: 1, height: '1px', background: `${cardAccent}44` }} />
              </div>
            )}
            {currentCard?.explain && (
              <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: '6px', marginTop: '8px', marginBottom: '16px', background: '#00000033', borderRadius: '999px', padding: '4px' }}>
                <button onClick={() => setAnswerTab('answer')} className="fc-tap" style={{
                  padding: '6px 16px', borderRadius: '999px', border: 'none', fontFamily: FONTS.sans, fontSize: '12px', fontWeight: '700',
                  background: answerTab === 'answer' ? cardAccent : 'transparent',
                  color: answerTab === 'answer' ? '#14120b' : cardAccent,
                }}>Answer</button>
                <button onClick={() => setAnswerTab('explain')} className="fc-tap" style={{
                  padding: '6px 16px', borderRadius: '999px', border: 'none', fontFamily: FONTS.sans, fontSize: '12px', fontWeight: '700',
                  background: answerTab === 'explain' ? cardAccent : 'transparent',
                  color: answerTab === 'explain' ? '#14120b' : cardAccent,
                }}>Explain like I'm 5</button>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              {answerTab === 'answer' || !currentCard?.explain ? (
                <p style={{
                  fontFamily: FONTS.serif, fontSize: scaledFontSize(currentCard?.answer, isXLarge ? 26 : isDesktop ? 22 : 22) + 'px',
                  fontWeight: '600', lineHeight: 1.4, color: cardAccent, textAlign: 'center', margin: 0, width: '100%',
                }}>
                  {currentCard?.answer}
                </p>
              ) : (
                <p style={{
                  fontSize: scaledFontSize(currentCard?.explain, isXLarge ? 19 : isDesktop ? 17 : 15) + 'px',
                  fontWeight: '500', lineHeight: 1.6, color: INK.cream, textAlign: 'center', margin: 0, width: '100%',
                }}>
                  {currentCard?.explain}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p style={{ fontFamily: FONTS.sans, textAlign: 'center', color: INK.faint, fontSize: '10px', letterSpacing: '1.5px', margin: '0 0 16px' }}>Tap card to flip · ← → to navigate</p>

      {flipped && (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <button onClick={() => markCard(currentCard.id, 'dontknow')} className="fc-tap" style={{
            flex: 1, fontFamily: FONTS.sans, padding: '14px', borderRadius: RADII.btn, border: `1px solid ${INK.reviewBorder}`,
            background: INK.reviewBg, color: INK.reviewText, fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
          }}>✗ Review</button>
          <button onClick={() => markCard(currentCard.id, 'know')} className="fc-tap" style={{
            flex: 1, fontFamily: FONTS.sans, padding: '14px', borderRadius: RADII.btn, border: 'none',
            background: cardAccent, color: '#14120b', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
          }}>✓ Mastered</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={prevCard} className="fc-tap" style={{
          flex: 1, fontFamily: FONTS.sans, padding: '12px', borderRadius: RADII.nav, border: `1px solid ${INK.hairline}`,
          background: 'transparent', color: INK.mutedGoldGrey, fontSize: '12px', letterSpacing: '.5px',
        }}>← Prev</button>
        <button onClick={nextCard} className="fc-tap" style={{
          flex: 1, fontFamily: FONTS.sans, padding: '12px', borderRadius: RADII.nav, border: `1px solid ${INK.hairline}`,
          background: 'transparent', color: INK.mutedGoldGrey, fontSize: '12px', letterSpacing: '.5px',
        }}>Next →</button>
      </div>
    </div>
  );
}
