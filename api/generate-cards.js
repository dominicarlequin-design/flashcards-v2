// Vercel serverless function.
// Keeps the Anthropic API key on the server — never exposed to the browser.
// Requires an env var set in Vercel: ANTHROPIC_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, category } = req.body || {};

  if (!text || typeof text !== 'string' || text.trim().length < 50) {
    return res.status(400).json({ error: 'Not enough text to generate cards from.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY.' });
  }

  const systemPrompt = `You generate Anki-style flashcards from book text.
Rules:
- Atomic cards only: one fact or concept per card, never compound questions.
- No yes/no questions.
- Prefer specific, testable recall over vague summary questions.
- Question should stand alone without needing the source text.
- Answer should be short (a phrase or sentence, not a paragraph).
- Return ONLY valid JSON, no preamble, no markdown fences.
- JSON shape: { "cards": [ { "question": "...", "answer": "..." }, ... ] }
- Generate between 8 and 20 cards depending on how much distinct material is in the text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 4000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: `Generate flashcards from this text:\n\n${text.slice(0, 15000)}` },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(502).json({ error: `Anthropic API error: ${errText.slice(0, 300)}` });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find(b => b.type === 'text');
    const raw = textBlock ? textBlock.text : '';
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return res.status(502).json({ error: 'Model did not return valid JSON.' });
    }

    const cards = Array.isArray(parsed.cards) ? parsed.cards : [];
    const cleanCards = cards
      .filter(c => c && c.question && c.answer)
      .map(c => ({
        question: String(c.question).trim(),
        answer: String(c.answer).trim(),
        category: category || 'Custom',
      }));

    return res.status(200).json({ cards: cleanCards });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown server error.' });
  }
}
