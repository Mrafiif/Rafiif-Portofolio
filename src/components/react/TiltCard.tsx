// 3D tilt + a soft spotlight that follows the cursor. Mouse only; touch/reduced-motion get a plain card.
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useRef, type ReactNode } from 'react';

export default function TiltCard({ children, max = 6 }: { children?: ReactNode; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(0, { stiffness: 180, damping: 20 });
  const ry = useSpring(0, { stiffness: 180, damping: 20 });
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in oklab, var(--accent) 16%, transparent), transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      className="relative h-full overflow-hidden rounded-2xl"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        ry.set((px - 0.5) * max * 2);
        rx.set(-(py - 0.5) * max * 2);
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
        mx.set(-999);
        my.set(-999);
      }}
    >
      {children}
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]" style={{ background: spotlight }} />
    </motion.div>
  );
}
