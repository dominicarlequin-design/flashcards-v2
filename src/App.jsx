import { useState, useEffect, useMemo } from 'react';
import { useIsDesktop } from './hooks/useBreakpoints';
import HomeView from './components/views/HomeView';
import StudyView from './components/views/StudyView';
import ResultsView from './components/views/ResultsView';
import ProgressView from './components/views/ProgressView';
import SettingsView from './components/views/SettingsView';
import { DECKS, ALL_CARDS, getDeck } from './data/decks';
import { newProgress, isDue, review, todayStr, addDaysStr, MAX_BOX } from './utils/leitner';
import { INK, FONTS, SHADOWS, RADII, getDeckColor } from './constants/theme';
import { VIEWS } from './constants/views';

const DEFAULT_SETTINGS = { dailyGoal: 20, remindersOn: true, soundOn: true };

function loadJSON(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

// small classical-column mark used as the desktop sidebar logo
function PillarMark({ color, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="16" height="2.4" rx="0.6" fill={color} />
      <rect x="4" y="18.6" width="16" height="2.4" rx="0.6" fill={color} />
      <rect x="6.2" y="6.2" width="2" height="12.4" fill={color} />
      <rect x="11" y="6.2" width="2" height="12.4" fill={color} />
      <rect x="15.8" y="6.2" width="2" height="12.4" fill={color} />
    </svg>
  );
}

export default function App() {
  const isDesktop = useIsDesktop();

  const [view, setView] = useState(VIEWS.HOME);

  const [progress, setProgress] = useState(() => loadJSON('fc2_progress', {}));
  const [streak, setStreak] = useState(() => loadJSON('fc2_streak', { count: 0, lastDate: '' }));
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadJSON('fc2_settings', {}) }));
  const [history, setHistory] = useState(() => loadJSON('fc2_history', {})); // { [dateStr]: reviewCount }

  const [sessionQueue, setSessionQueue] = useState([]); // array of card ids
  const [sessionIndex, setSessionIndex] = useState(0);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionReviewed, setSessionReviewed] = useState(0);

  useEffect(() => { localStorage.setItem('fc2_progress', JSON.stringify(progress)); }, [progress]);
  useEffect(() => { localStorage.setItem('fc2_streak', JSON.stringify(streak)); }, [streak]);
  useEffect(() => { localStorage.setItem('fc2_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('fc2_history', JSON.stringify(history)); }, [history]);

  const today = todayStr();

  // every card, tagged with its deck's color/name and current progress
  const cardsWithMeta = useMemo(() => ALL_CARDS.map(card => {
    const deck = getDeck(card.deckId);
    return {
      ...card,
      deckName: deck.name,
      deckColor: getDeckColor(card.deckId),
      progressEntry: progress[card.id] || null,
    };
  }), [progress]);

  const dueCardIds = useMemo(
    () => cardsWithMeta.filter(c => isDue(c.progressEntry, today)).map(c => c.id),
    [cardsWithMeta, today]
  );

  const decksForHome = useMemo(() => DECKS.map(deck => {
    const cards = cardsWithMeta.filter(c => c.deckId === deck.id);
    const dueCount = cards.filter(c => isDue(c.progressEntry, today)).length;
    const avgBox = cards.reduce((sum, c) => sum + (c.progressEntry?.box || 1), 0) / cards.length;
    const masteryPct = Math.round(((avgBox - 1) / (MAX_BOX - 1)) * 100);
    return { id: deck.id, name: deck.name, color: getDeckColor(deck.id), cardCount: cards.length, dueCount, masteryPct };
  }), [cardsWithMeta, today]);

  const totalReviewed = useMemo(() => Object.values(history).reduce((a, b) => a + b, 0), [history]);

  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = addDaysStr(today, -i);
      days.push({ date: d, count: history[d] || 0 });
    }
    return days;
  }, [today, history]);

  // --- study session ---
  const startSession = (cardIds) => {
    if (!cardIds.length) return;
    setSessionQueue(cardIds);
    setSessionIndex(0);
    setSessionKnown(0);
    setSessionReviewed(0);
    setView(VIEWS.STUDY);
  };

  const onStartReview = () => startSession(dueCardIds);

  const onSelectDeck = (deckId) => {
    const deckDue = cardsWithMeta.filter(c => c.deckId === deckId && isDue(c.progressEntry, today)).map(c => c.id);
    const deckAll = cardsWithMeta.filter(c => c.deckId === deckId).map(c => c.id);
    startSession(deckDue.length ? deckDue : deckAll);
  };

  const currentCard = sessionQueue.length ? cardsWithMeta.find(c => c.id === sessionQueue[sessionIndex]) : null;

  const onAnswer = (known) => {
    const cardId = sessionQueue[sessionIndex];
    setProgress(prev => ({ ...prev, [cardId]: review(prev[cardId] || newProgress(today), known, today) }));
    setHistory(prev => ({ ...prev, [today]: (prev[today] || 0) + 1 }));
    setSessionReviewed(n => n + 1);
    if (known) setSessionKnown(n => n + 1);

    setStreak(prev => {
      if (prev.lastDate === today) return prev;
      const yesterday = addDaysStr(today, -1);
      return { count: prev.lastDate === yesterday ? prev.count + 1 : 1, lastDate: today };
    });

    if (sessionIndex + 1 >= sessionQueue.length) {
      setView(VIEWS.RESULTS);
    } else {
      setSessionIndex(i => i + 1);
    }
  };

  const onExitStudy = () => setView(VIEWS.HOME);
  const onDoneResults = () => setView(VIEWS.HOME);

  const resetProgress = () => {
    setProgress({});
    setStreak({ count: 0, lastDate: '' });
    setHistory({});
  };

  const navItems = [
    { v: VIEWS.HOME, label: 'Home' },
    { v: VIEWS.PROGRESS, label: 'Progress' },
    { v: VIEWS.SETTINGS, label: 'Settings' },
  ];

  const screen = (() => {
    switch (view) {
      case VIEWS.STUDY:
        return currentCard ? (
          <StudyView card={currentCard} index={sessionIndex} total={sessionQueue.length} onAnswer={onAnswer} onExit={onExitStudy} />
        ) : null;
      case VIEWS.RESULTS:
        return <ResultsView reviewed={sessionReviewed} known={sessionKnown} onDone={onDoneResults} />;
      case VIEWS.PROGRESS:
        return <ProgressView isDesktop={isDesktop} streakCount={streak.count} totalReviewed={totalReviewed} last7Days={last7Days} decks={decksForHome} />;
      case VIEWS.SETTINGS:
        return (
          <SettingsView
            isDesktop={isDesktop}
            dailyGoal={settings.dailyGoal}
            onDailyGoalChange={v => setSettings(s => ({ ...s, dailyGoal: v }))}
            remindersOn={settings.remindersOn}
            onToggleReminders={() => setSettings(s => ({ ...s, remindersOn: !s.remindersOn }))}
            soundOn={settings.soundOn}
            onToggleSound={() => setSettings(s => ({ ...s, soundOn: !s.soundOn }))}
            onResetProgress={resetProgress}
          />
        );
      case VIEWS.HOME:
      default:
        return (
          <HomeView
            isDesktop={isDesktop}
            streakCount={streak.count}
            dueTodayCount={dueCardIds.length}
            decks={decksForHome}
            onStartReview={onStartReview}
            onSelectDeck={onSelectDeck}
          />
        );
    }
  })();

  const focusedMode = view === VIEWS.STUDY || view === VIEWS.RESULTS; // hide chrome during a session

  const panel = (
    <div style={{
      background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel,
      boxShadow: SHADOWS.panel, flex: 1, minHeight: 0, padding: isDesktop ? '36px' : '20px',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'column',
    }}>
      {screen}
    </div>
  );

  if (!isDesktop) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: INK.bg, fontFamily: FONTS.sans }}>
        <div style={{ flex: 1, minHeight: 0, padding: '18px 16px', display: 'flex', flexDirection: 'column' }}>
          {panel}
        </div>
        {!focusedMode && (
          <div style={{
            display: 'flex', borderTop: `1px solid ${INK.border}`, background: INK.panel,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}>
            {navItems.map(item => (
              <button key={item.v} onClick={() => setView(item.v)} className="fc-tap" style={{
                flex: 1, background: 'none', border: 'none', padding: '12px 0 10px', cursor: 'pointer',
                fontFamily: FONTS.sans, fontSize: '11px', fontWeight: view === item.v ? '700' : '400',
                letterSpacing: '.5px', color: view === item.v ? INK.accent : INK.inkFaint,
              }}>{item.label}</button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', background: INK.bg, fontFamily: FONTS.sans, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: SHADOWS.glow(INK.accent), pointerEvents: 'none' }} />

      {!focusedMode && (
        <aside style={{
          position: 'relative', width: '240px', flexShrink: 0, display: 'flex', flexDirection: 'column',
          padding: '32px 20px', borderRight: `1px solid ${INK.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
            <PillarMark color={INK.accent} />
            <span style={{ fontFamily: FONTS.serif, fontSize: '19px', fontWeight: '600', color: INK.ink }}>Flashcards</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map(item => (
              <button key={item.v} onClick={() => setView(item.v)} className="fc-tap fc-lift" style={{
                textAlign: 'left', padding: '11px 14px', borderRadius: RADII.sm, border: 'none', cursor: 'pointer',
                fontFamily: FONTS.sans, fontSize: '14px', fontWeight: view === item.v ? '700' : '500',
                background: view === item.v ? INK.panel : 'transparent',
                color: view === item.v ? INK.accent : INK.inkMuted,
                boxShadow: view === item.v ? SHADOWS.panel : 'none',
              }}>{item.label}</button>
            ))}
          </nav>

          <div style={{ display: 'flex', gap: '14px', paddingTop: '16px', borderTop: `1px solid ${INK.border}` }}>
            <div>
              <p style={{ fontFamily: FONTS.serif, fontSize: '17px', fontWeight: '600', color: INK.ink, margin: 0 }}>🔥 {streak.count}</p>
              <p style={{ fontFamily: FONTS.sans, fontSize: '10px', color: INK.inkFaint, margin: 0 }}>Streak</p>
            </div>
            <div>
              <p style={{ fontFamily: FONTS.serif, fontSize: '17px', fontWeight: '600', color: INK.ink, margin: 0 }}>{totalReviewed}</p>
              <p style={{ fontFamily: FONTS.sans, fontSize: '10px', color: INK.inkFaint, margin: 0 }}>Reviewed</p>
            </div>
          </div>
        </aside>
      )}

      <main style={{ position: 'relative', flex: 1, minWidth: 0, padding: '40px', display: 'flex', flexDirection: 'column' }}>
        {panel}
      </main>
    </div>
  );
}
