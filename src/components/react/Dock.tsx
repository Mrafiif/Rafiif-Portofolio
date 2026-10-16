// macOS-style floating dock for section navigation. Icons magnify near the cursor;
// on touch devices it is a plain tappable bar. Highlights the section currently in view.
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

interface Item {
  href: string;
  label: string;
  icon: ReactNode;
}

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const icons: Record<string, ReactNode> = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>,
  about: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>,
  experience: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>,
  projects: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  skills: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><path d="m16 18 6-6-6-6M8 6l-6 6 6 6" /></svg>,
  contact: <svg width="18" height="18" viewBox="0 0 24 24" {...stroke}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
};

const items: Item[] = [
  { href: '/#top', label: 'Home', icon: icons.home },
  { href: '/#about', label: 'About', icon: icons.about },
  { href: '/#experience', label: 'Experience', icon: icons.experience },
  { href: '/#projects', label: 'Projects', icon: icons.projects },
  { href: '/#skills', label: 'Skills', icon: icons.skills },
  { href: '/#contact', label: 'Contact', icon: icons.contact },
];

function DockIcon({ item, mouseX, active, magnify }: { item: Item; mouseX: MotionValue<number>; active: boolean; magnify: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const distance = useTransform(mouseX, (v) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? v - (r.left + r.width / 2) : Infinity;
  });
  const size = useSpring(useTransform(distance, [-120, 0, 120], [42, magnify ? 62 : 42, 42]), { stiffness: 260, damping: 20, mass: 0.2 });
  const [hover, setHover] = useState(false);

  return (
    <motion.a
      ref={ref}
      href={item.href}
      aria-label={item.label}
      aria-current={active ? 'true' : undefined}
      style={{ width: size, height: size }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={`relative grid shrink-0 place-items-center rounded-2xl border transition-colors ${
        active ? 'border-accent/40 bg-accent-soft text-accent' : 'border-line bg-surface text-muted hover:text-ink'
      }`}
    >
      {item.icon}
      {hover && (
        <motion.span
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="pointer-events-none absolute -top-9 rounded-md bg-ink px-2 py-1 text-xs whitespace-nowrap text-bg"
        >
          {item.label}
        </motion.span>
      )}
      {active && <span className="absolute -bottom-1.5 size-1 rounded-full bg-accent" />}
    </motion.a>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const reduce = useReducedMotion();
  const [magnify, setMagnify] = useState(false);
  const [current, setCurrent] = useState('top');
  const [footerVisible, setFooterVisible] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const shown = !footerVisible && !introVisible;

  useEffect(() => {
    setMagnify(matchMedia('(pointer: fine)').matches && !reduce);
  }, [reduce]);

  // Track which section is in view; hide the dock over the intro and the footer so it never covers content.
  useEffect(() => {
    const ids = ['top', 'about', 'experience', 'projects', 'skills', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    const footer = document.querySelector('footer');
    const fo = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting));
    if (footer) fo.observe(footer);
    // Stay out of the way while the full-screen intro is mostly in view.
    const intro = document.querySelector('section[aria-label="Intro"]');
    const io = new IntersectionObserver(([e]) => setIntroVisible(e.intersectionRatio > 0.4), { threshold: [0, 0.4, 1] });
    if (intro) io.observe(intro);
    return () => {
      observer.disconnect();
      fo.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <motion.nav
      aria-label="Sections"
      initial={reduce ? false : { y: 80, opacity: 0 }}
      animate={{ y: shown ? 0 : 100, opacity: shown ? 1 : 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 24, delay: reduce ? 0 : 0.6 }}
      className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
    >
      <div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-[58px] items-end gap-2 rounded-3xl border border-line bg-bg/80 px-2.5 pb-2 shadow-card backdrop-blur-xl"
      >
        {items.map((item) => (
          <DockIcon key={item.href} item={item} mouseX={mouseX} active={current === item.href.slice(2)} magnify={magnify} />
        ))}
      </div>
    </motion.nav>
  );
}
