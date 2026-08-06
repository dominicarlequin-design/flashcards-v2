import { useState } from 'react';
import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

function ToggleRow({ title, desc, value, onToggle, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0',
      borderBottom: last ? 'none' : `1px solid ${INK.border}`,
    }}>
      <div style={{ paddingRight: '16px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: '14px', color: INK.ink, margin: 0, fontWeight: '600' }}>{title}</p>
        <p style={{ fontFamily: FONTS.sans, fontSize: '12px', color: INK.inkMuted, margin: '3px 0 0' }}>{desc}</p>
      </div>
      <button onClick={onToggle} className="fc-tap" style={{
        flexShrink: 0, width: '46px', height: '26px', borderRadius: '999px', border: 'none', cursor: 'pointer',
        background: value ? INK.accent : INK.border, position: 'relative',
      }}>
        <span style={{
          position: 'absolute', top: '3px', left: value ? '23px' : '3px', width: '20px', height: '20px',
          borderRadius: RADII.circle, background: INK.panel, transition: 'left .2s',
        }} />
      </button>
    </div>
  );
}

export default function SettingsView({ isDesktop, dailyGoal, onDailyGoalChange, remindersOn, onToggleReminders, soundOn, onToggleSound, onResetProgress }) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    onResetProgress();
    setConfirming(false);
  };

  return (
    <div className="scrolly" style={{ overflowY: 'auto', height: '100%' }}>
      <h1 style={{ fontFamily: FONTS.serif, fontSize: isDesktop ? '32px' : '26px', fontWeight: '600', color: INK.ink, margin: '0 0 22px' }}>Settings</h1>

      <div style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '22px', marginBottom: '20px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: INK.inkMuted, margin: '0 0 4px' }}>Daily goal</p>
        <p style={{ fontFamily: FONTS.sans, fontSize: '12px', color: INK.inkMuted, margin: '0 0 16px' }}>How many cards you aim to review each day.</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <input
            type="range" min="5" max="100" step="5" value={dailyGoal}
            onChange={e => onDailyGoalChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontFamily: FONTS.serif, fontSize: '20px', fontWeight: '600', color: INK.accent, minWidth: '46px', textAlign: 'right' }}>{dailyGoal}</span>
        </div>
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '4px 22px', marginBottom: '20px' }}>
        <ToggleRow title="Reminders" desc="A daily nudge to keep your streak alive." value={remindersOn} onToggle={onToggleReminders} />
        <ToggleRow title="Sound" desc="Play a sound when you flip or grade a card." value={soundOn} onToggle={onToggleSound} last />
      </div>

      <div style={{ background: INK.panel, border: `1px solid ${INK.border}`, borderRadius: RADII.panel, boxShadow: SHADOWS.panel, padding: '22px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', color: INK.inkMuted, margin: '0 0 6px' }}>Progress</p>
        <p style={{ fontFamily: FONTS.sans, fontSize: '13px', color: INK.inkMuted, margin: '0 0 16px' }}>Resets every deck's box progress, due dates, streak, and review history. This can't be undone.</p>

        {!confirming ? (
          <button onClick={() => setConfirming(true)} className="fc-tap" style={{
            fontFamily: FONTS.sans, padding: '12px 20px', borderRadius: RADII.pill, border: `1px solid ${INK.danger}66`,
            background: `${INK.danger}14`, color: INK.danger, fontSize: '13px', fontWeight: '700', cursor: 'pointer',
          }}>Reset progress</button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontFamily: FONTS.sans, fontSize: '13px', fontWeight: '700', color: INK.danger, margin: 0 }}>Are you sure? This can't be undone.</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setConfirming(false)} className="fc-tap" style={{
                flex: 1, fontFamily: FONTS.sans, padding: '12px', borderRadius: RADII.pill, border: `1px solid ${INK.border}`,
                background: 'transparent', color: INK.inkMuted, fontSize: '13px', cursor: 'pointer',
              }}>Cancel</button>
              <button onClick={handleReset} className="fc-tap" style={{
                flex: 1, fontFamily: FONTS.sans, padding: '12px', borderRadius: RADII.pill, border: 'none',
                background: INK.danger, color: INK.panel, fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              }}>Yes, reset everything</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
