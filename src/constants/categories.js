export const ALL_CATEGORY = 'All';
// each lesson is its own level — add 'Law 2', 'Law 3', etc. here as you go
export const LEVEL_ORDER = ['Law'];
export const CATEGORY_LIST = [...LEVEL_ORDER];

export const CATEGORY_COLORS = {
  Law:    { bg: '#1c1a10', accent: '#d4af37', pill: '#332c12' },
  Custom: { bg: '#1e1a14', accent: '#fbbf24', pill: '#362d10' },
};
export const CATEGORY_EMOJI = { Law: '⚖️', Custom: '✨' };
export const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Custom;
