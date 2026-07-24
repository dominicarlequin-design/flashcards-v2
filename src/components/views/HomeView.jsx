import BrainCanvas from '../BrainCanvas';

export default function HomeView({ isDesktop, isLarge, isXLarge, onStartStudying }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', minHeight: isDesktop ? '60vh' : '50vh', padding: isDesktop ? '40px 20px' : '20px 10px', marginLeft: isXLarge ? '-144px' : isLarge ? '-122px' : isDesktop ? '-100px' : 0 }}>
      <div style={{ marginBottom:'20px' }}>
        <BrainCanvas size={isXLarge ? 200 : isDesktop ? 168 : 130} />
      </div>
      <h2 style={{ fontSize: isXLarge ? '44px' : isLarge ? '38px' : isDesktop ? '32px' : '26px', fontWeight:'700', margin:'0 0 12px', letterSpacing:'-1px', color:'#f1f5f9' }}>Flashcards</h2>
      <p style={{ fontSize: isDesktop ? '16px' : '14px', color:'#64748b', margin:'0 0 32px', maxWidth:'420px', lineHeight:1.5 }}>
        Sharpen your knowledge, one card at a time.
      </p>
      <button onClick={onStartStudying} style={{
        padding: isDesktop ? '16px 36px' : '14px 28px', borderRadius:'999px', border:'none', cursor:'pointer',
        background:'#818cf8', color:'#0a0a0f', fontSize: isDesktop ? '16px' : '15px', fontWeight:'700',
        boxShadow:'0 0 30px #818cf855',
      }}>Start Studying →</button>
    </div>
  );
}
