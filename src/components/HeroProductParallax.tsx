import { useEffect, useRef } from 'react';
import side1 from '../assets/site/Encore-Homepage-Side-1.png';
import side2 from '../assets/site/Encore-Homepage-Side-2.png';
import centre from '../assets/site/Encore-Homepage-Centre.png';

// Replicates the live site's (efn.co.ke) scroll-linked hero product
// cluster — sampled 2026-08-24, since it was missing from this app's
// hero entirely (there was no carousel/animation here to regress; this
// feature was simply never ported over). On the live site the two side
// product cutouts start offset outward (translateX ±200px on desktop,
// ±50px on mobile) and slide inward as the row scrolls into view,
// converging into an overlapping cluster with the (larger, scaled)
// centre image on top. Ported from efn.co.ke's page-level <script> —
// same IntersectionObserver + scroll-progress math, as a React effect
// over refs instead of class-name queries. See docs/COMPARISON.md.
//
// Note: the source site's own file for the right-hand image is literally
// named "Centre" (a naming quirk on their end, not a typo here) — kept
// as downloaded rather than renamed, so it's traceable back to the source.
export function HeroProductParallax() {
  const leftRef = useRef<HTMLImageElement>(null);
  const rightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const els = [leftRef.current, rightRef.current].filter((e): e is HTMLImageElement => Boolean(e));
    if (els.length === 0) return;

    const inView = new WeakMap<HTMLImageElement, boolean>();
    const observers = els.map((el) => {
      const observer = new IntersectionObserver(([entry]) => inView.set(el, entry.isIntersecting), { threshold: 0 });
      observer.observe(el);
      return observer;
    });

    const getMaxOffset = () => {
      const w = window.innerWidth;
      if (w >= 1025) return 200;
      if (w <= 767) return 50;
      return 0;
    };

    const update = () => {
      const maxOffset = getMaxOffset();
      els.forEach((el) => {
        if (!inView.get(el)) return;
        const rect = el.getBoundingClientRect();
        const progress = 1 - Math.min(Math.max(rect.top / window.innerHeight, 0), 1);
        const offset = maxOffset * (1 - progress);
        const direction = el === leftRef.current ? 1 : -1;
        el.style.transform = `translateX(${direction * offset}px)`;
      });
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      observers.forEach((o) => o.disconnect());
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className="flex items-center justify-center -mb-10 md:-mb-20 select-none">
      <img
        ref={leftRef}
        src={side1}
        alt=""
        aria-hidden="true"
        className="w-[28%] max-w-[220px] object-contain relative z-[3] -mr-8 md:-mr-20 will-change-transform"
      />
      <img
        src={side2}
        alt=""
        aria-hidden="true"
        className="w-[46%] max-w-[380px] object-contain relative z-[5] scale-110"
      />
      <img
        ref={rightRef}
        src={centre}
        alt=""
        aria-hidden="true"
        className="w-[28%] max-w-[220px] object-contain relative z-[3] -ml-8 md:-ml-20 will-change-transform"
      />
    </div>
  );
}
