export const ALL_CATEGORY = 'All';
export const LEVEL_ORDER = ['JavaScript', 'Python', 'Java', 'C++', 'Go', 'React'];

export const CATEGORY_COLORS = {
  JavaScript: { bg: '#2d2a0e', accent: '#facc15', pill: '#4a4400' },
  Python:     { bg: '#0d2a1a', accent: '#4ade80', pill: '#0a3320' },
  Java:       { bg: '#2d1b0e', accent: '#fb923c', pill: '#4a2800' },
  'C++':      { bg: '#1e1533', accent: '#a78bfa', pill: '#2f2050' },
  Go:         { bg: '#0d2137', accent: '#38bdf8', pill: '#0c3251' },
  React:      { bg: '#0e2530', accent: '#61dafb', pill: '#0a3c4a' },
  Custom:     { bg: '#1e1a14', accent: '#fbbf24', pill: '#362d10' },
};
export const CATEGORY_EMOJI = { JavaScript:'🟨', Python:'🐍', Java:'☕', 'C++':'➕', Go:'🐹', React:'⚛️', Custom:'✨' };
export const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Custom;
