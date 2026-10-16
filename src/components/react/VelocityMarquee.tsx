// Endless marquee whose speed (and direction) reacts to how fast you scroll.
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'motion/react';
import { useRef } from 'react';

function Row({ items, baseVelocity }: { items: string[]; baseVelocity: number }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  // Four copies so the wrap at -25% is seamless.
  const copies = [0, 1, 2, 3];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div className="flex shrink-0" style={{ x }}>
        {copies.map((c) => (
          <span key={c} className="flex shrink-0 items-center" aria-hidden={c > 0}>
            {items.map((item) => (
              <span key={item} className="flex items-center gap-6 pr-6 font-serif text-4xl font-light tracking-tight sm:text-6xl">
                {item}
                <span className="text-accent">✦</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function VelocityMarquee({ rows }: { rows: string[][] }) {
  return (
    <div className="space-y-3 py-10 select-none sm:py-14">
      {rows.map((items, i) => (
        <Row key={i} items={items} baseVelocity={i % 2 === 0 ? -2.5 : 2.5} />
      ))}
    </div>
  );
}
