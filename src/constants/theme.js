// Design tokens for the editorial/law-office look: warm parchment + charcoal
// ink + terracotta accent, serif display type over a clean sans body.

export const INK = {
  bg: '#DAD5C8',       // page background (parchment)
  panel: '#EDEAE2',    // card/panel surface (lighter parchment)
  panelAlt: '#E2DDD0', // slightly deeper panel, for nesting/hover
  ink: '#20201C',      // primary text (charcoal)
  inkMuted: '#5B5648', // secondary text
  inkFaint: '#8A8574', // tertiary / placeholder text
  border: '#CCC5B4',   // hairline borders
  borderStrong: '#B8AF98',
  accent: '#A33B2E',   // terracotta-red — primary accent
  accentHover: '#8C3226',
  accentTint: '#A33B2E14',
  success: '#3F5D42',  // "known" swipe color
  danger: '#A33B2E',   // "unknown" swipe color (reuses primary accent)
};

// soft, large panel shadow + the accent-tinted glow behind the desktop layout
export const SHADOWS = {
  panel: '0 18px 40px -20px rgba(32,32,28,0.28), 0 2px 8px -2px rgba(32,32,28,0.08)',
  panelHover: '0 24px 48px -18px rgba(32,32,28,0.32), 0 4px 12px -2px rgba(32,32,28,0.1)',
  card: '0 30px 60px -24px rgba(32,32,28,0.35)',
  glow: (accent = INK.accent) => `radial-gradient(60% 50% at 50% 0%, ${accent}1c 0%, transparent 70%)`,
};

export const FONTS = {
  serif: "'Spectral', serif",
  sans: "'Source Sans 3', system-ui, sans-serif",
};

export const RADII = {
  panel: '16px',
  card: '20px',
  pill: '10px',
  sm: '8px',
  circle: '50%',
};

// One accent per deck — muted, harmonious "law library" tones, distinct from
// each other and from the primary terracotta accent used for chrome/CTAs.
export const DECK_COLORS = {
  'constitutional-law':    '#A33B2E', // terracotta (matches primary accent — the original core deck)
  'contracts':             '#3F5D42', // forest green
  'torts':                 '#2E4374', // navy
  'criminal-law':          '#B8862E', // ochre
  'evidence':              '#6B3654', // plum
  'civil-procedure':       '#2F6363', // slate teal
  'constitutional-law-ii': '#8C4A2F', // rust
  'legal-terminology':     '#3E4C59', // charcoal blue-grey
  'wills-trusts-estates':  '#6B6B2E', // olive
  'corporate-business-law':'#7A2E3B', // burgundy
  'property-law':          '#96702E', // brass
  'family-law':            '#8C4E5A', // mauve
  'intellectual-property': '#395878', // steel blue
  'tax-law':               '#4A5D3A', // moss
};

export const getDeckColor = (deckId) => DECK_COLORS[deckId] || INK.accent;
