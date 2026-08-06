"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "@/lib/gsap";
import { useInkColor } from "@/lib/use-ink-color";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Slight overshoot so the red reads as a "pop", not a fade — matches Growth Stack. */
const POP = { type: "spring", stiffness: 460, damping: 24, mass: 0.55 } as const;

export type PopRowItem = {
  key: string;
  title: string;
  description: string;
  /** Muted secondary line under the description. */
  sub?: string;
  /** Right-hand column, e.g. a pricing note. Replaces the arrow when set. */
  meta?: string;
};

/**
 * Editorial row list carrying the site's signature red pop. Rows light one
 * at a time as the page scrolls — whichever row sits nearest the reading
 * line — and mouse hover drives the exact same state, so scroll and pointer
 * never disagree about what's active.
 */
export default function PopRows({ items }: { items: readonly PopRowItem[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollActive, setScrollActive] = useState<number | null>(null);
  const ink = useInkColor();

  useGSAP(
    () => {
      if (!listRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const clear = () => setScrollActive((prev) => (prev === null ? prev : null));

      const st = ScrollTrigger.create({
        trigger: listRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          // Read-only measurement pass; picks the single row closest to the
          // reading line so exactly one is ever lit.
          const focus = window.innerHeight * 0.52;
          let best: number | null = null;
          let bestDist = Infinity;
          rowRefs.current.forEach((el, i) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            const dist = Math.abs(rect.top + rect.height / 2 - focus);
            if (dist < bestDist) {
              bestDist = dist;
              best = i;
            }
          });
          setScrollActive((prev) => (prev === best ? prev : best));
        },
        onLeave: clear,
        onLeaveBack: clear,
      });

      return () => st.kill();
    },
    { scope: listRef, dependencies: [items.length] },
  );

  return (
    <div ref={listRef} className="border-t border-ink/10">
      {items.map((item, i) => {
        const on = hovered === i || scrollActive === i;
        return (
          <div
            key={item.key}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            data-cursor="card"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="group relative grid gap-2 border-b border-ink/10 py-7 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-8"
          >
            {/* Red wash pops in behind the row */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -mx-5 rounded-[14px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(251,54,64,0.20) 0%, rgba(251,54,64,0.07) 45%, rgba(251,54,64,0) 80%)",
              }}
              initial={false}
              animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.965 }}
              transition={POP}
            />

            {/* Neon edge snaps up at the left */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -left-5 top-1/2 h-12 w-[3px] rounded-full bg-brand-red"
              style={{ y: "-50%", boxShadow: "0 0 16px rgba(251,54,64,0.9)" }}
              initial={false}
              animate={on ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
              transition={POP}
            />

            {/* Rule along the bottom fills in */}
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left bg-brand-red"
              style={{ boxShadow: "0 0 10px rgba(251,54,64,0.8)" }}
              initial={false}
              animate={on ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
            />

            <motion.h3
              className="relative font-semibold"
              initial={false}
              animate={
                on
                  ? { x: 10, color: "#fb3640", textShadow: "0 0 18px rgba(251,54,64,0.55)" }
                  : { x: 0, color: ink.hex, textShadow: "0 0 0px rgba(251,54,64,0)" }
              }
              transition={POP}
            >
              {item.title}
            </motion.h3>

            <div className="relative">
              <motion.p
                initial={false}
                animate={on ? { color: `rgba(${ink.rgb},0.88)` } : { color: `rgba(${ink.rgb},0.6)` }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                {item.description}
              </motion.p>
              {item.sub && <p className="mt-1.5 text-sm text-ink/30">{item.sub}</p>}
            </div>

            {item.meta ? (
              <p className="relative whitespace-nowrap text-sm text-brand-red md:text-right">
                {item.meta}
              </p>
            ) : (
              <motion.span
                aria-hidden="true"
                className="relative hidden text-brand-red md:block"
                initial={false}
                animate={on ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -10, scale: 0.7 }}
                transition={POP}
                style={{ filter: "drop-shadow(0 0 8px rgba(251,54,64,0.8))" }}
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z"
                  />
                </svg>
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}
