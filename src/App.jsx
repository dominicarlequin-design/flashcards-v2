import { useState, useEffect, useCallback, useRef } from 'react';

const ALL_CATEGORY = 'All';
const LEVEL_ORDER = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'React'];

const starterCards = [
  { id: 101, question: "What year was JavaScript created?", answer: "1995", category: "JavaScript" },
  { id: 102, question: "Who created JavaScript?", answer: "Brendan Eich", category: "JavaScript" },
  { id: 103, question: "What keyword declares a block-scoped variable?", answer: "let (or const)", category: "JavaScript" },
  { id: 104, question: "What does '===' check that '==' doesn't?", answer: "Type, in addition to value", category: "JavaScript" },
  { id: 105, question: "What object represents the browser's document?", answer: "The DOM", category: "JavaScript" },
  { id: 106, question: "What is a Promise used for?", answer: "Handling asynchronous operations", category: "JavaScript" },
  { id: 107, question: "What runtime lets JavaScript run outside the browser?", answer: "Node.js", category: "JavaScript" },
  { id: 108, question: "What method converts JSON text into an object?", answer: "JSON.parse()", category: "JavaScript" },
  { id: 201, question: "Who created Python?", answer: "Guido van Rossum", category: "Python" },
  { id: 202, question: "What year was Python first released?", answer: "1991", category: "Python" },
  { id: 203, question: "What symbol starts a comment in Python?", answer: "#", category: "Python" },
  { id: 204, question: "What keyword defines a function in Python?", answer: "def", category: "Python" },
  { id: 205, question: "What data structure uses curly braces {} by default?", answer: "A dictionary (dict)", category: "Python" },
  { id: 206, question: "What tool manages Python virtual environments?", answer: "venv (or virtualenv)", category: "Python" },
  { id: 207, question: "What does PEP stand for?", answer: "Python Enhancement Proposal", category: "Python" },
  { id: 208, question: "What popular framework is used for Python web apps?", answer: "Django (or Flask)", category: "Python" },
  { id: 301, question: "Who created Java?", answer: "James Gosling", category: "Java" },
  { id: 302, question: "What year was Java released?", answer: "1995", category: "Java" },
  { id: 303, question: "What does JVM stand for?", answer: "Java Virtual Machine", category: "Java" },
  { id: 304, question: "What keyword is used to inherit a class in Java?", answer: "extends", category: "Java" },
  { id: 305, question: "What method is the entry point of a Java program?", answer: "public static void main(String[] args)", category: "Java" },
  { id: 306, question: "What company originally developed Java?", answer: "Sun Microsystems", category: "Java" },
  { id: 307, question: "What build tool commonly manages Java dependencies?", answer: "Maven (or Gradle)", category: "Java" },
  { id: 401, question: "Who created C++?", answer: "Bjarne Stroustrup", category: "C++" },
  { id: 402, question: "What year was C++ introduced?", answer: "1985", category: "C++" },
  { id: 403, question: "What language is C++ an extension of?", answer: "C", category: "C++" },
  { id: 404, question: "What keyword creates a class in C++?", answer: "class", category: "C++" },
  { id: 405, question: "What operator allocates memory dynamically in C++?", answer: "new", category: "C++" },
  { id: 406, question: "What does STL stand for?", answer: "Standard Template Library", category: "C++" },
  { id: 501, question: "What company created Go?", answer: "Google", category: "Go" },
  { id: 502, question: "What year was Go released?", answer: "2009", category: "Go" },
  { id: 503, question: "What keyword declares a variable in Go?", answer: "var (or :=)", category: "Go" },
  { id: 504, question: "What does Go use instead of classes for behavior?", answer: "Structs and interfaces", category: "Go" },
  { id: 505, question: "What keyword starts a lightweight concurrent thread in Go?", answer: "go", category: "Go" },
  { id: 506, question: "What is Go's package manager/build tool called?", answer: "go modules (go mod)", category: "Go" },
  { id: 601, question: "Who created React?", answer: "Jordan Walke (at Facebook)", explain: "A guy named Jordan Walke made it! He worked at a company called Facebook. Imagine you build a cool toy \u2014 that's what he did, but with code instead of plastic!", category: "React" },
  { id: 602, question: "What year was React open-sourced?", answer: "2013", explain: "That means Facebook said 'hey everyone, you can use our toy too, for free!' Like sharing your favorite crayons with the whole class.", category: "React" },
  { id: 603, question: "What syntax extension lets you write HTML-like code in JS?", answer: "JSX", explain: "It's like mixing peanut butter (HTML) and jelly (JavaScript) into one yummy sandwich so you can write them together in the same spot.", category: "React" },
  { id: 604, question: "What hook lets you add state to a function component?", answer: "useState", explain: "Think of it like a magic backpack. You put a toy (a value) in the backpack, and whenever you swap the toy, React notices and redraws the picture on screen.", category: "React" },
  { id: 605, question: "What hook runs side effects after render?", answer: "useEffect", explain: "It's like a little helper robot that waits until you're done drawing your picture, then runs off to do a chore \u2014 like fetching juice from the fridge \u2014 after the picture is on the wall.", category: "React" },
  { id: 606, question: "What virtual structure does React use to optimize DOM updates?", answer: "The Virtual DOM", explain: "Imagine you have a pretend drawing on scratch paper before you draw on the REAL wall. React scribbles on scratch paper first, checks what changed, then only fixes the real wall where needed \u2014 way faster than redrawing everything!", category: "React" },
  { id: 607, question: "What prop must every item in a list have?", answer: "A unique key", explain: "It's like giving every kid in class their own name tag, so the teacher (React) doesn't mix up who is who when the line moves around.", category: "React" },
  { id: 608, question: "What company maintains React?", answer: "Meta (Facebook)", explain: "That's the new name for Facebook! Like when your favorite toy company changes its name but still makes your favorite toys.", category: "React" },
  { id: 609, question: "What do you call a function that returns JSX?", answer: "A (function) component", explain: "It's like a little recipe card \u2014 you follow the steps (the function) and out pops a yummy cookie (the UI) at the end!", category: "React" },
  { id: 610, question: "What hook memoizes an expensive calculation?", answer: "useMemo", explain: "Imagine solving a REALLY hard math puzzle once, writing the answer on a sticky note, and just peeking at the sticky note next time instead of solving it all over again. Saves your brain energy!", category: "React" },
  { id: 611, question: "What hook memoizes a function reference?", answer: "useCallback", explain: "It's like keeping the SAME toy in your hand instead of grabbing a brand new copy of it every single time \u2014 so your friends (other parts of the app) recognize it's the same toy and don't get confused.", category: "React" },
  { id: 612, question: "What hook accesses a value from Context?", answer: "useContext", explain: "Imagine a walkie-talkie channel the whole family shares. Instead of passing a note hand-to-hand through every room, everyone can just listen to the same channel and hear the message instantly.", category: "React" },
  { id: 613, question: "What hook gives direct access to a DOM node or persists a mutable value?", answer: "useRef", explain: "It's like a sticky note you can write on and peek at anytime, but writing on it does NOT make React redraw the picture \u2014 it's your own secret notepad.", category: "React" },
  { id: 614, question: "What is 'props' short for?", answer: "Properties", explain: "Think of props like a gift box a parent hands to a kid. The parent (component) packs stuff inside, and the kid (child component) gets to use what's in the box, but can't change what's inside.", category: "React" },
  { id: 615, question: "Are props mutable or immutable inside a component?", answer: "Immutable (read-only)", explain: "It's like getting a birthday card: you can READ it and enjoy it, but you can't scribble new words into someone else's card.", category: "React" },
  { id: 616, question: "What term describes data flowing from parent to child only?", answer: "One-way (unidirectional) data flow", explain: "Picture water flowing down a slide \u2014 it only goes one direction, from the top (parent) down to the bottom (child), never back up.", category: "React" },
  { id: 617, question: "What special prop lets a component render nested elements?", answer: "children", explain: "It's like a big empty gift box shape \u2014 whatever toy you slide inside it (any nested stuff), the box just displays it right there in the middle.", category: "React" },
  { id: 618, question: "What is a 'controlled component'?", answer: "A form element whose value is driven by React state", explain: "A form (like a text box) where REACT is the boss of what's typed in it \u2014 like a puppet where React is holding all the strings and deciding exactly what shows.", category: "React" },
  { id: 619, question: "What is an 'uncontrolled component'?", answer: "A form element that manages its own state via the DOM", explain: "A form that does its own thing without React bossing it around every keystroke \u2014 like a toy car that drives on its own without you steering it the whole time.", category: "React" },
  { id: 620, question: "What React API lets you share data without prop drilling?", answer: "Context API", explain: "Like a loudspeaker in a school \u2014 instead of whispering a message kid-to-kid down a long hallway, you just announce it once and every room hears it.", category: "React" },
  { id: 621, question: "What term describes passing props through many layers unnecessarily?", answer: "Prop drilling", explain: "Imagine passing a note through 10 friends standing in a line just so the 10th friend gets it \u2014 tiring and silly when you could just shout it instead (that's why Context helps)!", category: "React" },
  { id: 622, question: "What lifecycle concept do useEffect's cleanup functions handle?", answer: "Unmounting / cleanup", explain: "It's like cleaning up your blocks and putting toys away BEFORE you leave the room, so nothing's left making a mess after you're gone.", category: "React" },
  { id: 623, question: "What array param in useEffect controls when it re-runs?", answer: "The dependency array", explain: "It's like a checklist \u2014 useEffect only runs its little chore again if something on the checklist actually changed. No changes? No re-run \u2014 it just naps.", category: "React" },
  { id: 624, question: "What is 'reconciliation' in React?", answer: "The diffing process that updates the real DOM to match the Virtual DOM", explain: "React compares the OLD scratch-paper drawing to the NEW scratch-paper drawing, spots exactly what's different, and then only touches those exact spots on the real wall \u2014 super efficient!", category: "React" },
  { id: 625, question: "What algorithm powers React's reconciliation?", answer: "The diffing algorithm (Fiber)", explain: "Think of it like a detective comparing two 'spot the difference' pictures super fast to find just the tiny changes.", category: "React" },
  { id: 626, question: "What is React Fiber?", answer: "React's internal reconciliation engine/rendering architecture", explain: "It's React's inner engine \u2014 like the engine inside a toy car. You don't see it, but it's what makes everything move, pause, and restart smoothly without freezing up.", category: "React" },
  { id: 627, question: "What do you call a component defined as a JavaScript class extending React.Component?", answer: "A class component", explain: "It's an older, fancier way to build a component \u2014 like using a big recipe book with lots of chapters instead of one quick index card (that's what function components are).", category: "React" },
  { id: 628, question: "What method renders UI in a class component?", answer: "render()", explain: "It's the special chapter in that recipe book that says 'here's exactly what to draw on the picture' \u2014 every class component MUST have this chapter.", category: "React" },
  { id: 629, question: "What lifecycle method runs once after a class component mounts?", answer: "componentDidMount", explain: "It's like the moment right after you finish building a Lego tower \u2014 'ta-da, I'm done building, now let's go play with it!'", category: "React" },
  { id: 630, question: "What lifecycle method runs right before a component unmounts?", answer: "componentWillUnmount", explain: "It's the moment right before your Lego tower gets knocked down \u2014 your last chance to save pieces or say goodbye before it's gone.", category: "React" },
  { id: 631, question: "What term describes a component with no internal state?", answer: "A stateless (presentational) component", explain: "Like a poster on the wall \u2014 it just shows a picture, it doesn't remember anything or change on its own.", category: "React" },
  { id: 632, question: "What pattern lets you reuse component logic by passing a function as a prop?", answer: "Render props", explain: "Imagine handing a friend instructions (a function) instead of a finished toy, and they use YOUR instructions to build their own version of it.", category: "React" },
  { id: 633, question: "What was the pattern for sharing logic before hooks existed?", answer: "Higher-Order Components (HOCs)", explain: "Think of it like wrapping a plain gift (component) inside fancy wrapping paper (another component) that adds extra powers to it.", category: "React" },
  { id: 634, question: "What is a 'custom hook'?", answer: "A reusable function starting with 'use' that calls other hooks", explain: "It's a hook YOU make yourself! Like inventing your own secret recipe by mixing other recipes (hooks) together into one reusable snack.", category: "React" },
  { id: 635, question: "What does 'declarative UI' mean in React's philosophy?", answer: "Describing what the UI should look like, not how to update it step by step", explain: "You just say WHAT you want ('I want a red button') instead of giving step-by-step directions on HOW to draw it pixel by pixel. React figures out the 'how' part for you!", category: "React" },
  { id: 636, question: "What tool bundles/serves modern React apps quickly in dev?", answer: "Vite (or Webpack)", explain: "Think of it like a super-fast helper that gathers all your toy pieces (files) and puts them together neatly so your app can run in the browser.", category: "React" },
  { id: 637, question: "What React feature lets components be split and loaded on demand?", answer: "Code splitting (React.lazy)", explain: "It's like only bringing out the toys you need to play with RIGHT NOW, instead of dragging your entire toybox into the room all at once.", category: "React" },
  { id: 638, question: "What component wraps lazy-loaded components to show a fallback?", answer: "Suspense", explain: "It's like holding up a 'please wait, loading...' sign while your friend (the lazy component) is still getting their toy out of the closet.", category: "React" },
  { id: 639, question: "What hook lets you opt a value out of a low-priority re-render?", answer: "useTransition", explain: "It's like telling React 'hey, this update isn't super urgent, feel free to finish more important stuff first and get to this a little later.'", category: "React" },
  { id: 640, question: "What React 18 feature batches multiple state updates automatically?", answer: "Automatic batching", explain: "Instead of running to the store five separate times for five snacks, React waits, bundles all five snack requests together, and makes just ONE trip \u2014 way more efficient!", category: "React" },
  { id: 641, question: "What is a 'fragment' used for in React?", answer: "Grouping children without adding an extra DOM node", explain: "It lets you group a few things together WITHOUT needing an extra wrapping box around them. Like holding three toys with just your two hands \u2014 no need for a basket you don't actually want.", category: "React" },
  { id: 642, question: "What shorthand syntax represents a Fragment?", answer: "<></>", explain: "Empty angle brackets! It's like an invisible see-through box: it holds your toys together but you can't even see it's there.", category: "React" },
  { id: 643, question: "What is 'lifting state up'?", answer: "Moving shared state to the closest common ancestor component", explain: "It means moving a shared toy (state) up to the closest grown-up (parent component) who can hand it down to BOTH kids that need to play with it together.", category: "React" },
  { id: 644, question: "What does 'React.memo' do?", answer: "Memoizes a component to skip re-rendering when props are unchanged", explain: "It's like telling a component 'hey, if nothing about your toys changed, don't bother redrawing your picture again \u2014 just chill and reuse the old one.' Saves time and energy!", category: "React" },
  { id: 645, question: "What is a 'side effect' in React?", answer: "An operation that affects something outside the component (e.g. fetching, subscriptions)", explain: "It's anything that reaches OUTSIDE your component's own little world \u2014 like calling someone on the phone, grabbing data from the internet, or setting a timer. It's a 'side quest' outside the main drawing job.", category: "React" },
  { id: 646, question: "What framework built on React adds server-side rendering and routing?", answer: "Next.js", explain: "Imagine React is your box of Lego bricks, and Next.js is the fancy instruction booklet PLUS extra special pieces that help you build a whole Lego city faster.", category: "React" },
  { id: 647, question: "What does SSR stand for?", answer: "Server-Side Rendering", explain: "It means the picture gets drawn on a big far-away computer (the server) FIRST, then mailed to you already finished \u2014 so you see it super quick instead of waiting for your own device to draw it from scratch.", category: "React" },
  { id: 648, question: "What React concept describes a component re-rendering due to state or prop changes?", answer: "Re-rendering", explain: "It's like erasing your drawing a tiny bit and redrawing just the part that changed, every time your toy (state) or gift box (props) gets updated.", category: "React" },
];

const CATEGORY_COLORS = {
  JavaScript: { bg: '#2d2a0e', accent: '#facc15', pill: '#4a4400' },
  Python:     { bg: '#0d2a1a', accent: '#4ade80', pill: '#0a3320' },
  Java:       { bg: '#2d1b0e', accent: '#fb923c', pill: '#4a2800' },
  'C++':      { bg: '#1e1533', accent: '#a78bfa', pill: '#2f2050' },
  Go:         { bg: '#0d2137', accent: '#38bdf8', pill: '#0c3251' },
  React:      { bg: '#0e2530', accent: '#61dafb', pill: '#0a3c4a' },
  Custom:     { bg: '#1e1a14', accent: '#fbbf24', pill: '#362d10' },
};
const CATEGORY_EMOJI = { JavaScript:'\u{1F7E8}', Python:'\u{1F40D}', Java:'\u2615', 'C++':'\u2795', Go:'\u{1F439}', React:'\u269B\uFE0F', Custom:'\u2728' };
const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Custom;

// \u2500\u2500 views \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const VIEWS = { HOME: 'home', MAP: 'map', STUDY: 'study', STATS: 'stats', MANAGE: 'manage' };

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

// wide desktop (e.g. MacBook Pro 14"/16" \u2014 1512px+/1728px+ viewports)
function useIsLarge() {
  const [isLarge, setIsLarge] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  useEffect(() => {
    const fn = () => setIsLarge(window.innerWidth >= 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isLarge;
}

// very wide desktop (MacBook Pro 16" and bigger external displays)
function useIsXLarge() {
  const [isXLarge, setIsXLarge] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1440);
  useEffect(() => {
    const fn = () => setIsXLarge(window.innerWidth >= 1440);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isXLarge;
}

function BrainCanvas({ size }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;

    // Two-hemisphere brain silhouette: nodes distributed by rejection sampling
    // inside a superellipse-ish brain outline, split by a central longitudinal groove.
    const brainR = size * 0.46;
    const inBrain = (x, y) => {
      const nx = (x - cx) / brainR, ny = (y - cy - size * 0.01) / (brainR * 0.82);
      const lobe = nx < 0 ? nx + 0.06 : nx - 0.06; // groove gap
      const d = lobe * lobe * 1.05 + ny * ny * 1.15;
      return d < 1;
    };

    const nodes = [];
    const targetCount = size > 160 ? 46 : size > 130 ? 36 : 26;
    let attempts = 0;
    while (nodes.length < targetCount && attempts < 4000) {
      attempts++;
      const x = cx + (Math.random() * 2 - 1) * brainR;
      const y = cy + (Math.random() * 2 - 1) * brainR * 0.86;
      if (!inBrain(x, y)) continue;
      // keep a minimum spacing so nodes don't clump
      const tooClose = nodes.some(n => (n.baseX - x) ** 2 + (n.baseY - y) ** 2 < (brainR * 0.13) ** 2);
      if (tooClose) continue;
      nodes.push({
        baseX: x, baseY: y, x, y,
        vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
        amp: 1 + Math.random() * 1.6,
        r: 1.6 + Math.random() * 1.6,
      });
    }

    // Connect each node to its nearest neighbors (Delaunay-ish approximation via k-NN)
    const edgeSet = new Set();
    const edges = [];
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((m, j) => ({ j, d: (m.baseX - n.baseX) ** 2 + (m.baseY - n.baseY) ** 2 }))
        .filter(o => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      dists.forEach(({ j, d }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ a: i, b: j, dist: Math.sqrt(d) });
        }
      });
    });

    const particles = edges.map(e => ({
      edge: e,
      t: Math.random(),
      speed: (0.15 + Math.random() * 0.25) / (20 + e.dist),
      warm: Math.random() > 0.45,
    }));

    const CORE_A = '167,139,250';   // violet-400
    const CORE_B = '96,165,250';    // blue-400
    const WARM = '244,182,255';     // light pink-violet for variety

    let raf;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, size, size);

      // ambient halo behind the whole network
      const halo = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.55);
      halo.addColorStop(0, 'rgba(129,140,248,0.10)');
      halo.addColorStop(1, 'rgba(129,140,248,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // simple spring physics: nodes ease back toward a gently orbiting rest point
      nodes.forEach(n => {
        const targetX = n.baseX + Math.cos(t * 0.5 + n.phase) * n.amp;
        const targetY = n.baseY + Math.sin(t * 0.55 + n.phase) * n.amp;
        const ax = (targetX - n.x) * 0.02;
        const ay = (targetY - n.y) * 0.02;
        n.vx = (n.vx + ax) * 0.9;
        n.vy = (n.vy + ay) * 0.9;
        n.x += n.vx;
        n.y += n.vy;
      });

      // dendrites as soft curved connective lines
      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        ctx.strokeStyle = 'rgba(148,163,253,0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx, my, b.x, b.y);
        ctx.stroke();
      });

      // soma (node bodies) with soft glow
      nodes.forEach(n => {
        ctx.save();
        ctx.shadowColor = 'rgba(196,181,253,0.9)';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(216,205,254,0.85)';
        ctx.fill();
        ctx.restore();
      });

      // traveling impulses with additive-style glow + trailing tail
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const a = nodes[p.edge.a], b = nodes[p.edge.b];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const et = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;

        const bez = (tt) => {
          const u = 1 - tt;
          return {
            x: u * u * a.x + 2 * u * tt * mx + tt * tt * b.x,
            y: u * u * a.y + 2 * u * tt * my + tt * tt * b.y,
          };
        };
        const pos = bez(et);
        const hue = p.warm ? WARM : (Math.random() > 0.5 ? CORE_A : CORE_B);

        // tail
        for (let k = 1; k <= 4; k++) {
          const tt = Math.max(0, et - k * 0.035);
          const tp = bez(tt);
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 1.8 - k * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hue},${0.35 - k * 0.07})`;
          ctx.fill();
        }

        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 7);
        glow.addColorStop(0, `rgba(${hue},0.95)`);
        glow.addColorStop(1, `rgba(${hue},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size + 'px', height: size + 'px', display: 'block' }} />;
}

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

  const inputStyle = {
    width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px',
    border: '1px solid #1e2538', background: '#0a0a0f', color: '#e2e8f0', fontSize: '14px',
    fontFamily: 'inherit', marginBottom: '10px',
  };

  const content = (
    <>
      {/* \u2500\u2500 HOME VIEW \u2500\u2500 */}
      {view === VIEWS.HOME && (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight: isDesktop ? '60vh' : '50vh', padding: isDesktop ? '40px 20px' : '20px 10px' }}>
          <div style={{ marginBottom:'20px' }}>
            <BrainCanvas size={isXLarge ? 200 : isDesktop ? 168 : 130} />
          </div>
          <h2 style={{ fontSize: isXLarge ? '44px' : isLarge ? '38px' : isDesktop ? '32px' : '26px', fontWeight:'700', margin:'0 0 12px', letterSpacing:'-1px', color:'#f1f5f9' }}>Flashcards</h2>
          <p style={{ fontSize: isDesktop ? '16px' : '14px', color:'#64748b', margin:'0 0 32px', maxWidth:'420px', lineHeight:1.5 }}>
            Sharpen your knowledge, one card at a time.
          </p>
          <button onClick={() => setView(VIEWS.STUDY)} style={{
            padding: isDesktop ? '16px 36px' : '14px 28px', borderRadius:'999px', border:'none', cursor:'pointer',
            background:'#818cf8', color:'#0a0a0f', fontSize: isDesktop ? '16px' : '15px', fontWeight:'700',
            boxShadow:'0 0 30px #818cf855',
          }}>Start Studying \u2192</button>
        </div>
      )}

      {/* \u2500\u2500 MAP VIEW \u2500\u2500 */}
      {view === VIEWS.MAP && (
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
                  {complete ? '\u2713' : unlocked ? (CATEGORY_EMOJI[cat] || '\u2728') : '\u{1F512}'}
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

      {/* \u2500\u2500 STUDY VIEW \u2500\u2500 */}
      {view === VIEWS.STUDY && (
        <div style={{ maxWidth: isXLarge ? '740px' : isLarge ? '640px' : isDesktop ? '560px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
          {cameFromMap && (
            <button onClick={backToMap} style={{
              marginBottom:'14px', padding:'8px 14px', background:'#111827', border:'1px solid #1e2538',
              borderRadius:'10px', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
            }}>\u2190 Back to Map</button>
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
                  {cat === ALL_CATEGORY ? `\u2726 All` : `${CATEGORY_EMOJI[cat]||'\u2728'} ${cat}`}
                  {cat !== ALL_CATEGORY && m > 0 && <span style={{ marginLeft:'6px', opacity:0.6, fontSize:'11px' }}>{m}%</span>}
                </button>
              );
            })}
          </div>

          {/* Session mini-bar */}
          {sessionCards.length > 0 && (
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px', padding:'10px 14px', background:'#111827', borderRadius:'10px' }}>
              <span style={{ fontSize:'13px', color:'#4ade80', fontWeight:'600' }}>\u2713 {known}</span>
              <span style={{ fontSize:'13px', color:'#f87171', fontWeight:'600' }}>\u2717 {dontKnow}</span>
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
                {results[currentCard.id]==='know' ? '\u2713 Known' : '\u2717 Review'}
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
                  {CATEGORY_EMOJI[currentCard?.category]||'\u2728'} {currentCard?.category}
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

          <p style={{ textAlign:'center', color:'#1e2538', fontSize:'12px', marginBottom:'16px' }}>Tap to flip \u00B7 Arrow keys to navigate</p>

          {flipped && (
            <div style={{ display:'flex', gap:'10px', marginBottom:'16px' }}>
              <button onClick={() => markCard(currentCard.id, 'dontknow')} style={{
                flex:1, padding:'14px', borderRadius:'12px', border:'1.5px solid #f8717155',
                background:'#f871711a', color:'#f87171', fontSize:'14px', fontWeight:'600', cursor:'pointer',
              }}>\u2717 Don't Know</button>
              <button onClick={() => markCard(currentCard.id, 'know')} style={{
                flex:1, padding:'14px', borderRadius:'12px', border:'1.5px solid #4ade8055',
                background:'#4ade801a', color:'#4ade80', fontSize:'14px', fontWeight:'600', cursor:'pointer',
              }}>\u2713 Know It</button>
            </div>
          )}

          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={prevCard} style={{
              flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #1e2538',
              background:'transparent', color:'#64748b', fontSize:'13px', cursor:'pointer',
            }}>\u2190 Prev</button>
            <button onClick={nextCard} style={{
              flex:1, padding:'12px', borderRadius:'10px', border:'1px solid #1e2538',
              background:'transparent', color:'#64748b', fontSize:'13px', cursor:'pointer',
            }}>Next \u2192</button>
          </div>
        </div>
      )}

      {/* \u2500\u2500 STATS VIEW \u2500\u2500 */}
      {view === VIEWS.STATS && (
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

      {/* \u2500\u2500 MANAGE VIEW \u2500\u2500 */}
      {view === VIEWS.MANAGE && (
        <div style={{ maxWidth: isXLarge ? '1100px' : isLarge ? '880px' : isDesktop ? '720px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
          <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
            <button onClick={() => setShowForm(f => !f)} style={{
              padding:'10px 16px', borderRadius:'10px', border:'1.5px solid #818cf855',
              background:'#818cf81a', color:'#818cf8', fontSize:'13px', fontWeight:'600', cursor:'pointer',
            }}>{showForm ? '\u00D7 Close' : '+ Add Card'}</button>
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
              }}>{justAdded ? '\u2713 Added!' : 'Add Card'}</button>
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns: isXLarge ? 'repeat(3,1fr)' : isDesktop ? 'repeat(2,1fr)' : '1fr', gap:'10px' }}>
            {cards.map(card => {
              const cc = getCat(card.category);
              return (
                <div key={card.id} style={{ background:'#111827', borderRadius:'12px', padding:'14px 16px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                    <span style={{ fontSize:'11px', fontWeight:'600', color:cc.accent, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                      {CATEGORY_EMOJI[card.category]||'\u2728'} {card.category}
                    </span>
                    <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                      <button onClick={() => openEdit(card)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.7 }}>✏️</button>
                      <button onClick={() => deleteCard(card.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.7 }}>🗑️\uFE0F</button>
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
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", minHeight:'100vh', background:'#0a0a0f', color:'#e2e8f0', padding: isXLarge ? '64px 80px' : isLarge ? '56px' : isDesktop ? '40px' : '20px 16px', boxSizing:'border-box' }}>
      <div style={{ maxWidth: isDesktop ? 'none' : '520px', margin:'0 auto' }}>

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
          {isDesktop && (
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
