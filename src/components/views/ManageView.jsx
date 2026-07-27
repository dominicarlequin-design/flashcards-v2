import { useState } from 'react';
import { CATEGORY_LIST, CATEGORY_EMOJI, getCat } from '../../constants/categories';
import { INK, FONTS, RADII } from '../../constants/theme';
import PdfImportPanel from './PdfImportPanel';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '11px 13px', borderRadius: RADII.pill,
  border: `1px solid ${INK.hairline}`, background: INK.inputBg, color: INK.cream, fontSize: '14px',
  fontFamily: FONTS.sans, marginBottom: '10px',
};

const toolbarBtnStyle = {
  fontFamily: FONTS.sans, padding: '10px 16px', borderRadius: RADII.nav, border: `1px solid ${INK.hairline}`,
  background: 'transparent', color: INK.mutedGoldGrey, fontSize: '12px', cursor: 'pointer', letterSpacing: '.5px',
};

export default function ManageView({
  isDesktop, isLarge, isXLarge, accent, cards,
  showForm, setShowForm, exportCards, importCards, importMsg,
  newQ, setNewQ, newA, setNewA, newCat, setNewCat, addCard, justAdded,
  openEdit, deleteCard,
  editCard, setEditCard, editQ, setEditQ, editA, setEditA, editCat, setEditCat, saveEdit,
  addCardsBulk,
}) {
  const [showPdfImport, setShowPdfImport] = useState(false);

  return (
    <div style={{ maxWidth: isXLarge ? '1100px' : isLarge ? '880px' : isDesktop ? '720px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
        <button onClick={() => setShowForm(f => !f)} className="fc-tap" style={{
          fontFamily: FONTS.sans, padding: '10px 18px', borderRadius: RADII.nav, border: 'none',
          background: accent, color: '#14120b', fontSize: '12px', fontWeight: '700', letterSpacing: '.5px',
        }}>{showForm ? '× Close' : '+ Add card'}</button>
        <button onClick={exportCards} className="fc-tap" style={toolbarBtnStyle}>Export deck</button>
        <label className="fc-tap" style={toolbarBtnStyle}>
          Import JSON
          <input type="file" accept="application/json" onChange={importCards} style={{ display: 'none' }} />
        </label>
        <button onClick={() => setShowPdfImport(v => !v)} className="fc-tap" style={toolbarBtnStyle}>
          {showPdfImport ? '× Close' : 'Import PDF'}
        </button>
        {importMsg && <span style={{ fontFamily: FONTS.sans, fontSize: '12px', color: INK.mutedGoldGrey, alignSelf: 'center' }}>{importMsg}</span>}
      </div>

      {showPdfImport && (
        <PdfImportPanel addCardsBulk={addCardsBulk} onClose={() => setShowPdfImport(false)} accent={accent} />
      )}

      {showForm && (
        <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '16px', marginBottom: '20px' }}>
          <textarea placeholder="Question" value={newQ} onChange={e => setNewQ(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <textarea placeholder="Answer" value={newA} onChange={e => setNewA(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
          <select value={newCat} onChange={e => setNewCat(e.target.value)} style={inputStyle}>
            {[...CATEGORY_LIST, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={addCard} className="fc-tap" style={{
            fontFamily: FONTS.sans, padding: '10px 20px', borderRadius: RADII.pill, border: 'none',
            background: accent, color: '#14120b', fontSize: '12px', fontWeight: '700', letterSpacing: '.5px',
          }}>{justAdded ? '✓ Added' : 'Add card'}</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isXLarge ? 'repeat(3,1fr)' : isDesktop ? 'repeat(2,1fr)' : '1fr', gap: '10px' }}>
        {cards.map(card => {
          const cc = getCat(card.category);
          return (
            <div key={card.id} style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.nav, padding: '15px 17px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: '600', color: cc.accent }}>
                  {CATEGORY_EMOJI[card.category] || '✦'} {card.category}
                </span>
                <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
                  <button onClick={() => openEdit(card)} className="fc-tap" style={{ background: 'none', border: 'none', cursor: 'pointer', color: INK.dim, fontSize: '12px', fontFamily: FONTS.sans, letterSpacing: '.5px' }}>Edit</button>
                  <button onClick={() => deleteCard(card.id)} className="fc-tap" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8a5a4e', fontSize: '12px', fontFamily: FONTS.sans, letterSpacing: '.5px' }}>Delete</button>
                </div>
              </div>
              <p style={{ fontFamily: FONTS.serif, margin: '10px 0 5px', fontSize: '16px', color: INK.cream, lineHeight: 1.35 }}>{card.question}</p>
              <p style={{ margin: 0, fontSize: '13px', color: INK.mutedGoldGrey, lineHeight: 1.5 }}>{card.answer}</p>
            </div>
          );
        })}
      </div>

      {editCard && (
        <div onClick={() => setEditCard(null)} style={{
          position: 'fixed', inset: 0, background: '#0a0806cc', backdropFilter: 'blur(3px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          paddingTop: 'calc(20px + env(safe-area-inset-top))',
          paddingBottom: 'calc(20px + env(safe-area-inset-bottom))',
          paddingLeft: 'calc(20px + env(safe-area-inset-left))',
          paddingRight: 'calc(20px + env(safe-area-inset-right))',
          boxSizing: 'border-box',
        }}>
          <div onClick={e => e.stopPropagation()} style={{ background: INK.panel, border: `1px solid ${INK.hairlineStrong}`, borderRadius: RADII.card, padding: '22px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontFamily: FONTS.serif, margin: '0 0 16px', fontSize: '20px', color: INK.cream }}>Edit card</h3>
            <textarea value={editQ} onChange={e => setEditQ(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            <select value={editCat} onChange={e => setEditCat(e.target.value)} style={inputStyle}>
              {[...CATEGORY_LIST, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button onClick={() => setEditCard(null)} className="fc-tap" style={{
                flex: 1, fontFamily: FONTS.sans, padding: '11px', borderRadius: RADII.pill, border: `1px solid ${INK.hairline}`,
                background: 'transparent', color: INK.mutedGoldGrey, fontSize: '12px', letterSpacing: '.5px',
              }}>Cancel</button>
              <button onClick={saveEdit} className="fc-tap" style={{
                flex: 1, fontFamily: FONTS.sans, padding: '11px', borderRadius: RADII.pill, border: 'none',
                background: accent, color: '#14120b', fontSize: '12px', fontWeight: '700', letterSpacing: '.5px',
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
