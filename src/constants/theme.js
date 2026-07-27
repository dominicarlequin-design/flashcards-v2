// "Editorial Ink & Gold" design tokens — shared across every view so colors,
// type, radii, and shadows stay consistent in one place.

export const INK = {
  bgTop: '#1c180d',
  bgMid: '#14120b',
  bgBottom: '#0f0d08',
  panel: '#1b180f',
  inputBg: '#0f0d08',
  hairline: '#2a2416',
  hairlineStrong: '#3a331e',
  divider: '#241f13',
  cream: '#f2ead6',
  mutedGoldGrey: '#8a7a4e',
  dim: '#6b6144',
  faint: '#4a422c',
  gold: '#d4af37',
  goldHover: '#e6c65a',
  streakAmber: '#d98a4a',
  reviewBorder: '#5a3a34',
  reviewBg: '#2a1a16',
  reviewText: '#d98a7a',
};

export const PAGE_BG = `radial-gradient(120% 80% at 50% -10%, ${INK.bgTop} 0%, ${INK.bgMid} 45%, ${INK.bgBottom} 100%)`;

export const FONTS = {
  serif: "'Spectral', serif",
  sans: "'Archivo', sans-serif",
};

export const RADII = {
  panel: '14px',
  card: '16px',
  nav: '12px',
  btn: '10px',
  pill: '8px',
  circle: '50%',
};

export const SHADOWS = {
  goldButton: (accent) => `0 12px 30px -10px ${accent}66`,
  cardFront: 'inset 0 0 0 1px #ffffff05, 0 24px 50px -30px #000',
  cardBack: (accent) => `0 0 60px ${accent}1f, 0 24px 50px -30px #000`,
  heroSeal: (accent) => `0 0 50px ${accent}18`,
  onboardingSeal: (accent) => `0 0 44px ${accent}22`,
  mapSealGlow: (accent) => `0 0 30px ${accent}44`,
};

// tweakable accent colors offered alongside the primary gold
export const ACCENT_OPTIONS = ['#d4af37', '#c99a3a', '#b8863a', '#c0894a'];

// background motif layer — glyph sets, density, and the 14 predefined slots
export const MOTIF_SETS = {
  law: ['⚖︎', '§', '¶', '†'],
  scholar: ['§', '¶', '†', '‡', '✦', '◈'],
  minimal: ['§'],
};
export const DENSITY = { sparse: 5, normal: 9, dense: 14 };
export const MOTIF_POS = [
  { top: '8%', left: '6%', size: '120px', opacity: '.05', dur: 19, delay: 0 },
  { top: '22%', right: '8%', size: '150px', opacity: '.045', dur: 26, delay: 2 },
  { top: '48%', left: '10%', size: '90px', opacity: '.05', dur: 22, delay: 1 },
  { top: '64%', right: '12%', size: '130px', opacity: '.045', dur: 30, delay: 3 },
  { top: '82%', left: '16%', size: '110px', opacity: '.05', dur: 24, delay: 1.5 },
  { top: '38%', left: '44%', size: '72px', opacity: '.04', dur: 28, delay: 4 },
  { top: '6%', right: '26%', size: '80px', opacity: '.06', dur: 20, delay: 0.5 },
  { top: '88%', right: '6%', size: '70px', opacity: '.05', dur: 21, delay: 2.5 },
  { top: '15%', left: '40%', size: '54px', opacity: '.05', dur: 25, delay: 3 },
  { top: '30%', left: '28%', size: '64px', opacity: '.04', dur: 23, delay: 1 },
  { top: '56%', right: '30%', size: '96px', opacity: '.05', dur: 27, delay: 2 },
  { top: '72%', left: '4%', size: '84px', opacity: '.045', dur: 29, delay: 3.5 },
  { top: '4%', left: '22%', size: '60px', opacity: '.05', dur: 18, delay: 1.2 },
  { top: '92%', right: '34%', size: '76px', opacity: '.05', dur: 32, delay: 0.8 },
];

// Roman numerals for the level map (one per LEVEL_ORDER entry)
export const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];
