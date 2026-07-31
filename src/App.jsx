import { useState, useEffect, useMemo, useCallback } from 'react';
import { useIsDesktop, useIsLarge, useIsXLarge } from './hooks/useBreakpoints';
import { useMistakeLog } from './hooks/useMistakeLog';
import HomeView from './components/views/HomeView';
import MapView from './components/views/MapView';
import StudyView from './components/views/StudyView';
import StatsView from './components/views/StatsView';
import ManageView from './components/views/ManageView';
import OnboardingView from './components/views/OnboardingView';
import SettingsView from './components/views/SettingsView';
import MotifBackground from './components/MotifBackground';
import starterCards from './data/startercards';
import constitutionalLawCards from './data/constitutionalLawCards';
import { ALL_CATEGORY, LEVEL_ORDER, CATEGORY_LIST, getCat } from './constants/categories';
import { INK, FONTS, PAGE_BG } from './constants/theme';
import { VIEWS } from './constants/views';

const ACCENT = INK.gold;

// all built-in decks, merged into one starter set
const allStarterCards = [...starterCards, ...constitutionalLawCards];

const DEFAULT_SETTINGS = {
  shuffle: false,
  reduceMotion: false,
  dailyReminder: true,
  bgMotif: 'law',
  bgDensity: 'normal',
};

export default function App() {
  const isDesktop = useIsDesktop();
  const isLarge = useIsLarge();
  const isXLarge = useIsXLarge();
  const { logAttempt } = useMistakeLog();

  const [cards, setCards] = useState(() => {
    try {
      const s = localStorage.getItem('fc_v5');
      if (!s) return allStarterCards;
      const saved = JSON.parse(s);
      // always use the current starter card content (so app updates to built-in
      // cards show up), and keep any truly user-added custom cards on top —
      // dropping anything left over from a removed category (e.g. old starter
      // cards from a subject that's no longer offered)
      const starterIds = new Set(allStarterCards.map(c => c.id));
      const validCategories = new Set([...CATEGORY_LIST, 'Custom']);
      const userAdded = saved.filter(c => !starterIds.has(c.id) && validCategories.has(c.category));
      return [...allStarterCards, ...userAdded];
    }
    catch { return allStarterCards; }
  });

  // session results: { [cardId]: 'know' | 'dontknow' }
  const [results, setResults] = useState({});

  // permanent mastery — persists across sessions, drives level unlocking
  const [masteredIds, setMasteredIds] = useState(() => {
    try { const s = localStorage.getItem('fc_mastered_v2'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });

  const [streak, setStreak] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_streak') || '{"count":0,"lastDate":""}'); }
    catch { return { count: 0, lastDate: '' }; }
  });

  // first-run intro — shown once, then remembered
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem('fc_onboarded_v1') !== '1'; } catch { return true; }
  });

  // shuffle / reduce motion / background motif / daily reminder toggle
  const [settings, setSettings] = useState(() => {
    try {
      const s = localStorage.getItem('fc_settings_v1');
      return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : DEFAULT_SETTINGS;
    } catch { return DEFAULT_SETTINGS; }
  });
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [justReset, setJustReset] = useState(false);

  const [view, setView] = useState(VIEWS.HOME);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answerTab, setAnswerTab] = useState('answer');
  const [cameFromMap, setCameFromMap] = useState(false);

  // when set, scopes the study session to exactly these card ids instead of
  // the active category — used for the Stats "top misses" review session
  const [reviewIds, setReviewIds] = useState(null);

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

  // filtered card order for the current category — shuffled (with a stable
  // seed, so it doesn't reorder on unrelated re-renders) when that setting is on
  const filtered = useMemo(() => {
    const base = reviewIds
      ? cards.filter(c => reviewIds.includes(c.id))
      : (activeCategory === ALL_CATEGORY ? cards : cards.filter(c => c.category === activeCategory));
    if (!settings.shuffle) return base;
    const arr = [...base];
    let seed = shuffleSeed || 1;
    const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [cards, activeCategory, reviewIds, settings.shuffle, shuffleSeed]);

  const currentCard = filtered[index] || filtered[0];
  const colors = currentCard ? getCat(currentCard.category) : getCat('Custom');

  // persist cards
  useEffect(() => { localStorage.setItem('fc_v5', JSON.stringify(cards)); }, [cards]);

  // persist mastered ids
  useEffect(() => { localStorage.setItem('fc_mastered_v2', JSON.stringify(masteredIds)); }, [masteredIds]);

  // persist settings
  useEffect(() => { localStorage.setItem('fc_settings_v1', JSON.stringify(settings)); }, [settings]);

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

  // reset index on category change (and deal a fresh shuffle order); also
  // exits an active "top misses" review session, since it was scoped to a
  // specific set of card ids rather than this category
  useEffect(() => { setIndex(0); setFlipped(false); setShuffleSeed(s => s + 1); setReviewIds(null); }, [activeCategory]);

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
    logAttempt(cardId, result);
    if (result === 'know') {
      setMasteredIds(prev => prev.includes(cardId) ? prev : [...prev, cardId]);
    }
    nextCard();
  };

  const resetSession = () => { setResults({}); setIndex(0); setFlipped(false); setShuffleSeed(s => s + 1); };

  // full progress reset (Settings) — clears mastery on top of the session
  const resetProgress = () => {
    setMasteredIds([]);
    setResults({});
    setIndex(0);
    setFlipped(false);
    setJustReset(true);
    setTimeout(() => setJustReset(false), 1600);
  };

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

  const addCardsBulk = (newCards) => {
    if (!newCards || newCards.length === 0) return;
    const withIds = newCards.map((c, i) => ({
      id: Date.now() + i,
      question: c.question,
      answer: c.answer,
      category: c.category || 'Custom',
    }));
    setCards(prev => [...prev, ...withIds]);
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

  // overall mastery across all cards (for Stats view) — filter out mastered
  // ids left over from cards that no longer exist (e.g. a removed category),
  // so stale progress data doesn't inflate the percentage
  const currentCardIds = new Set(cards.map(c => c.id));
  const activeMasteredIds = masteredIds.filter(id => currentCardIds.has(id));
  const overallMastery = cards.length ? Math.round((activeMasteredIds.length / cards.length) * 100) : 0;

  // ── LEVEL / MAP LOGIC ──────────────────────────────
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

  // starts a study session scoped to a specific set of cards (e.g. the
  // Stats "top misses" panel), rather than a whole category
  const startReview = (missedCards) => {
    setReviewIds(missedCards.map(c => c.id));
    setResults({});
    setIndex(0);
    setFlipped(false);
    setCameFromMap(false);
    setView(VIEWS.STUDY);
  };

  // settings handlers
  const toggleSetting = (key) => {
    setSettings(s => ({ ...s, [key]: !s[key] }));
    if (key === 'shuffle') setShuffleSeed(x => x + 1);
  };
  const setBgMotif = (bgMotif) => setSettings(s => ({ ...s, bgMotif }));
  const setBgDensity = (bgDensity) => setSettings(s => ({ ...s, bgDensity }));

  const completeOnboarding = () => {
    setShowOnboarding(false);
    try { localStorage.setItem('fc_onboarded_v1', '1'); } catch { /* best-effort persistence */ }
  };

  const navBtn = (label, v) => (
    <button key={v} onClick={() => setView(v)} className="fc-tap" style={{
      flex: isDesktop ? 'none' : '1',
      fontFamily: FONTS.sans,
      padding: isDesktop ? '11px 16px' : '9px 6px',
      borderRadius: isDesktop ? '10px' : '8px',
      border: 'none', cursor: 'pointer',
      background: view === v ? ACCENT : 'transparent',
      color: view === v ? '#14120b' : INK.mutedGoldGrey,
      fontSize: isDesktop ? '14px' : '11px',
      fontWeight: view === v ? '700' : '400',
      letterSpacing: isDesktop ? 'normal' : '1px',
      textTransform: isDesktop ? 'none' : 'uppercase',
      textAlign: isDesktop ? 'left' : 'center',
      width: isDesktop ? '100%' : 'auto',
    }}>{label}</button>
  );

  const content = (
    <>
      {/* ── HOME VIEW ── */}
      {view === VIEWS.HOME && (
        <HomeView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          accent={ACCENT}
          cardsCount={cards.length}
          masteredCount={activeMasteredIds.length}
          streakCount={streak.count}
          onStartStudying={() => setView(VIEWS.STUDY)}
        />
      )}

      {/* ── MAP VIEW ── */}
      {view === VIEWS.MAP && (
        <MapView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          cards={cards}
          masteredIds={masteredIds}
          isLevelUnlocked={isLevelUnlocked}
          isLevelComplete={isLevelComplete}
          enterLevel={enterLevel}
        />
      )}

      {/* ── STUDY VIEW ── */}
      {view === VIEWS.STUDY && (
        <StudyView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          accent={ACCENT}
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
          reduceMotion={settings.reduceMotion}
          questionSerif={true}
          answerTab={answerTab}
          setAnswerTab={setAnswerTab}
          markCard={markCard}
          prevCard={prevCard}
          nextCard={nextCard}
        />
      )}

      {/* ── STATS VIEW ── */}
      {view === VIEWS.STATS && (
        <StatsView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          accent={ACCENT}
          cards={cards}
          masteredIds={activeMasteredIds}
          streak={streak}
          overallMastery={overallMastery}
          onStartReview={startReview}
        />
      )}

      {/* ── MANAGE VIEW ── */}
      {view === VIEWS.MANAGE && (
        <ManageView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          accent={ACCENT}
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
          addCardsBulk={addCardsBulk}
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

      {/* ── SETTINGS VIEW ── */}
      {view === VIEWS.SETTINGS && (
        <SettingsView
          isDesktop={isDesktop}
          isLarge={isLarge}
          isXLarge={isXLarge}
          settings={settings}
          onToggle={toggleSetting}
          onMotifChange={setBgMotif}
          onDensityChange={setBgDensity}
          resetProgress={resetProgress}
          justReset={justReset}
        />
      )}
    </>
  );

  // widest a view's own content ever gets (matches StatsView, the widest view)
  const sidebarW = isXLarge ? 232 : isLarge ? 200 : 168;
  const gapW = isXLarge ? 56 : isLarge ? 44 : 32;
  const contentMaxW = isXLarge ? 960 : isLarge ? 760 : 640;
  const containerMaxW = sidebarW + gapW + contentMaxW;

  // base padding for the outer app wrapper, combined below with safe-area
  // insets so content clears the notch, rounded corners, and home indicator
  const basePadV = isXLarge ? 64 : isLarge ? 56 : isDesktop ? 40 : 20;
  const basePadH = isXLarge ? 80 : isLarge ? 56 : isDesktop ? 40 : 16;

  return (
    <div style={{
      position: 'relative', fontFamily: FONTS.sans, minHeight: '100vh', background: PAGE_BG, color: INK.cream, boxSizing: 'border-box',
      paddingTop: `calc(${basePadV}px + env(safe-area-inset-top))`,
      paddingBottom: `calc(${basePadV}px + env(safe-area-inset-bottom))`,
      paddingLeft: `calc(${basePadH}px + env(safe-area-inset-left))`,
      paddingRight: `calc(${basePadH}px + env(safe-area-inset-right))`,
    }}>
      <MotifBackground motif={settings.bgMotif} density={settings.bgDensity} reduceMotion={settings.reduceMotion} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: isDesktop ? `${containerMaxW}px` : '520px', margin: '0 auto' }}>

        {showOnboarding ? (
          <OnboardingView accent={ACCENT} onComplete={completeOnboarding} />
        ) : (
          <>
            {/* Header */}
            <div style={{
              display:'flex', flexDirection: isDesktop ? 'row' : 'column',
              alignItems: isDesktop ? 'center' : 'stretch',
              gap: isDesktop ? '0' : '12px',
              marginBottom: isLarge ? '40px' : isDesktop ? '32px' : '20px',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', gap:'12px' }}>
                <div>
                  <h1 style={{ fontFamily: FONTS.serif, fontSize: isXLarge ? '32px' : isLarge ? '28px' : isDesktop ? '24px' : '20px', fontWeight:'600', margin:0, letterSpacing:'-0.3px' }}>Flashcards</h1>
                  <p style={{ fontFamily: FONTS.sans, fontSize: isDesktop ? '10.5px' : '10px', letterSpacing:'1.5px', textTransform:'uppercase', color: INK.mutedGoldGrey, margin:'3px 0 0' }}>{cards.length} cards · {streak.count} day streak</p>
                </div>
                <button onClick={() => setView(VIEWS.SETTINGS)} className="fc-tap" style={{
                  flexShrink: 0, width:'40px', height:'40px', borderRadius:'50%', border: `1px solid ${INK.hairlineStrong}`,
                  background:'transparent', color: INK.mutedGoldGrey, fontSize:'17px', cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>⚙</button>
              </div>
              {!isDesktop && (
                <div className="scrollx" style={{ display:'flex', gap:'4px', background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius:'12px', padding:'5px', width:'100%', boxSizing:'border-box', overflowX: 'auto' }}>
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
                <div style={{ display:'flex', flexDirection:'column', gap: isLarge ? '6px' : '4px', background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius:'14px', padding: isXLarge ? '18px' : isLarge ? '14px' : '10px', width: isXLarge ? '232px' : isLarge ? '200px' : '168px', flexShrink:0, position:'sticky', top: isLarge ? '56px' : '40px' }}>
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
          </>
        )}

      </div>
    </div>
  );
}
