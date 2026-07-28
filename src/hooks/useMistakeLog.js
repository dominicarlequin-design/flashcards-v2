// useMistakeLog.js
//
// Purpose: replace the localStorage-only mistake tracking (masteredIds, results)
// with a version that also syncs to Supabase, so the data survives across
// devices and can eventually be aggregated across users.
//
// SETUP NEEDED IN SUPABASE (do this before wiring this hook in):
// 1. Create a table called "card_attempts" with columns:
//      id          uuid, primary key, default gen_random_uuid()
//      user_id     text        (for now, can be a random id stored in localStorage;
//                                later, a real auth user id)
//      card_id     int
//      result      text        ('know' | 'dontknow')
//      created_at  timestamptz, default now()
// 2. Get your Supabase project URL and anon key from Project Settings > API.
//
// This file is a starting point, not wired into App.jsx yet. Once your table
// exists, fill in SUPABASE_URL and SUPABASE_ANON_KEY below.

import { useCallback, useEffect, useState } from 'react';

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g. https://xxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// A stable per-browser id, so attempts can be grouped per user without full auth yet.
function getOrCreateUserId() {
  let id = localStorage.getItem('fc_user_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('fc_user_id', id);
  }
  return id;
}

export function useMistakeLog() {
  const [userId] = useState(getOrCreateUserId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  // Write one attempt (a single card answered) to Supabase.
  const logAttempt = useCallback(async (cardId, result) => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/card_attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          user_id: userId,
          card_id: cardId,
          result, // 'know' | 'dontknow'
        }),
      });
      if (!res.ok) throw new Error(`Supabase write failed: ${res.status}`);
    } catch (err) {
      // Fail quietly for now — local state (results/masteredIds) still works
      // even if the network write fails, so studying is never blocked.
      setError(err.message);
    } finally {
      setPending(false);
    }
  }, [userId]);

  // Read this user's full attempt history back out, e.g. to compute
  // "which terms do I miss most" for a review-session feature.
  const fetchMistakeCounts = useCallback(async () => {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/card_attempts?user_id=eq.${userId}&result=eq.dontknow&select=card_id`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
      const rows = await res.json();
      // Tally misses per card_id
      const counts = {};
      for (const row of rows) {
        counts[row.card_id] = (counts[row.card_id] || 0) + 1;
      }
      return counts; // { [cardId]: numberOfMisses }
    } catch (err) {
      setError(err.message);
      return {};
    }
  }, [userId]);

  return { userId, pending, error, logAttempt, fetchMistakeCounts };
}
