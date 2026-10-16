// Hero headline: words blur in one by one, then the last line cycles through what I build.
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

interface Props {
  intro: string;
  lead: string;
  rotating: string[];
}

export default function HeroHeadline({ intro, lead, rotating }: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % rotating.length), 2600);
    return () => clearInterval(id);
  }, [reduce, rotating.length]);

  const words = intro.split(' ');

  return (
    <h1 className="text-[clamp(2.3rem,7vw,4.75rem)] leading-[1.04] font-light tracking-tight">
      <span className="sr-only">
        {intro} {lead} {rotating.join(' ')}
      </span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={reduce ? false : { opacity: 0, filter: 'blur(12px)', y: 18 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        ))}
        <br />
        <motion.span
          className="inline-block"
          initial={reduce ? false : { opacity: 0, filter: 'blur(12px)', y: 18 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 * words.length, ease: [0.22, 1, 0.36, 1] }}
        >
          {lead}
        </motion.span>
        <br />
        <span className="relative block min-h-[2.2em] overflow-hidden pb-[0.12em]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.em
              key={rotating[index]}
              className="inline-block font-normal text-accent"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            >
              {rotating[index]}
            </motion.em>
          </AnimatePresence>
        </span>
      </span>
    </h1>
  );
}
