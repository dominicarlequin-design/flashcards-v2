import { useState, useEffect, useCallback } from 'react';

const ALL_CATEGORY = 'All';
const LEVEL_ORDER = ['Cats', 'Science', 'Geography', 'History', 'Tech'];

const starterCards = [
  { id: 1, question: "How long do cats sleep per day?", answer: "12–16 hours on average", category: "Cats" },
  { id: 2, question: "What is a group of cats called?", answer: "A clowder", category: "Cats" },
  { id: 3, question: "How many toes does a normal cat have?", answer: "18 toes total", category: "Cats" },
  { id: 4, question: "What does a slow blink mean?", answer: "Trust and affection", category: "Cats" },
  { id: 5, question: "Can cats see in complete darkness?", answer: "No — but need 6x less light than humans", category: "Cats" },
  { id: 6, question: "What is a polydactyl cat?", answer: "A cat born with extra toes", category: "Cats" },
  { id: 7, question: "Why do cats knead?", answer: "Comfort behavior from kittenhood", category: "Cats" },
  { id: 8, question: "How fast can a cat run?", answer: "Up to 30 mph", category: "Cats" },
  { id: 9, question: "Tail straight up means...?", answer: "Happy and confident", category: "Cats" },
  { id: 10, question: "Do cats have a dominant paw?", answer: "Yes — left or right pawed", category: "Cats" },
  { id: 11, question: "What is the powerhouse of the cell?", answer: "The mitochondria", category: "Science" },
  { id: 12, question: "How many bones are in the human body?", answer: "206 bones (adults)", category: "Science" },
  { id: 13, question: "What planet is closest in size to Earth?", answer: "Venus", category: "Science" },
  { id: 14, question: "What gas do plants absorb from the air?", answer: "Carbon dioxide (CO₂)", category: "Science" },
  { id: 15, question: "How many elements are on the periodic table?", answer: "118 elements", category: "Science" },
  { id: 16, question: "What is the speed of light?", answer: "~299,792 km per second", category: "Science" },
  { id: 17, question: "What is DNA short for?", answer: "Deoxyribonucleic acid", category: "Science" },
  { id: 18, question: "What layer of Earth do we live on?", answer: "The crust", category: "Science" },
  { id: 19, question: "What is the longest river in the world?", answer: "The Nile (6,650 km)", category: "Geography" },
  { id: 20, question: "What is the smallest country in the world?", answer: "Vatican City", category: "Geography" },
  { id: 21, question: "Which continent has the most countries?", answer: "Africa (54 countries)", category: "Geography" },
  { id: 22, question: "What ocean is the largest?", answer: "The Pacific Ocean", category: "Geography" },
  { id: 23, question: "What is the capital of Australia?", answer: "Canberra", category: "Geography" },
  { id: 24, question: "Which country has the most natural lakes?", answer: "Canada", category: "Geography" },
  { id: 25, question: "In what year did World War II end?", answer: "1945", category: "History" },
  { id: 26, question: "Who was the first US president?", answer: "George Washington", category: "History" },
  { id: 27, question: "What ancient wonder was in Alexandria?", answer: "The Great Library / Lighthouse", category: "History" },
  { id: 28, question: "What year did the Berlin Wall fall?", answer: "1989", category: "History" },
  { id: 29, question: "Who invented the telephone?", answer: "Alexander Graham Bell (1876)", category: "History" },
  { id: 30, question: "What empire was ruled by Julius Caesar?", answer: "The Roman Empire", category: "History" },
  { id: 31, question: "What does CPU stand for?", answer: "Central Processing Unit", category: "Tech" },
  { id: 32, question: "What language is React written in?", answer: "JavaScript", category: "Tech" },
  { id: 33, question: "What does HTTP stand for?", answer: "HyperText Transfer Protocol", category: "Tech" },
  { id: 34, question: "What is an API?", answer: "A way for apps to communicate with each other", category: "Tech" },
  { id: 35, question: "What does CSS stand for?", answer: "Cascading Style Sheets", category: "Tech" },
  { id: 36, question: "What is a 'bug' in coding?", answer: "An error or flaw in the code", category: "Tech" },
];

const CATEGORY_COLORS = {
  Cats:      { bg: '#2a1f3d', accent: '#c084fc', pill: '#3d1f5c' },
  Science:   { bg: '#0d2137', accent: '#38bdf8', pill: '#0c3251' },
  Geography: { bg: '#0d2a1a', accent: '#4ade80', pill: '#0a3320' },
  History:   { bg: '#2d1b0e', accent: '#fb923c', pill: '#4a2800' },
  Tech:      { bg: '#0f1f2d', accent: '#818cf8', pill: '#1e2a4a' },
  Custom:    { bg: '#1e1a14', accent: '#fbbf24', pill: '#362d10' },
};
const CATEGORY_EMOJI = { Cats:'🐱', Science:'🔬', Geography:'🌍', History:'🏛️', Tech:'💻', Custom:'✨' };
const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Custom;

// ── views ──────────────────────────────────────────────────────────────────
const VIEWS = { MAP: 'map', STUDY: 'study', STATS: 'stats', MANAGE: 'manage' };

// desktop breakpoint hook
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 860);
  useEffect(() => {
    const fn = () => setIsDesktop(window.innerWidth >= 860);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isDesktop;
}

export default function App() {
  const isDesktop = useIsDesktop();

  const [cards, setCards] = useState(() => {
    try { const s = localStorage.getItem('fc_v3'); return s ? JSON.parse(s) : starterCards; }
    catch { return starterCards; }
  });

  // session results: { [cardId]: 'know' | 'dontknow' }
  const [results, setResults] = useState({});

  // permanent mastery — persists across sessions, drives level unlocking
  const [masteredIds, setMasteredIds] = useState(() => {
    try { const s = localStorage.getItem('fc_mastered'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_streak') || '{"count":0,"lastDate":""}'); }
    catch { return { count: 0, lastDate: '' }; }
  });

  const [view, setView] = useState(VIEWS.MAP);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cameFromMap, setCameFromMap] = useState(false);

  // add card form
  const [showForm, setShowForm] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [newCat, setNewCat] = useState('Custom');
  const [justAdded, setJustAdded] = useState(false);

  // edit modal
  const [editCard, setEditCard] = useState(null);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');
  const [editCat, setEditCat] = useState('Custom');

  // import/export
  const [importMsg, setImportMsg] = useState('');

  const exportCards = () => {
    const data = JSON.stringify({ version: 1, exported: new Date().toISOString(), cards }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCards = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        const incoming = parsed.cards || parsed;
        if (!Array.isArray(incoming)) throw new Error('Invalid format');
        const existingQs = new Set(cards.map(c => c.question.toLowerCase()));
        const newCards = incoming
          .filter(c => c.question && c.answer)
          .map(c => ({ ...c, id: c.id || Date.now() + Math.random() }))
          .filter(c => !existingQs.has(c.question.toLowerCase()));
        setCards(prev => [...prev, ...newCards]);
        setImportMsg(`✅ Imported ${newCards.length} new card${newCards.length !== 1 ? 's' : ''}!`);
        setTimeout(() => setImportMsg(''), 3000);
      } catch {
        setImportMsg('❌ Invalid file — make sure it\'s a flashcards JSON');
        setTimeout(() => setImportMsg(''), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const categories = [ALL_CATEGORY, ...Array.from(new Set(cards.map(c => c.category)))];
  const filtered = activeCategory === ALL_CATEGORY ? cards : cards.filter(c => c.category === activeCategory);
  const currentCard = filtered[index] || filtered[0];
  const colors = currentCard ? getCat(currentCard.category) : getCat('Custom');

  // persist cards
  useEffect(() => { localStorage.setItem('fc_v3', JSON.stringify(cards)); }, [cards]);

  // persist mastered ids
  useEffect(() => { localStorage.setItem('fc_mastered', JSON.stringify(masteredIds)); }, [masteredIds]);

  // streak logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (streak.lastDate === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = {
      count: streak.lastDate === yesterday ? streak.count + 1 : 1,
      lastDate: today,
    };
    setStreak(newStreak);
    localStorage.setItem('fc_streak', JSON.stringify(newStreak));
  }, []);

  // reset index on category change
  useEffect(() => { setIndex(0); setFlipped(false); }, [activeCategory]);

  const flipCard = useCallback(() => setFlipped(f => !f), []);
  const nextCard = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setIndex(i => (i + 1) % filtered.length), 50);
  }, [filtered.length]);
  const prevCard = useCallback(() => {
    setFlipped(false);
    setTimeout(() => setIndex(i => (i - 1 + filtered.length) % filtered.length), 50);
  }, [filtered.length]);

  useEffect(() => {
    if (view !== VIEWS.STUDY) return;
    const fn = (e) => {
      if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flipCard(); }
      else if (e.key === 'ArrowRight') nextCard();
      else if (e.key === 'ArrowLeft') prevCard();
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [view, flipCard, nextCard, prevCard]);

  // know / don't know
  const markCard = (cardId, result) => {
    setResults(prev => ({ ...prev, [cardId]: result }));
    if (result === 'know') {
      setMasteredIds(prev => prev.includes(cardId) ? prev : [...prev, cardId]);
    }
    nextCard();
  };

  const resetSession = () => { setResults({}); setIndex(0); setFlipped(false); };

  // session stats
  const sessionCards = filtered.filter(c => results[c.id]);
  const known = sessionCards.filter(c => results[c.id] === 'know').length;
  const dontKnow = sessionCards.filter(c => results[c.id] === 'dontknow').length;
  const total = filtered.length;
  const pct = total > 0 ? Math.round((known / total) * 100) : 0;

  const addCard = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const card = { id: Date.now(), question: newQ.trim(), answer: newA.trim(), category: newCat };
    setCards(prev => [...prev, card]);
    setNewQ(''); setNewA('');
    setJustAdded(true);
    setActiveCategory(newCat);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const deleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setResults(prev => { const n = {...prev}; delete n[id]; return n; });
  };

  const openEdit = (card) => {
    setEditCard(card);
    setEditQ(card.question);
    setEditA(card.answer);
    setEditCat(card.category);
  };
  const saveEdit = () => {
    if (!editQ.trim() || !editA.trim()) return;
    setCards(prev => prev.map(c => c.id === editCard.id
      ? { ...c, question: editQ.trim(), answer: editA.trim(), category: editCat }
      : c
    ));
    setEditCard(null);
  };

  const getMastery = (cat) => {
    const catCards = cat === ALL_CATEGORY ? cards : cards.filter(c => c.category === cat);
    if (!catCards.length) return 0;
    const k = catCards.filter(c => results[c.id] === 'know').length;
    return Math.round((k / catCards.length) * 100);
  };

  // overall mastery across all cards (for Stats view)
  const overallMastery = cards.length ? Math.round((masteredIds.length / cards.length) * 100) : 0;

  // ── LEVEL / MAP LOGIC ──────────────────────────────────────────────────
  const isLevelComplete = (cat) => {
    const catCards = cards.filter(c => c.category === cat);
    if (!catCards.length) return false;
    return catCards.every(c => masteredIds.includes(c.id));
  };

  // a level is unlocked if it's the first one, or the previous one is complete
  const isLevelUnlocked = (levelIndex) => {
    if (levelIndex === 0) return true;
    return isLevelComplete(LEVEL_ORDER[levelIndex - 1]);
  };

  const enterLevel = (cat) => {
    setActiveCategory(cat);
    setResults({});
    setIndex(0);
    setFlipped(false);
    setCameFromMap(true);
    setView(VIEWS.STUDY);
  };

  const backToMap = () => {
    setCameFromMap(false);
    setView(VIEWS.MAP);
  };

  const navBtn = (label, v) => (
    <button onClick={() => setView(v)} style={{
      padding: isDesktop ? '11px 16px' : '8px 14px',
      borderRadius: isDesktop ? '10px' : '8px',
      border: 'none', cursor: 'pointer',
      background: view === v ? '#1e2538' : 'transparent',
      color: view === v ? '#e2e8f0' : '#475569',
      fontSize: isDesktop ? '14px' : '13px',
      fontWeight: view === v ? '600' : '400',
      textAlign: isDesktop ? 'left' : 'center',
      width: isDesktop ? '100%' : 'auto',
    }}>{label}</button>
  );

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #1e2538', background: '#0a0a0f', color: '#e2e8f0', fontSize: '14px',
    fontFamily: 'inherit', marginBottom: '10px',
  };

  const content = (
    <>
      {/* ── MAP VIEW ── */}
      {view === VIEWS.MAP && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop: isDesktop ? '24px' : '10px' }}>
          {LEVEL_ORDER.map((cat, i) => {
            const unlocked = isLevelUnlocked(i);
            const complete = isLevelComplete(cat);
            const cc = getCat(cat);
            const size = isDesktop ? '100px' : '84px';
            const offsetAmt = isDesktop ? 56 : 40;
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
      )}

      {/* ── STUDY VIEW ── */}
      {view === VIEWS.STUDY && (
        <div style={{ maxWidth: isDesktop ? '560px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
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
          <div onClick={flipCard} style={{ perspective:'1000px', height: isDesktop ? '300px' : '220px', cursor:'pointer', marginBottom:'14px' }}>
            <div style={{
              width:'100%', height:'100%', position:'relative', transformStyle:'preserve-3d',
              transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              <div style={{
                position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
                borderRadius:'16px', background:`linear-gradient(145deg,${colors.bg},#0a0a0f)`,
                border:`1px solid ${colors.accent}22`, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', padding: isDesktop ? '36px' : '24px', boxSizing:'border-box',
                boxShadow:`0 0 40px ${colors.accent}15`,
              }}>
                <span style={{ fontSize:'11px', fontWeight:'600', letterSpacing:'1.5px', color:colors.accent, opacity:0.7, marginBottom:'14px', textTransform:'uppercase' }}>
                  {CATEGORY_EMOJI[currentCard?.category]||'✨'} {currentCard?.category}
                </span>
                <p style={{ fontSize: isDesktop ? '22px' : '19px', fontWeight:'500', textAlign:'center', margin:0, lineHeight:1.5, color:'#f1f5f9' }}>
                  {currentCard?.question}
                </p>
              </div>
              <div style={{
                position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
                borderRadius:'16px', background:`linear-gradient(145deg,${colors.bg},#0a0a0f)`,
                border:`1.5px solid ${colors.accent}55`, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', padding: isDesktop ? '36px' : '24px', boxSizing:'border-box',
                transform:'rotateY(180deg)', boxShadow:`0 0 50px ${colors.accent}25`,
              }}>
                <span style={{ fontSize:'11px', fontWeight:'600', letterSpacing:'1.5px', color:colors.accent, opacity:0.7, marginBottom:'14px', textTransform:'uppercase' }}>Answer</span>
                <p style={{ fontSize: isDesktop ? '24px' : '21px', fontWeight:'600', textAlign:'center', margin:0, lineHeight:1.4, color:colors.accent }}>
                  {currentCard?.answer}
                </p>
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
      )}

      {/* ── STATS VIEW ── */}
      {view === VIEWS.STATS && (
        <div style={{ maxWidth: isDesktop ? '640px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
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
            {LEVEL_ORDER.filter(cat => cards.some(c => c.category === cat)).map(cat => {
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
      )}

      {/* ── MANAGE VIEW ── */}
      {view === VIEWS.MANAGE && (
        <div style={{ maxWidth: isDesktop ? '720px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
          <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
            <button onClick={() => setShowForm(f => !f)} style={{
              padding:'10px 16px', borderRadius:'10px', border:'1.5px solid #818cf855',
              background:'#818cf81a', color:'#818cf8', fontSize:'13px', fontWeight:'600', cursor:'pointer',
            }}>{showForm ? '× Close' : '+ Add Card'}</button>
            <button onClick={exportCards} style={{
              padding:'10px 16px', borderRadius:'10px', border:'1px solid #1e2538',
              background:'transparent', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
            }}>📤 Export</button>
            <label style={{
              padding:'10px 16px', borderRadius:'10px', border:'1px solid #1e2538',
              background:'transparent', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
            }}>
              📥 Import
              <input type="file" accept="application/json" onChange={importCards} style={{ display:'none' }} />
            </label>
            {importMsg && <span style={{ fontSize:'12px', color:'#94a3b8', alignSelf:'center' }}>{importMsg}</span>}
          </div>

          {showForm && (
            <div style={{ background:'#111827', borderRadius:'14px', padding:'16px', marginBottom:'20px' }}>
              <textarea placeholder="Question" value={newQ} onChange={e => setNewQ(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
              <textarea placeholder="Answer" value={newA} onChange={e => setNewA(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
              <select value={newCat} onChange={e => setNewCat(e.target.value)} style={inputStyle}>
                {[...LEVEL_ORDER, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={addCard} style={{
                padding:'10px 16px', borderRadius:'8px', border:'none',
                background:'#818cf8', color:'#0a0a0f', fontSize:'13px', fontWeight:'700', cursor:'pointer',
              }}>{justAdded ? '✓ Added!' : 'Add Card'}</button>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns: isDesktop ? 'repeat(2,1fr)' : '1fr', gap:'10px' }}>
            {cards.map(card => {
              const cc = getCat(card.category);
              return (
                <div key={card.id} style={{ background:'#111827', borderRadius:'12px', padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                    <span style={{ fontSize:'11px', fontWeight:'600', color:cc.accent, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                      {CATEGORY_EMOJI[card.category]||'✨'} {card.category}
                    </span>
                    <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                      <button onClick={() => openEdit(card)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.7 }}>✏️</button>
                      <button onClick={() => deleteCard(card.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.7 }}>🗑️</button>
                    </div>
                  </div>
                  <p style={{ margin:'8px 0 4px', fontSize:'14px', color:'#f1f5f9', fontWeight:'500' }}>{card.question}</p>
                  <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>{card.answer}</p>
                </div>
              );
            })}
          </div>

          {editCard && (
            <div onClick={() => setEditCard(null)} style={{
              position:'fixed', inset:0, background:'#000000aa', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', zIndex:10,
            }}>
              <div onClick={e => e.stopPropagation()} style={{ background:'#111827', borderRadius:'16px', padding:'20px', width:'100%', maxWidth:'420px' }}>
                <h3 style={{ margin:'0 0 14px', fontSize:'16px', color:'#e2e8f0' }}>Edit Card</h3>
                <textarea value={editQ} onChange={e => setEditQ(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
                <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
                <select value={editCat} onChange={e => setEditCat(e.target.value)} style={inputStyle}>
                  {[...LEVEL_ORDER, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div style={{ display:'flex', gap:'10px' }}>
                  <button onClick={() => setEditCard(null)} style={{
                    flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #1e2538',
                    background:'transparent', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
                  }}>Cancel</button>
                  <button onClick={saveEdit} style={{
                    flex:1, padding:'10px', borderRadius:'8px', border:'none',
                    background:'#818cf8', color:'#0a0a0f', fontSize:'13px', fontWeight:'700', cursor:'pointer',
                  }}>Save Changes</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'100vh', background:'#0a0a0f', color:'#e2e8f0', padding: isDesktop ? '40px' : '20px 16px', boxSizing:'border-box' }}>
      <div style={{ maxWidth: isDesktop ? '980px' : '520px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isDesktop ? '32px' : '20px' }}>
          <div>
            <h1 style={{ fontSize: isDesktop ? '26px' : '20px', fontWeight:'700', margin:0, letterSpacing:'-0.5px' }}>Flashcards</h1>
            <p style={{ color:'#334155', fontSize: isDesktop ? '13px' : '12px', margin:0 }}>{cards.length} cards · 🔥 {streak.count} day streak</p>
          </div>
          {!isDesktop && (
            <div style={{ display:'flex', gap:'4px', background:'#111827', borderRadius:'10px', padding:'4px' }}>
              {navBtn('Map', VIEWS.MAP)}
              {navBtn('Study', VIEWS.STUDY)}
              {navBtn('Stats', VIEWS.STATS)}
              {navBtn('Cards', VIEWS.MANAGE)}
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap: isDesktop ? '32px' : '0', alignItems:'flex-start' }}>
          {isDesktop && (
            <div style={{ display:'flex', flexDirection:'column', gap:'4px', background:'#111827', borderRadius:'14px', padding:'10px', width:'168px', flexShrink:0, position:'sticky', top:'40px' }}>
              {navBtn('Map', VIEWS.MAP)}
              {navBtn('Study', VIEWS.STUDY)}
              {navBtn('Stats', VIEWS.STATS)}
              {navBtn('Cards', VIEWS.MANAGE)}
            </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            {content}
          </div>
        </div>

      </div>
    </div>
  );
}
