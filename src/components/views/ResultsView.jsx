import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

export default function ResultsView({ reviewed, known, onDone }) {
  const accuracy = reviewed > 0 ? Math.round((known / reviewed) * 100) : 0;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
      <div style={{
        width: '84px', height: '84px', borderRadius: RADII.circle, background: INK.ink,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '26px', boxShadow: SHADOWS.card,
      }}>
        <span style={{ fontSize: '34px' }}>✓</span>
      </div>

      <h1 style={{ fontFamily: FONTS.serif, fontSize: '30px', fontWeight: '600', color: INK.ink, margin: '0 0 10px' }}>Session complete</h1>
      <p style={{ fontFamily: FONTS.sans, fontSize: '14px', color: INK.inkMuted, margin: '0 0 32px' }}>Nice work — here's how it went.</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', width: '100%', maxWidth: '420px' }}>
        <div style={{ flex: 1, background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '18px 12px' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '26px', fontWeight: '600', color: INK.ink, margin: 0 }}>{reviewed}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.inkMuted, margin: '4px 0 0' }}>Reviewed</p>
        </div>
        <div style={{ flex: 1, background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '18px 12px' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '26px', fontWeight: '600', color: INK.success, margin: 0 }}>{known}</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.inkMuted, margin: '4px 0 0' }}>Known</p>
        </div>
        <div style={{ flex: 1, background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '18px 12px' }}>
          <p style={{ fontFamily: FONTS.serif, fontSize: '26px', fontWeight: '600', color: INK.accent, margin: 0 }}>{accuracy}%</p>
          <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', color: INK.inkMuted, margin: '4px 0 0' }}>Accuracy</p>
        </div>
      </div>

      <button onClick={onDone} className="fc-tap" style={{
        fontFamily: FONTS.sans, padding: '15px 40px', borderRadius: RADII.pill, border: 'none',
        background: INK.accent, color: INK.panel, fontSize: '14px', fontWeight: '700', cursor: 'pointer',
      }}>Back home</button>
    </div>
  );
}
