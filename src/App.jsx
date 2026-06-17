import { useState, useEffect, useCallback } from 'react';

const ALL_CATEGORY = 'All';

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
const VIEWS = { STUDY: 'study', STATS: 'stats', MANAGE: 'manage' };

export default function App() {
  const [cards, setCards] = useState(() => {
    try { const s = localStorage.getItem('fc_v3'); return s ? JSON.parse(s) : starterCards; }
    catch { return starterCards; }
  });

  // session results: { [cardId]: 'know' | 'dontknow' }
  const [results, setResults] = useState({});
  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_streak') || '{"count":0,"lastDate":""}'); }
    catch { return { count: 0, lastDate: '' }; }
  });

  const [view, setView] = useState(VIEWS.STUDY);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // add card form
  const [showForm, setShowForm] = useState(false);
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [newCat, setNewCat] = useState('Custom');
  const [justAdded, setJustAdded] = useState(false);

  // edit modal
  const [editCard, setEditCard] = useState(null); // card being edited
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
        const incoming = parsed.cards || parsed; // support array or {cards:[]}
        if (!Array.isArray(incoming)) throw new Error('Invalid format');
        // merge — skip dupes by question text
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
    e.target.value = ''; // reset input
  };

  const categories = [ALL_CATEGORY, ...Array.from(new Set(cards.map(c => c.category)))];
  const filtered = activeCategory === ALL_CATEGORY ? cards : cards.filter(c => c.category === activeCategory);
  const currentCard = filtered[index] || filtered[0];
  const colors = currentCard ? getCat(currentCard.category) : getCat('Custom');

  // persist cards
  useEffect(() => { localStorage.setItem('fc_v3', JSON.stringify(cards)); }, [cards]);

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
    nextCard();
  };

  const resetSession = () => { setResults({}); setIndex(0); setFlipped(false); };

  // session stats
  const sessionCards = filtered.filter(c => results[c.id]);
  const known = sessionCards.filter(c => results[c.id] === 'know').length;
  const dontKnow = sessionCards.filter(c => results[c.id] === 'dontknow').length;
  const total = filtered.length;
  const pct = total > 0 ? Math.round((known / total) * 100) : 0;

  // add card
  const addCard = () => {
    if (!newQ.trim() || !newA.trim()) return;
    const card = { id: Date.now(), question: newQ.trim(), answer: newA.trim(), category: newCat };
    setCards(prev => [...prev, card]);
    setNewQ(''); setNewA('');
    setJustAdded(true);
    setActiveCategory(newCat);
    setTimeout(() => setJustAdded(false), 2000);
  };

  // delete card
  const deleteCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setResults(prev => { const n = {...prev}; delete n[id]; return n; });
  };

  // edit card
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

  // per-category mastery
  const getMastery = (cat) => {
    const catCards = cat === ALL_CATEGORY ? cards : cards.filter(c => c.category === cat);
    if (!catCards.length) return 0;
    const k = catCards.filter(c => results[c.id] === 'know').length;
    return Math.round((k / catCards.length) * 100);
  };

  const navBtn = (label, v) => (
    <button onClick={() => setView(v)} style={{
      padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
      background: view === v ? '#1e2538' : 'transparent',
      color: view === v ? '#e2e8f0' : '#475569',
      fontSize: '13px', fontWeight: view === v ? '600' : '400',
    }}>{label}</button>
  );

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'100vh', background:'#0a0a0f', color:'#e2e8f0', padding:'20px 16px', boxSizing:'border-box' }}>
      <div style={{ maxWidth:'520px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px' }}>
          <div>
            <h1 style={{ fontSize:'20px', fontWeight:'700', margin:0, letterSpacing:'-0.5px' }}>Flashcards</h1>
            <p style={{ color:'#334155', fontSize:'12px', margin:0 }}>{cards.length} cards · 🔥 {streak.count} day streak</p>
          </div>
          <div style={{ display:'flex', gap:'4px', background:'#111827', borderRadius:'10px', padding:'4px' }}>
            {navBtn('Study', VIEWS.STUDY)}
            {navBtn('Stats', VIEWS.STATS)}
            {navBtn('Cards', VIEWS.MANAGE)}
          </div>
        </div>

        {/* ── STUDY VIEW ── */}
        {view === VIEWS.STUDY && (
          <>
            {/* Category pills */}
            <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'12px', marginBottom:'16px', scrollbarWidth:'none' }}>
              {categories.map(cat => {
                const isActive = cat === activeCategory;
                const cc = getCat(cat);
                const m = getMastery(cat);
                return (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
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
            <div onClick={flipCard} style={{ perspective:'1000px', height:'220px', cursor:'pointer', marginBottom:'14px' }}>
              <div style={{
                width:'100%', height:'100%', position:'relative', transformStyle:'preserve-3d',
                transition:'transform 0.5s cubic-bezier(0.23,1,0.32,1)',
                transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}>
                {/* Front */}
                <div style={{
                  position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
                  borderRadius:'16px', background:`linear-gradient(145deg,${colors.bg},#0a0a0f)`,
                  border:`1px solid ${colors.accent}22`, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', padding:'24px', boxSizing:'border-box',
                  boxShadow:`0 0 40px ${colors.accent}15`,
                }}>
                  <span style={{ fontSize:'11px', fontWeight:'600', letterSpacing:'1.5px', color:colors.accent, opacity:0.7, marginBottom:'14px', textTransform:'uppercase' }}>
                    {CATEGORY_EMOJI[currentCard?.category]||'✨'} {currentCard?.category}
                  </span>
                  <p style={{ fontSize:'19px', fontWeight:'500', textAlign:'center', margin:0, lineHeight:1.5, color:'#f1f5f9' }}>
                    {currentCard?.question}
                  </p>
                </div>
                {/* Back */}
                <div style={{
                  position:'absolute', width:'100%', height:'100%', backfaceVisibility:'hidden',
                  borderRadius:'16px', background:`linear-gradient(145deg,${colors.bg},#0a0a0f)`,
                  border:`1.5px solid ${colors.accent}55`, display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', padding:'24px', boxSizing:'border-box',
                  transform:'rotateY(180deg)', boxShadow:`0 0 50px ${colors.accent}25`,
                }}>
                  <span style={{ fontSize:'11px', fontWeight:'600', letterSpacing:'1.5px', color:colors.accent, opacity:0.7, marginBottom:'14px', textTransform:'uppercase' }}>Answer</span>
                  <p style={{ fontSize:'21px', fontWeight:'600', textAlign:'center', margin:0, lineHeight:1.4, color:colors.accent }}>
                    {currentCard?.answer}
                  </p>
                </div>
              </div>
            </div>

            <p style={{ textAlign:'center', color:'#1e2538', fontSize:'12px', marginBottom:'16px' }}>Tap to flip · Arrow keys to navigate</p>

            {/* Know / Don't Know — shown after flip */}
            {flipped && (
              <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
                <button onClick={() => markCard(currentCard.id, 'dontknow')} style={{
                  flex:1, padding:'13px', borderRadius:'12px', border:'1.5px solid #f87171',
                  background:'#1a0f0f', color:'#f87171', fontSize:'15px', fontWeight:'600', cursor:'pointer',
                }}>✗ Review again</button>
                <button onClick={() => markCard(currentCard.id, 'know')} style={{
                  flex:1, padding:'13px', borderRadius:'12px', border:'none',
                  background:'#4ade80', color:'#000', fontSize:'15px', fontWeight:'700', cursor:'pointer',
                }}>✓ Got it</button>
              </div>
            )}

            {/* Nav buttons */}
            <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'28px' }}>
              {[{l:'← Prev',fn:prevCard},{l:'Next →',fn:nextCard},{l:'🔀',fn:()=>{
                setFlipped(false);
                const s=[...cards].sort(()=>Math.random()-0.5);
                setCards(s); setIndex(0);
              }}].map(({l,fn})=>(
                <button key={l} onClick={fn} style={{ padding:'10px 18px', background:'#111827', border:'1px solid #1e2538', borderRadius:'10px', color:'#94a3b8', fontSize:'14px', cursor:'pointer', fontWeight:'500' }}>{l}</button>
              ))}
            </div>

            {/* Add card */}
            <div style={{ borderTop:'1px solid #1e2538', paddingTop:'20px' }}>
              <button onClick={() => setShowForm(f=>!f)} style={{
                width:'100%', padding:'12px', background: showForm?'#1e2538':'transparent',
                border:'1px solid #1e2538', borderRadius:'12px',
                color: showForm?'#e2e8f0':'#64748b', fontSize:'14px', fontWeight:'600', cursor:'pointer',
                marginBottom: showForm?'16px':0,
              }}>
                {showForm ? '✕ Close' : '＋ Add a Card'}
              </button>
              {showForm && (
                <div>
                  <input value={newQ} onChange={e=>setNewQ(e.target.value)} placeholder="Question..." style={iS} />
                  <input value={newA} onChange={e=>setNewA(e.target.value)} placeholder="Answer..." style={iS} />
                  <p style={{ fontSize:'12px', color:'#64748b', marginBottom:'8px', fontWeight:'600', letterSpacing:'0.5px' }}>CATEGORY</p>
                  <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'14px' }}>
                    {['Cats','Science','Geography','History','Tech','Custom'].map(cat => {
                      const cc=getCat(cat); const isA=newCat===cat;
                      return <button key={cat} onClick={()=>setNewCat(cat)} style={{
                        padding:'6px 12px', borderRadius:'999px', fontSize:'12px', cursor:'pointer',
                        border: isA?`1.5px solid ${cc.accent}`:'1.5px solid #1e2538',
                        background: isA?cc.pill:'transparent', color: isA?cc.accent:'#475569', fontWeight: isA?'600':'400',
                      }}>{CATEGORY_EMOJI[cat]} {cat}</button>;
                    })}
                  </div>
                  <button onClick={addCard} style={{ width:'100%', padding:'13px', background:getCat(newCat).accent, border:'none', borderRadius:'12px', color:'#000', fontWeight:'700', fontSize:'15px', cursor:'pointer' }}>
                    + Add Card
                  </button>
                  {justAdded && <p style={{ textAlign:'center', color:'#4ade80', fontSize:'13px', marginTop:'10px' }}>✅ Card added!</p>}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── STATS VIEW ── */}
        {view === VIEWS.STATS && (
          <div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'24px' }}>
              {[
                { label:'Known', value:known, color:'#4ade80' },
                { label:'Review', value:dontKnow, color:'#f87171' },
                { label:'Streak', value:`${streak.count}d`, color:'#fbbf24' },
              ].map(({label,value,color})=>(
                <div key={label} style={{ background:'#111827', borderRadius:'12px', padding:'16px', textAlign:'center', border:'1px solid #1e2538' }}>
                  <p style={{ fontSize:'26px', fontWeight:'700', color, margin:'0 0 4px' }}>{value}</p>
                  <p style={{ fontSize:'12px', color:'#475569', margin:0 }}>{label}</p>
                </div>
              ))}
            </div>

            {/* Overall progress bar */}
            <div style={{ background:'#111827', borderRadius:'12px', padding:'16px', marginBottom:'20px', border:'1px solid #1e2538' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'13px', color:'#94a3b8' }}>Session progress</span>
                <span style={{ fontSize:'13px', fontWeight:'600', color:'#4ade80' }}>{pct}%</span>
              </div>
              <div style={{ height:'8px', background:'#1e2538', borderRadius:'999px', overflow:'hidden' }}>
                <div style={{ width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#4ade80,#22c55e)', borderRadius:'999px', transition:'width 0.4s' }} />
              </div>
              <p style={{ fontSize:'12px', color:'#334155', margin:'8px 0 0' }}>{sessionCards.length} of {total} cards answered</p>
            </div>

            {/* Per-category breakdown */}
            <p style={{ fontSize:'13px', fontWeight:'600', color:'#64748b', letterSpacing:'0.5px', marginBottom:'12px' }}>BY CATEGORY</p>
            {categories.filter(c=>c!==ALL_CATEGORY).map(cat => {
              const cc = getCat(cat);
              const catCards = cards.filter(c=>c.category===cat);
              const k = catCards.filter(c=>results[c.id]==='know').length;
              const dk = catCards.filter(c=>results[c.id]==='dontknow').length;
              const m = catCards.length > 0 ? Math.round((k/catCards.length)*100) : 0;
              return (
                <div key={cat} style={{ background:'#111827', borderRadius:'12px', padding:'14px 16px', marginBottom:'10px', border:`1px solid ${cc.accent}22` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                    <span style={{ fontSize:'14px', fontWeight:'600', color:cc.accent }}>{CATEGORY_EMOJI[cat]} {cat}</span>
                    <span style={{ fontSize:'13px', color:'#64748b' }}>{k}/{catCards.length} · {m}%</span>
                  </div>
                  <div style={{ height:'5px', background:'#1e2538', borderRadius:'999px', overflow:'hidden' }}>
                    <div style={{ width:`${m}%`, height:'100%', background:cc.accent, borderRadius:'999px', transition:'width 0.4s' }} />
                  </div>
                  {dk > 0 && <p style={{ fontSize:'11px', color:'#f87171', margin:'6px 0 0' }}>{dk} card{dk>1?'s':''} to review</p>}
                </div>
              );
            })}

            <button onClick={resetSession} style={{ width:'100%', marginTop:'12px', padding:'13px', background:'transparent', border:'1px solid #1e2538', borderRadius:'12px', color:'#64748b', fontSize:'14px', cursor:'pointer' }}>
              🔄 Reset session
            </button>
          </div>
        )}

        {/* ── MANAGE VIEW ── */}
        {view === VIEWS.MANAGE && (
          <div>
            {/* Export / Import */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
              <button onClick={exportCards} style={{
                flex:1, padding:'11px', background:'#111827', border:'1px solid #1e2538',
                borderRadius:'10px', color:'#94a3b8', fontSize:'13px', fontWeight:'600', cursor:'pointer',
              }}>⬇️ Export JSON</button>
              <label style={{
                flex:1, padding:'11px', background:'#111827', border:'1px solid #1e2538',
                borderRadius:'10px', color:'#94a3b8', fontSize:'13px', fontWeight:'600', cursor:'pointer',
                textAlign:'center',
              }}>
                ⬆️ Import JSON
                <input type="file" accept=".json" onChange={importCards} style={{ display:'none' }} />
              </label>
            </div>
            {importMsg && <p style={{ textAlign:'center', fontSize:'13px', color: importMsg.startsWith('✅')?'#4ade80':'#f87171', marginBottom:'10px' }}>{importMsg}</p>}
            <p style={{ fontSize:'13px', color:'#64748b', marginBottom:'16px' }}>{cards.length} total cards</p>

            {/* Filter */}
            <div style={{ display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'12px', marginBottom:'16px', scrollbarWidth:'none' }}>
              {categories.map(cat=>{
                const isA=cat===activeCategory; const cc=getCat(cat);
                return <button key={cat} onClick={()=>setActiveCategory(cat)} style={{
                  flexShrink:0, padding:'5px 12px', borderRadius:'999px', cursor:'pointer', whiteSpace:'nowrap',
                  border: isA?`1.5px solid ${cc.accent}`:'1.5px solid #1e2538',
                  background: isA?cc.pill:'transparent',
                  color: isA?cc.accent:'#64748b', fontSize:'12px', fontWeight: isA?'600':'400',
                }}>{cat===ALL_CATEGORY?'All':`${CATEGORY_EMOJI[cat]||'✨'} ${cat}`}</button>;
              })}
            </div>

            {filtered.map(card => {
              const cc = getCat(card.category);
              const res = results[card.id];
              return (
                <div key={card.id} style={{ background:'#111827', borderRadius:'12px', padding:'14px 16px', marginBottom:'10px', border:`1px solid ${res==='know'?'#4ade8033':res==='dontknow'?'#f8717133':'#1e2538'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'10px' }}>
                    <div style={{ flex:1 }}>
                      <span style={{ fontSize:'11px', color:cc.accent, fontWeight:'600', letterSpacing:'0.5px' }}>{CATEGORY_EMOJI[card.category]} {card.category}</span>
                      <p style={{ fontSize:'14px', color:'#e2e8f0', margin:'4px 0 2px', fontWeight:'500' }}>{card.question}</p>
                      <p style={{ fontSize:'13px', color:'#64748b', margin:0 }}>{card.answer}</p>
                    </div>
                    <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
                      <button onClick={()=>openEdit(card)} style={{ padding:'6px 10px', background:'#1e2538', border:'none', borderRadius:'8px', color:'#94a3b8', fontSize:'12px', cursor:'pointer' }}>Edit</button>
                      <button onClick={()=>deleteCard(card.id)} style={{ padding:'6px 10px', background:'#1a0f0f', border:'1px solid #f8717133', borderRadius:'8px', color:'#f87171', fontSize:'12px', cursor:'pointer' }}>✕</button>
                    </div>
                  </div>
                  {res && <p style={{ fontSize:'11px', color: res==='know'?'#4ade80':'#f87171', margin:'8px 0 0' }}>{res==='know'?'✓ Known this session':'✗ Needs review'}</p>}
                </div>
              );
            })}
          </div>
        )}

        <p style={{ textAlign:'center', color:'#1e2538', fontSize:'11px', marginTop:'28px' }}>Saved automatically</p>
      </div>

      {/* ── EDIT MODAL ── */}
      {editCard && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', zIndex:100 }}>
          <div style={{ background:'#111827', borderRadius:'16px', padding:'24px', width:'100%', maxWidth:'420px', border:'1px solid #1e2538' }}>
            <h3 style={{ margin:'0 0 16px', fontSize:'16px', fontWeight:'700' }}>Edit Card</h3>
            <input value={editQ} onChange={e=>setEditQ(e.target.value)} placeholder="Question..." style={iS} />
            <input value={editA} onChange={e=>setEditA(e.target.value)} placeholder="Answer..." style={iS} />
            <p style={{ fontSize:'12px', color:'#64748b', marginBottom:'8px', fontWeight:'600' }}>CATEGORY</p>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'16px' }}>
              {['Cats','Science','Geography','History','Tech','Custom'].map(cat=>{
                const cc=getCat(cat); const isA=editCat===cat;
                return <button key={cat} onClick={()=>setEditCat(cat)} style={{
                  padding:'6px 10px', borderRadius:'999px', fontSize:'12px', cursor:'pointer',
                  border: isA?`1.5px solid ${cc.accent}`:'1.5px solid #1e2538',
                  background: isA?cc.pill:'transparent', color: isA?cc.accent:'#475569', fontWeight: isA?'600':'400',
                }}>{CATEGORY_EMOJI[cat]} {cat}</button>;
              })}
            </div>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={()=>setEditCard(null)} style={{ flex:1, padding:'12px', background:'transparent', border:'1px solid #1e2538', borderRadius:'10px', color:'#64748b', cursor:'pointer', fontSize:'14px' }}>Cancel</button>
              <button onClick={saveEdit} style={{ flex:1, padding:'12px', background:'#818cf8', border:'none', borderRadius:'10px', color:'#000', fontWeight:'700', cursor:'pointer', fontSize:'14px' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const iS = {
  width:'100%', padding:'12px 16px', background:'#0a0a0f', border:'1px solid #1e2538',
  borderRadius:'10px', color:'#e2e8f0', fontSize:'15px', marginBottom:'12px',
  boxSizing:'border-box', outline:'none',
};
