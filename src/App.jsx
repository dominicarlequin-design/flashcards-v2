import { useState, useEffect, useCallback } from 'react';
import { useIsDesktop, useIsLarge, useIsXLarge } from './hooks/useBreakpoints';
import HomeView from './components/views/HomeView';
import MapView from './components/views/MapView';
import StudyView from './components/views/StudyView';
import StatsView from './components/views/StatsView';
import ManageView from './components/views/ManageView';
import starterCards from './data/startercards';
import { ALL_CATEGORY, LEVEL_ORDER, getCat } from './constants/categories';
import { VIEWS } from './constants/views';

export default function App() {
  const isDesktop = useIsDesktop();
  const isLarge = useIsLarge();
  const isXLarge = useIsXLarge();

  const [cards, setCards] = useState(() => {
    try {
      const s = localStorage.getItem('fc_v5');
      if (!s) return starterCards;
      const saved = JSON.parse(s);
      // always use the current starter card content (so app updates to built-in
      // cards show up), and keep any truly user-added custom cards on top
      const starterIds = new Set(starterCards.map(c => c.id));
      const userAdded = saved.filter(c => !starterIds.has(c.id));
      return [...starterCards, ...userAdded];
    }
    catch { return starterCards; }
  });

  // session results: { [cardId]: 'know' | 'dontknow' }
  const [results, setResults] = useState({});

  // permanent mastery \u2014 persists across sessions, drives level unlocking
  const [masteredIds, setMasteredIds] = useState(() => {
    try { const s = localStorage.getItem('fc_mastered_v2'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_streak') || '{"count":0,"lastDate":""}'); }
    catch { return { count: 0, lastDate: '' }; }
  });

  const [view, setView] = useState(VIEWS.HOME);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answerTab, setAnswerTab] = useState('answer');
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
        setImportMsg(`\u2705 Imported ${newCards.length} new card${newCards.length !== 1 ? 's' : ''}!`);
        setTimeout(() => setImportMsg(''), 3000);
      } catch {
        setImportMsg('\u274C Invalid file \u2014 make sure it\'s a flashcards JSON');
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
  useEffect(() => { localStorage.setItem('fc_v5', JSON.stringify(cards)); }, [cards]);

  // persist mastered ids
  useEffect(() => { localStorage.setItem('fc_mastered_v2', JSON.stringify(masteredIds)); }, [masteredIds]);

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

  // reset to the Answer tab whenever the card changes
  useEffect(() => { setAnswerTab('answer'); }, [index, activeCategory]);

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

  // \u2500\u2500 LEVEL / MAP LOGIC \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
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

  const content = (
    <>
      {/* \u2500\u2500 HOME VIEW \u2500\u2500 */}
      {view === VIEWS.HOME && (
        <HomeView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          onStartStudying={() => setView(VIEWS.STUDY)}
        />
      )}

      {/* \u2500\u2500 MAP VIEW \u2500\u2500 */}
      {view === VIEWS.MAP && (
        <MapView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          isLevelUnlocked={isLevelUnlocked}
          isLevelComplete={isLevelComplete}
          enterLevel={enterLevel}
        />
      )}

      {/* \u2500\u2500 STUDY VIEW \u2500\u2500 */}
      {view === VIEWS.STUDY && (
        <StudyView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          cameFromMap={cameFromMap}
          backToMap={backToMap}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          setCameFromMap={setCameFromMap}
          getMastery={getMastery}
          sessionCards={sessionCards}
          known={known}
          dontKnow={dontKnow}
          pct={pct}
          total={total}
          resetSession={resetSession}
          index={index}
          filtered={filtered}
          results={results}
          currentCard={currentCard}
          colors={colors}
          flipCard={flipCard}
          flipped={flipped}
          answerTab={answerTab}
          setAnswerTab={setAnswerTab}
          markCard={markCard}
          prevCard={prevCard}
          nextCard={nextCard}
        />
      )}

      {/* \u2500\u2500 STATS VIEW \u2500\u2500 */}
      {view === VIEWS.STATS && (
        <StatsView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          cards={cards}
          masteredIds={masteredIds}
          streak={streak}
          overallMastery={overallMastery}
        />
      )}

      {/* \u2500\u2500 MANAGE VIEW \u2500\u2500 */}
      {view === VIEWS.MANAGE && (
        <ManageView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          cards={cards}
          showForm={showForm}
          setShowForm={setShowForm}
          exportCards={exportCards}
          importCards={importCards}
          importMsg={importMsg}
          newQ={newQ}
          setNewQ={setNewQ}
          newA={newA}
          setNewA={setNewA}
          newCat={newCat}
          setNewCat={setNewCat}
          addCard={addCard}
          justAdded={justAdded}
          openEdit={openEdit}
          deleteCard={deleteCard}
          editCard={editCard}
          setEditCard={setEditCard}
          editQ={editQ}
          setEditQ={setEditQ}
          editA={editA}
          setEditA={setEditA}
          editCat={editCat}
          setEditCat={setEditCat}
          saveEdit={saveEdit}
        />
      )}
    </>
  );

  // widest a view's own content ever gets (matches StatsView, the widest view)
  const sidebarW = isXLarge ? 232 : isLarge ? 200 : 168;
  const gapW = isXLarge ? 56 : isLarge ? 44 : 32;
  const contentMaxW = isXLarge ? 960 : isLarge ? 760 : 640;
  const containerMaxW = sidebarW + gapW + contentMaxW;

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'100vh', background:'#0a0a0f', color:'#e2e8f0', padding: isXLarge ? '64px 80px' : isLarge ? '56px' : isDesktop ? '40px' : '20px 16px', boxSizing:'border-box' }}>
      <div style={{ maxWidth: isDesktop ? `${containerMaxW}px` : '520px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: isLarge ? '40px' : isDesktop ? '32px' : '20px' }}>
          <div>
            <h1 style={{ fontSize: isXLarge ? '38px' : isLarge ? '32px' : isDesktop ? '26px' : '20px', fontWeight:'700', margin:0, letterSpacing:'-0.5px' }}>Flashcards</h1>
            <p style={{ color:'#334155', fontSize: isXLarge ? '15px' : isLarge ? '14px' : isDesktop ? '13px' : '12px', margin:0 }}>{cards.length} cards · 🔥 {streak.count} day streak</p>
          </div>
          {!isDesktop && (
            <div style={{ display:'flex', gap:'4px', background:'#111827', borderRadius:'10px', padding:'4px' }}>
              {navBtn('Home', VIEWS.HOME)}
              {navBtn('Map', VIEWS.MAP)}
              {navBtn('Study', VIEWS.STUDY)}
              {navBtn('Stats', VIEWS.STATS)}
              {navBtn('Cards', VIEWS.MANAGE)}
            </div>
          )}
        </div>

        <div style={{ display:'flex', gap: isXLarge ? '56px' : isLarge ? '44px' : isDesktop ? '32px' : '0', alignItems:'flex-start' }}>
          {isDesktop && view !== VIEWS.HOME && (
            <div style={{ display:'flex', flexDirection:'column', gap: isLarge ? '6px' : '4px', background:'#111827', borderRadius:'14px', padding: isXLarge ? '18px' : isLarge ? '14px' : '10px', width: isXLarge ? '232px' : isLarge ? '200px' : '168px', flexShrink:0, position:'sticky', top: isLarge ? '56px' : '40px' }}>
              {navBtn('Home', VIEWS.HOME)}
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
