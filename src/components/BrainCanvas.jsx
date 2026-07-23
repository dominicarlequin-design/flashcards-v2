import { useEffect, useRef } from 'react';

export default function BrainCanvas({ size }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2, cy = size / 2;

    // Two-hemisphere brain silhouette: nodes distributed by rejection sampling
    // inside a superellipse-ish brain outline, split by a central longitudinal groove.
    const brainR = size * 0.46;
    const inBrain = (x, y) => {
      const nx = (x - cx) / brainR, ny = (y - cy - size * 0.01) / (brainR * 0.82);
      const lobe = nx < 0 ? nx + 0.06 : nx - 0.06; // groove gap
      const d = lobe * lobe * 1.05 + ny * ny * 1.15;
      return d < 1;
    };

    const nodes = [];
    const targetCount = size > 160 ? 46 : size > 130 ? 36 : 26;
    let attempts = 0;
    while (nodes.length < targetCount && attempts < 4000) {
      attempts++;
      const x = cx + (Math.random() * 2 - 1) * brainR;
      const y = cy + (Math.random() * 2 - 1) * brainR * 0.86;
      if (!inBrain(x, y)) continue;
      // keep a minimum spacing so nodes don't clump
      const tooClose = nodes.some(n => (n.baseX - x) ** 2 + (n.baseY - y) ** 2 < (brainR * 0.13) ** 2);
      if (tooClose) continue;
      nodes.push({
        baseX: x, baseY: y, x, y,
        vx: 0, vy: 0,
        phase: Math.random() * Math.PI * 2,
        amp: 1 + Math.random() * 1.6,
        r: 1.6 + Math.random() * 1.6,
      });
    }

    // Connect each node to its nearest neighbors (Delaunay-ish approximation via k-NN)
    const edgeSet = new Set();
    const edges = [];
    nodes.forEach((n, i) => {
      const dists = nodes
        .map((m, j) => ({ j, d: (m.baseX - n.baseX) ** 2 + (m.baseY - n.baseY) ** 2 }))
        .filter(o => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3);
      dists.forEach(({ j, d }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push({ a: i, b: j, dist: Math.sqrt(d) });
        }
      });
    });

    const particles = edges.map(e => ({
      edge: e,
      t: Math.random(),
      speed: (0.15 + Math.random() * 0.25) / (20 + e.dist),
      warm: Math.random() > 0.45,
    }));

    const CORE_A = '167,139,250';   // violet-400
    const CORE_B = '96,165,250';    // blue-400
    const WARM = '244,182,255';     // light pink-violet for variety

    let raf;
    let t = 0;
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, size, size);

      // ambient halo behind the whole network
      const halo = ctx.createRadialGradient(cx, cy, size * 0.05, cx, cy, size * 0.55);
      halo.addColorStop(0, 'rgba(129,140,248,0.10)');
      halo.addColorStop(1, 'rgba(129,140,248,0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // simple spring physics: nodes ease back toward a gently orbiting rest point
      nodes.forEach(n => {
        const targetX = n.baseX + Math.cos(t * 0.5 + n.phase) * n.amp;
        const targetY = n.baseY + Math.sin(t * 0.55 + n.phase) * n.amp;
        const ax = (targetX - n.x) * 0.02;
        const ay = (targetY - n.y) * 0.02;
        n.vx = (n.vx + ax) * 0.9;
        n.vy = (n.vy + ay) * 0.9;
        n.x += n.vx;
        n.y += n.vy;
      });

      // dendrites as soft curved connective lines
      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        ctx.strokeStyle = 'rgba(148,163,253,0.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(mx, my, b.x, b.y);
        ctx.stroke();
      });

      // soma (node bodies) with soft glow
      nodes.forEach(n => {
        ctx.save();
        ctx.shadowColor = 'rgba(196,181,253,0.9)';
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(216,205,254,0.85)';
        ctx.fill();
        ctx.restore();
      });

      // traveling impulses with additive-style glow + trailing tail
      particles.forEach(p => {
        p.t += p.speed;
        if (p.t > 1) p.t = 0;
        const a = nodes[p.edge.a], b = nodes[p.edge.b];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        const et = p.t < 0.5 ? 2 * p.t * p.t : 1 - Math.pow(-2 * p.t + 2, 2) / 2;

        const bez = (tt) => {
          const u = 1 - tt;
          return {
            x: u * u * a.x + 2 * u * tt * mx + tt * tt * b.x,
            y: u * u * a.y + 2 * u * tt * my + tt * tt * b.y,
          };
        };
        const pos = bez(et);
        const hue = p.warm ? WARM : (Math.random() > 0.5 ? CORE_A : CORE_B);

        // tail
        for (let k = 1; k <= 4; k++) {
          const tt = Math.max(0, et - k * 0.035);
          const tp = bez(tt);
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 1.8 - k * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${hue},${0.35 - k * 0.07})`;
          ctx.fill();
        }

        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 7);
        glow.addColorStop(0, `rgba(${hue},0.95)`);
        glow.addColorStop(1, `rgba(${hue},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [size]);

  return <canvas ref={canvasRef} style={{ width: size + 'px', height: size + 'px', display: 'block' }} />;
}
