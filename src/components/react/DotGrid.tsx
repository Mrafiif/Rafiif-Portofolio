// Interactive dot grid background: dots near the cursor light up and get pushed away.
// Static (no animation loop) for reduced-motion users and touch-only devices.
import { useEffect, useRef } from 'react';

export default function DotGrid({ gap = 28, radius = 140 }: { gap?: number; radius?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const interactive = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -9999, y: -9999 };
    let w = 0, h = 0, raf = 0, colors = { dot: '', accent: '' };

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      colors = { dot: s.getPropertyValue('--line').trim(), accent: s.getPropertyValue('--accent').trim() };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - pointer.x, dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          const t = Math.max(0, 1 - d / radius);
          const push = t * t * 10;
          const px = d > 0 ? x + (dx / d) * push : x;
          const py = d > 0 ? y + (dy / d) * push : y;
          ctx.fillStyle = t > 0 ? colors.accent : colors.dot;
          ctx.globalAlpha = t > 0 ? 0.25 + t * 0.75 : 1;
          ctx.beginPath();
          ctx.arc(px, py, 1.2 + t * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };

    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const mo = new MutationObserver(() => { readColors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (interactive) window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, [gap, radius]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(ellipse_70%_60%_at_30%_40%,black,transparent)]"
    />
  );
}
