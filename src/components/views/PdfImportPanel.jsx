import { useState } from 'react';
import { extractPdfText, chunkPages } from '../../utils/extractPdfText';
import { CATEGORY_LIST } from '../../constants/categories';
import { INK, FONTS, RADII } from '../../constants/theme';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: RADII.pill,
  border: `1px solid ${INK.hairline}`, background: INK.inputBg, color: INK.cream, fontSize: '14px',
  fontFamily: FONTS.sans, marginBottom: '10px',
};

const STAGES = {
  IDLE: 'idle',
  EXTRACTING: 'extracting',
  GENERATING: 'generating',
  REVIEW: 'review',
  ERROR: 'error',
};

export default function PdfImportPanel({ addCardsBulk, onClose, accent }) {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [category, setCategory] = useState('Custom');
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [errorMsg, setErrorMsg] = useState('');
  const [generated, setGenerated] = useState([]); // { question, answer, category, included }

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setErrorMsg('');
    setGenerated([]);

    try {
      setStage(STAGES.EXTRACTING);
      const { pages } = await extractPdfText(file);
      const chunks = chunkPages(pages, 6);

      setStage(STAGES.GENERATING);
      setProgress({ done: 0, total: chunks.length });

      const allCards = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunkText = chunks[i];
        if (chunkText.trim().length < 50) {
          setProgress(p => ({ ...p, done: i + 1 }));
          continue;
        }
        const res = await fetch('/api/generate-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: chunkText, category }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed.');
        allCards.push(...data.cards);
        setProgress(p => ({ ...p, done: i + 1 }));
      }

      setGenerated(allCards.map(c => ({ ...c, included: true })));
      setStage(STAGES.REVIEW);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
      setStage(STAGES.ERROR);
    }
  };

  const toggleCard = (idx) => {
    setGenerated(prev => prev.map((c, i) => i === idx ? { ...c, included: !c.included } : c));
  };

  const confirmAdd = () => {
    const toAdd = generated.filter(c => c.included).map(({ question, answer, category }) => ({ question, answer, category }));
    addCardsBulk(toAdd);
    setStage(STAGES.IDLE);
    setGenerated([]);
    if (onClose) onClose();
  };

  const includedCount = generated.filter(c => c.included).length;

  return (
    <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '16px', marginBottom: '20px' }}>
      <h3 style={{ fontFamily: FONTS.serif, margin: '0 0 12px', fontSize: '16px', color: INK.cream }}>Generate cards from PDF</h3>

      {(stage === STAGES.IDLE || stage === STAGES.ERROR) && (
        <>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            {[...CATEGORY_LIST, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label className="fc-tap" style={{
            display: 'inline-block', fontFamily: FONTS.sans, padding: '10px 16px', borderRadius: RADII.nav,
            border: `1px solid ${INK.hairline}`, background: 'transparent', color: INK.mutedGoldGrey,
            fontSize: '13px', cursor: 'pointer',
          }}>
            Choose PDF
            <input type="file" accept="application/pdf" onChange={handleFile} style={{ display: 'none' }} />
          </label>
          {errorMsg && <p style={{ color: INK.reviewText, fontSize: '13px', marginTop: '10px' }}>{errorMsg}</p>}
        </>
      )}

      {stage === STAGES.EXTRACTING && (
        <p style={{ color: INK.mutedGoldGrey, fontSize: '13px' }}>Reading PDF…</p>
      )}

      {stage === STAGES.GENERATING && (
        <p style={{ color: INK.mutedGoldGrey, fontSize: '13px' }}>
          Generating cards… chunk {progress.done}/{progress.total}
        </p>
      )}

      {stage === STAGES.REVIEW && (
        <>
          <p style={{ color: INK.mutedGoldGrey, fontSize: '13px', marginBottom: '10px' }}>
            {generated.length} cards generated — {includedCount} selected. Uncheck any you don't want.
          </p>
          <div style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
            {generated.map((c, i) => (
              <label key={i} className="fc-tap" style={{
                display: 'flex', gap: '10px', alignItems: 'flex-start', background: INK.inputBg,
                borderRadius: RADII.nav, padding: '10px 12px', cursor: 'pointer',
                opacity: c.included ? 1 : 0.45,
              }}>
                <input type="checkbox" checked={c.included} onChange={() => toggleCard(i)} style={{ marginTop: '3px' }} />
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '13px', color: INK.cream, fontWeight: '500' }}>{c.question}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: INK.mutedGoldGrey }}>{c.answer}</p>
                </div>
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => { setStage(STAGES.IDLE); setGenerated([]); }} className="fc-tap" style={{
              flex: 1, fontFamily: FONTS.sans, padding: '10px', borderRadius: RADII.pill, border: `1px solid ${INK.hairline}`,
              background: 'transparent', color: INK.mutedGoldGrey, fontSize: '13px',
            }}>Cancel</button>
            <button onClick={confirmAdd} disabled={includedCount === 0} className="fc-tap" style={{
              flex: 1, fontFamily: FONTS.sans, padding: '10px', borderRadius: RADII.pill, border: 'none',
              background: includedCount === 0 ? `${accent}55` : accent, color: '#14120b',
              fontSize: '13px', fontWeight: '700', cursor: includedCount === 0 ? 'default' : 'pointer',
            }}>Add {includedCount} card{includedCount === 1 ? '' : 's'}</button>
          </div>
        </>
      )}
    </div>
  );
}
