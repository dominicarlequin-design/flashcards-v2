import { INK, FONTS, RADII } from '../../constants/theme';

const MOTIF_OPTIONS = [['law', 'Law'], ['scholar', 'Scholar'], ['minimal', 'Minimal'], ['off', 'Off']];
const DENSITY_OPTIONS = [['sparse', 'Sparse'], ['normal', 'Normal'], ['dense', 'Dense']];

function SegButton({ label, active, disabled, onClick }) {
  return (
    <button onClick={disabled ? undefined : onClick} className="fc-tap" style={{
      flex: 1, fontFamily: FONTS.sans, padding: '9px 4px', borderRadius: RADII.pill,
      border: `1px solid ${active ? INK.gold : INK.hairline}`,
      background: active ? INK.gold : 'transparent',
      color: disabled ? INK.faint : (active ? '#14120b' : INK.mutedGoldGrey),
      fontSize: '11px', fontWeight: active ? '700' : '400', letterSpacing: '.5px',
      cursor: disabled ? 'default' : 'pointer',
    }}>{label}</button>
  );
}

export default function SettingsView({
  isDesktop, isLarge, isXLarge,
  settings, onToggle, onMotifChange, onDensityChange,
  resetProgress, justReset,
}) {
  const bgOff = settings.bgMotif === 'off';

  const toggleRows = [
    { key: 'shuffle', title: 'Shuffle deck', desc: 'Draw cards in random order during a session.' },
    { key: 'dailyReminder', title: 'Daily reminder', desc: 'A nudge to keep your streak alive.' },
    { key: 'reduceMotion', title: 'Reduce motion', desc: 'Disable the card flip and background animation.' },
  ];

  return (
    <div style={{ maxWidth: isXLarge ? '960px' : isLarge ? '760px' : isDesktop ? '640px' : 'none', margin: isDesktop ? '0 auto' : '0' }}>
      <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '6px 20px', marginBottom: '18px' }}>
        {toggleRows.map((row, i) => (
          <div key={row.key} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0',
            borderBottom: i < toggleRows.length - 1 ? `1px solid ${INK.divider}` : 'none',
          }}>
            <div style={{ paddingRight: '16px' }}>
              <p style={{ fontFamily: FONTS.sans, fontSize: '14px', color: INK.cream, margin: 0, fontWeight: '500' }}>{row.title}</p>
              <p style={{ fontSize: '12px', color: INK.dim, margin: '3px 0 0', lineHeight: 1.4 }}>{row.desc}</p>
            </div>
            <button onClick={() => onToggle(row.key)} className="fc-tap" style={{
              flexShrink: 0, width: '46px', height: '26px', borderRadius: '999px', border: 'none', cursor: 'pointer',
              background: settings[row.key] ? INK.gold : INK.hairline, position: 'relative', transition: 'background .2s',
            }}>
              <span style={{
                position: 'absolute', top: '3px', left: settings[row.key] ? '23px' : '3px',
                width: '20px', height: '20px', borderRadius: RADII.circle, background: INK.cream, transition: 'left .2s',
              }} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px', marginBottom: '18px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: INK.mutedGoldGrey, margin: '0 0 4px' }}>Background motifs</p>
        <p style={{ fontSize: '12px', color: INK.dim, margin: '0 0 14px', lineHeight: 1.5 }}>Drifting law symbols behind the app. Animation follows your reduce-motion setting.</p>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {MOTIF_OPTIONS.map(([v, label]) => (
            <SegButton key={v} label={label} active={settings.bgMotif === v} onClick={() => onMotifChange(v)} />
          ))}
        </div>
        <p style={{ fontFamily: FONTS.sans, fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: INK.dim, margin: '0 0 8px', opacity: bgOff ? .4 : 1 }}>Density</p>
        <div style={{ display: 'flex', gap: '6px', opacity: bgOff ? .4 : 1 }}>
          {DENSITY_OPTIONS.map(([v, label]) => (
            <SegButton key={v} label={label} active={!bgOff && settings.bgDensity === v} disabled={bgOff} onClick={() => onDensityChange(v)} />
          ))}
        </div>
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.hairline}`, borderRadius: RADII.panel, padding: '20px', marginBottom: '18px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: INK.mutedGoldGrey, margin: '0 0 6px' }}>Progress</p>
        <p style={{ fontSize: '13px', color: INK.dim, margin: '0 0 16px', lineHeight: 1.5 }}>Resets mastery and the current session. Your cards are kept.</p>
        <button onClick={resetProgress} className="fc-tap" style={{
          fontFamily: FONTS.sans, padding: '11px 20px', borderRadius: RADII.nav, border: `1px solid ${INK.reviewBorder}`,
          background: INK.reviewBg, color: INK.reviewText, fontSize: '12px', fontWeight: '600', letterSpacing: '.5px', cursor: 'pointer',
        }}>{justReset ? '✓ Progress reset' : 'Reset progress'}</button>
      </div>

      <p style={{ fontFamily: FONTS.serif, fontStyle: 'italic', textAlign: 'center', color: INK.faint, fontSize: '13px', margin: '10px 0 0' }}>
        Editorial Ink &amp; Gold · v2.1
      </p>
    </div>
  );
}
