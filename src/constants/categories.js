import { INK } from './theme';

export const ALL_CATEGORY = 'All';
// each lesson is its own level — add 'Law 2', 'Law 3', etc. here as you go
export const LEVEL_ORDER = ['Law'];
export const CATEGORY_LIST = [...LEVEL_ORDER];

export const CATEGORY_COLORS = {
  Law:    { bg: INK.panel, accent: INK.gold, pill: `${INK.gold}22`, line: INK.hairlineStrong },
  Custom: { bg: INK.panel, accent: '#b89a5a', pill: '#b89a5a22', line: '#332c1e' },
};
export const CATEGORY_EMOJI = { Law: '⚖︎', Custom: '✦' };
export const getCat = (cat) => CATEGORY_COLORS[cat] || CATEGORY_COLORS.Custom;
