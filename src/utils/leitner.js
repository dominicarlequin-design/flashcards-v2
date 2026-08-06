// Leitner spaced-repetition scheduling.
//
// Boxes run 1-6. Each box has a review interval in days; answering a card
// correctly moves it up a box (capped at 6), answering incorrectly drops it
// straight back to box 1. A card is "due" once today's date has reached its
// stored due date.

export const MAX_BOX = 6;
export const BOX_INTERVAL_DAYS = [1, 2, 4, 7, 14, 30]; // index 0 = box 1

const DAY_MS = 24 * 60 * 60 * 1000;

// Local (not UTC) calendar-day string, so "due" lines up with the user's
// actual day rather than shifting at UTC midnight.
export function todayStr(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysStr(dateStr, days) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const base = new Date(y, m - 1, d);
  return todayStr(new Date(base.getTime() + days * DAY_MS));
}

// Fresh progress entry for a card that's never been studied: box 1, due now.
export function newProgress(today = todayStr()) {
  return { box: 1, dueDate: today };
}

export function isDue(progressEntry, today = todayStr()) {
  if (!progressEntry) return true; // never studied = due
  return progressEntry.dueDate <= today;
}

// Apply a review result to a progress entry, returning the next entry.
export function review(progressEntry, known, today = todayStr()) {
  const box = known
    ? Math.min((progressEntry?.box || 1) + 1, MAX_BOX)
    : 1;
  const dueDate = addDaysStr(today, BOX_INTERVAL_DAYS[box - 1]);
  return { box, dueDate };
}

// A card counts as "mastered" once it's reached the top box.
export function isMastered(progressEntry) {
  return !!progressEntry && progressEntry.box >= MAX_BOX;
}
