// Full-screen intro: giant first name behind a cut-out portrait, outlined last name in front,
// HUD details in the corners. Letters rise in, the portrait lifts up, the role line "decodes",
// layers drift with the mouse (parallax) and the whole scene recedes as you scroll.
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionProps,
  type MotionValue,
  type TargetAndTransition,
} from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Social {
  href: string;
  label: string;
  icon: ReactNode;
}

interface Props {
  firstName: string;
  lastName: string;
  portrait: { src: string; width: number; height: number };
  roles: string[];
  location: string;
  socials: { github: string; linkedin: string; instagram: string };
}

const EASE = [0.22, 1, 0.36, 1] as const;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>_';

/** Text that "decodes" from random glyphs into the real string, one character at a time. */
function Decode({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (reduce) return setOut(text);
    let frame = 0;
    let raf = 0;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      if (now < start) {
        setOut(text.replace(/\S/g, () => GLYPHS[(Math.random() * GLYPHS.length) | 0]));
        raf = requestAnimationFrame(tick);
        return;
      }
      frame++;
      const revealed = Math.floor(frame / 2);
      setOut(
        text
          .split('')
          .map((c, i) => (i < revealed || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(''),
      );
      if (revealed < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, reduce]);
  return <span aria-label={text}>{out}</span>;
}

/** Cycles through the roles with the decode effect. */
function RoleTicker({ roles }: { roles: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 3200);
    return () => clearInterval(id);
  }, [reduce, roles.length]);
  return <Decode key={i} text={roles[i]} delay={i === 0 ? 1.4 : 0} />;
}

function useParallax(x: MotionValue<number>, y: MotionValue<number>, depth: number) {
  return {
    x: useTransform(x, (v) => v * depth),
    y: useTransform(y, (v) => v * depth),
  };
}

const iconProps = { width: 16, height: 16, fill: 'currentColor', 'aria-hidden': true } as const;
const ICONS = {
  instagram: (
    <svg viewBox="0 0 24 24" {...iconProps}><path d="M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z" /></svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" {...iconProps}><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zm1.8 13.1H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z" /></svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" {...iconProps}><path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.6 4.9.4.3.7.9.7 1.9v2.7c0 .3.2.6.7.5A10 10 0 0 0 22 12c0-5.5-4.5-10-10-10z" /></svg>
  ),
};

export default function IntroHero({ firstName, lastName, portrait, roles, location, socials }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Mouse parallax (normalised -1..1, sprung for smoothness).
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const back = useParallax(mx, my, -14);
  const mid = useParallax(mx, my, 10);
  const front = useParallax(mx, my, 26);

  useEffect(() => {
    if (reduce || !matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / innerWidth) * 2 - 1);
      my.set((e.clientY / innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my, reduce]);

  // Scroll: the scene recedes as you leave it.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.9]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%']);

  const socialItems: Social[] = [
    { href: socials.instagram, label: 'Instagram', icon: ICONS.instagram },
    { href: socials.linkedin, label: 'LinkedIn', icon: ICONS.linkedin },
    { href: socials.github, label: 'GitHub', icon: ICONS.github },
  ];

  const letters = firstName.toUpperCase().split('');
  const anim = (delay: number, from: TargetAndTransition): MotionProps =>
    reduce
      ? {}
      : { initial: from, animate: { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', scale: 1 }, transition: { duration: 1, delay, ease: EASE } };

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[560px] overflow-hidden" aria-label="Intro">
      <h1 className="sr-only">
        {firstName} {lastName} — {roles.join(', ')}
      </h1>

      <motion.div className="absolute inset-0" style={{ scale: sceneScale, opacity: sceneOpacity }}>
        {/* glow + scan grid behind the portrait */}
        <div aria-hidden className="absolute inset-0">
          <div className="absolute top-[55%] left-1/2 size-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--glow),transparent_62%)] blur-2xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(transparent,var(--bg))]" />
        </div>

        {/* giant first name — behind the portrait */}
        <motion.div aria-hidden className="absolute inset-x-0 top-[20%] flex justify-center sm:top-[20%]" style={{ y: nameY }}>
          <motion.div style={back} className="flex font-display leading-none font-black tracking-[-0.04em] select-none">
            {letters.map((l, i) => (
              <span key={i} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block bg-[linear-gradient(180deg,var(--ink)_30%,color-mix(in_oklab,var(--ink)_10%,transparent))] bg-clip-text text-[clamp(4.6rem,24vw,21rem)] text-transparent"
                  {...(reduce
                    ? {}
                    : {
                        initial: { y: '110%' },
                        animate: { y: '0%' },
                        transition: { duration: 1.1, delay: 0.15 + i * 0.07, ease: EASE },
                      })}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* portrait */}
        <motion.div
          className="absolute inset-x-0 bottom-0 flex justify-center"
          style={mid}
          {...anim(0.55, { opacity: 0, y: 80, filter: 'blur(10px)' })}
        >
          <img
            src={portrait.src}
            width={portrait.width}
            height={portrait.height}
            alt=""
            fetchPriority="high"
            className="h-[min(60svh,820px)] w-auto sm:h-[min(78svh,820px)] max-w-none object-contain object-bottom [mask-image:linear-gradient(black_70%,transparent)]"
          />
        </motion.div>

        {/* gradient last name — in front of the portrait */}
        <motion.div aria-hidden className="absolute bottom-[17%] left-[4%] sm:bottom-[16%] sm:left-[6%]" style={front}>
          <motion.span
            className="block bg-[linear-gradient(100deg,var(--accent),var(--accent-2))] bg-clip-text font-display text-[clamp(3rem,12vw,10.5rem)] leading-none font-black tracking-[-0.04em] text-transparent opacity-85 select-none [filter:drop-shadow(0_0_30px_var(--glow))]"
            {...anim(0.9, { opacity: 0, x: -120 })}
          >
            {lastName.toUpperCase()}
          </motion.span>
        </motion.div>
      </motion.div>

      {/* HUD: role line */}
      <motion.div
        className="absolute inset-x-0 bottom-8 flex justify-center px-4 sm:bottom-10"
        {...anim(1.2, { opacity: 0, y: 16 })}
      >
        <p className="rounded-md border border-line bg-surface/70 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-muted uppercase backdrop-blur sm:text-xs">
          <span className="text-accent">&gt;</span> <RoleTicker roles={roles} />
          <span className="ml-1 inline-block animate-pulse text-accent">▌</span>
        </p>
      </motion.div>

      {/* HUD: corners */}
      <motion.div aria-hidden className="pointer-events-none absolute inset-x-0 top-20 hidden justify-between px-6 font-mono text-[10px] tracking-[0.2em] text-faint uppercase sm:flex lg:px-10" {...anim(1.3, { opacity: 0 })}>
        <span>SYS://portfolio · {new Date().getFullYear()}</span>
        <span>{location} · 6.2°S 106.8°E</span>
      </motion.div>

      {/* vertical socials (left) */}
      <motion.ul
        className="absolute bottom-10 left-4 hidden flex-col items-center gap-5 text-faint sm:flex lg:left-8"
        {...anim(1.4, { opacity: 0, x: -20 })}
      >
        {socialItems.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noopener" aria-label={s.label} className="block transition-colors hover:text-accent">
              {s.icon}
            </a>
          </li>
        ))}
        <li aria-hidden className="order-first h-16 w-px bg-gradient-to-t from-line to-transparent" />
      </motion.ul>

      {/* scroll cue (right) */}
      <motion.a
        href="#hello"
        className="absolute right-4 bottom-10 hidden flex-col items-center gap-3 font-mono text-[10px] tracking-[0.3em] text-faint uppercase [writing-mode:vertical-rl] hover:text-accent sm:flex lg:right-8"
        {...anim(1.5, { opacity: 0 })}
      >
        Scroll
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-accent" />
        </span>
      </motion.a>
    </section>
  );
}
