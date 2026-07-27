import { useState } from 'react';
import { INK, FONTS, RADII, SHADOWS } from '../../constants/theme';

const STEPS = [
  {
    glyph: '⚖︎',
    kicker: 'Welcome',
    title: 'Study the law, one card at a time.',
    body: 'A focused deck of law fundamentals — built for steady, spaced review.',
    cta: 'Continue',
  },
  {
    glyph: '↻',
    kicker: 'How it works',
    title: 'Spaced repetition, quietly working.',
    body: "Mark what you know and what you don't. Cards you struggle with resurface more often until they stick.",
    cta: 'Continue',
  },
  {
    glyph: '✦',
    kicker: 'Ready',
    title: 'Climb the path, level by level.',
    body: 'Master every card in a level to unlock the next. Your streak keeps you honest.',
    cta: 'Start studying',
  },
];

export default function OnboardingView({ accent, onComplete }) {
  const [step, setStep] = useState(0);
  const onb = STEPS[step];

  const next = () => {
    if (step >= STEPS.length - 1) onComplete();
    else setStep(s => s + 1);
  };

  return (
    <div style={{
      minHeight: '82vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '20px 8px',
    }}>
      <div style={{
        width: '96px', height: '96px', borderRadius: RADII.circle, border: `1.5px solid ${accent}`,
        background: INK.panel, display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '34px', boxShadow: SHADOWS.onboardingSeal(accent),
      }}>
        <span style={{ fontFamily: FONTS.serif, fontSize: '40px', color: accent }}>{onb.glyph}</span>
      </div>

      <p style={{
        fontFamily: FONTS.sans, fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase',
        color: INK.mutedGoldGrey, margin: '0 0 14px',
      }}>{onb.kicker}</p>

      <h1 style={{
        fontFamily: FONTS.serif, fontSize: '34px', fontWeight: '600', color: INK.cream,
        margin: '0 0 16px', letterSpacing: '-0.4px', maxWidth: '420px', lineHeight: 1.2,
      }}>{onb.title}</h1>

      <p style={{
        fontSize: '16px', lineHeight: 1.65, color: '#a99a72', margin: '0 0 40px', maxWidth: '400px',
      }}>{onb.body}</p>

      <div style={{ display: 'flex', gap: '9px', marginBottom: '36px' }}>
        {STEPS.map((_, i) => (
          <span key={i} style={{
            width: '8px', height: '8px', borderRadius: RADII.circle,
            background: i === step ? accent : INK.hairlineStrong,
          }} />
        ))}
      </div>

      <button onClick={next} className="fc-tap" style={{
        fontFamily: FONTS.sans, padding: '15px 44px', borderRadius: RADII.btn, border: 'none',
        background: accent, color: '#14120b', fontSize: '14px', fontWeight: '700', letterSpacing: '.5px',
        boxShadow: SHADOWS.goldButton(accent),
      }}>{onb.cta}</button>

      <button onClick={onComplete} className="fc-tap" style={{
        marginTop: '16px', background: 'none', border: 'none', color: INK.dim,
        fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase',
      }}>Skip intro</button>
    </div>
  );
}
