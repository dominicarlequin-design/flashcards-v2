import { LEVEL_ORDER, CATEGORY_EMOJI, getCat } from '../../constants/categories';

const inputStyle = {
  width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px',
  border: '1px solid #1e2538', background: '#0a0a0f', color: '#e2e8f0', fontSize: '14px',
  fontFamily: 'inherit', marginBottom: '10px',
};

export default function ManageView({
  isDesktop, isLarge, isXLarge, cards,
  showForm, setShowForm, exportCards, importCards, importMsg,
  newQ, setNewQ, newA, setNewA, newCat, setNewCat, addCard, justAdded,
  openEdit, deleteCard,
  editCard, setEditCard, editQ, setEditQ, editA, setEditA, editCat, setEditCat, saveEdit,
}) {
  return (
    <div style={{ maxWidth: isXLarge ? '1100px' : isLarge ? '880px' : isDesktop ? '720px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
        <button onClick={() => setShowForm(f => !f)} style={{
          padding:'10px 16px', borderRadius:'10px', border:'1.5px solid #818cf855',
          background:'#818cf81a', color:'#818cf8', fontSize:'13px', fontWeight:'600', cursor:'pointer',
        }}>{showForm ? '× Close' : '+ Add Card'}</button>
        <button onClick={exportCards} style={{
          padding:'10px 16px', borderRadius:'10px', border:'1px solid #1e2538',
          background:'transparent', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
        }}>📤 Export</button>
        <label style={{
          padding:'10px 16px', borderRadius:'10px', border:'1px solid #1e2538',
          background:'transparent', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
        }}>
          📥 Import
          <input type="file" accept="application/json" onChange={importCards} style={{ display:'none' }} />
        </label>
        {importMsg && <span style={{ fontSize:'12px', color:'#94a3b8', alignSelf:'center' }}>{importMsg}</span>}
      </div>

      {showForm && (
        <div style={{ background:'#111827', borderRadius:'14px', padding:'16px', marginBottom:'20px' }}>
          <textarea placeholder="Question" value={newQ} onChange={e => setNewQ(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
          <textarea placeholder="Answer" value={newA} onChange={e => setNewA(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
          <select value={newCat} onChange={e => setNewCat(e.target.value)} style={inputStyle}>
            {[...LEVEL_ORDER, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button onClick={addCard} style={{
            padding:'10px 16px', borderRadius:'8px', border:'none',
            background:'#818cf8', color:'#0a0a0f', fontSize:'13px', fontWeight:'700', cursor:'pointer',
          }}>{justAdded ? '✓ Added!' : 'Add Card'}</button>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns: isXLarge ? 'repeat(3,1fr)' : isDesktop ? 'repeat(2,1fr)' : '1fr', gap:'10px' }}>
        {cards.map(card => {
          const cc = getCat(card.category);
          return (
            <div key={card.id} style={{ background:'#111827', borderRadius:'12px', padding:'14px 16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                <span style={{ fontSize:'11px', fontWeight:'600', color:cc.accent, textTransform:'uppercase', letterSpacing:'0.5px' }}>
                  {CATEGORY_EMOJI[card.category]||'✨'} {card.category}
                </span>
                <div style={{ display:'flex', gap:'4px', flexShrink:0 }}>
                  <button onClick={() => openEdit(card)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.7 }}>✏️</button>
                  <button onClick={() => deleteCard(card.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', opacity:0.7 }}>🗑️️</button>
                </div>
              </div>
              <p style={{ margin:'8px 0 4px', fontSize:'14px', color:'#f1f5f9', fontWeight:'500' }}>{card.question}</p>
              <p style={{ margin:0, fontSize:'13px', color:'#64748b' }}>{card.answer}</p>
            </div>
          );
        })}
      </div>

      {editCard && (
        <div onClick={() => setEditCard(null)} style={{
          position:'fixed', inset:0, background:'#000000aa', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', zIndex:10,
        }}>
          <div onClick={e => e.stopPropagation()} style={{ background:'#111827', borderRadius:'16px', padding:'20px', width:'100%', maxWidth:'420px' }}>
            <h3 style={{ margin:'0 0 14px', fontSize:'16px', color:'#e2e8f0' }}>Edit Card</h3>
            <textarea value={editQ} onChange={e => setEditQ(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
            <textarea value={editA} onChange={e => setEditA(e.target.value)} rows={2} style={{ ...inputStyle, resize:'vertical' }} />
            <select value={editCat} onChange={e => setEditCat(e.target.value)} style={inputStyle}>
              {[...LEVEL_ORDER, 'Custom'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ display:'flex', gap:'10px' }}>
              <button onClick={() => setEditCard(null)} style={{
                flex:1, padding:'10px', borderRadius:'8px', border:'1px solid #1e2538',
                background:'transparent', color:'#94a3b8', fontSize:'13px', cursor:'pointer',
              }}>Cancel</button>
              <button onClick={saveEdit} style={{
                flex:1, padding:'10px', borderRadius:'8px', border:'none',
                background:'#818cf8', color:'#0a0a0f', fontSize:'13px', fontWeight:'700', cursor:'pointer',
              }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
