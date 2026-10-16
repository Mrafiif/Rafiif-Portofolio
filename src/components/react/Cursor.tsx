// Custom cursor: a dot plus a trailing ring that grows over links and buttons.
// Only for precise pointers (mouse/trackpad) and when motion is allowed; the native cursor stays visible.
import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });

  useEffect(() => {
    const ok = matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(ok);
    if (!ok) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as Element | null;
      setActive(!!t?.closest('a, button, [role="button"], input, textarea, label'));
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0, transition: 'opacity .2s' }}>
      <motion.div
        className="absolute top-0 left-0 rounded-full border border-accent"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: active ? 48 : 30, height: active ? 48 : 30, backgroundColor: active ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'rgba(0,0,0,0)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      />
    </div>
  );
}
