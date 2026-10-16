// Shows a static ID card immediately, then swaps in the interactive 3D lanyard
// once the browser is idle — unless the user prefers reduced motion or WebGL is unavailable.
import { lazy, Suspense, useEffect, useState } from 'react';
import type { CardInfo } from './Lanyard';

const Lanyard = lazy(() => import('./Lanyard'));

function canUse3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function StaticCard({ info }: { info: CardInfo }) {
  return (
    <div className="flex h-full items-center justify-center pt-10">
      <div className="w-60 rotate-[-4deg] overflow-hidden rounded-2xl border border-[#1d2a3a] bg-[#070a10] text-[#e7eef8] shadow-card">
        <div className="flex items-center gap-2 border-b-2 border-[#22d3ee] bg-[#0e1520] px-4 py-3">
          <span className="grid size-7 place-items-center rounded-md border border-[#22d3ee] font-mono text-[10px] text-[#22d3ee]">RD</span>
          <span className="text-xs font-semibold tracking-wide">ACCESS PASS</span>
        </div>
        <img src={info.photo} alt="" className="mx-4 mt-4 aspect-[4/3.3] w-[calc(100%-2rem)] rounded-lg object-cover object-[50%_25%]" />
        <div className="p-4">
          <p className="text-lg font-semibold">{info.name}</p>
          <p className="font-mono text-[10px] tracking-wider text-[#22d3ee] uppercase">{info.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function LanyardIsland({ info }: { info: CardInfo }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!canUse3D()) return;
    const start = () => setEnabled(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(start, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative size-full">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: ready ? 0 : 1, pointerEvents: ready ? 'none' : 'auto' }}
        aria-hidden={ready}
      >
        <StaticCard info={info} />
      </div>
      {enabled && (
        <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
          <Suspense fallback={null}>
            <Lanyard info={info} onReady={() => setTimeout(() => setReady(true), 250)} />
          </Suspense>
        </div>
      )}
      <p className="pointer-events-none absolute right-0 bottom-2 left-0 text-center font-mono text-[11px] text-faint">
        {ready ? '↕ drag the card' : ' '}
      </p>
    </div>
  );
}
