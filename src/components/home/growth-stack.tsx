"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticLink } from "@/components/motion/magnetic";
import MorphField from "@/components/motion/morph-field";
import { useInkColor } from "@/lib/use-ink-color";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Slight overshoot so the red reads as a "pop", not a fade. */
const POP = { type: "spring", stiffness: 460, damping: 24, mass: 0.55 } as const;

/** Scroll travel per pillar while the scene is pinned. */
const STAGE_VH = 55;
/**
 * Share of the pin spent stepping through pillars. The remaining tail holds
 * the final pillar on screen and plays the hand-off, so the scene never
 * unpins the instant the last one lights up.
 */
const SPOTLIGHT_SPAN = 0.9;

export default function GrowthStack({
  pillars,
}: {
  pillars: readonly { title: string; description: string }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollActive, setScrollActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ink = useInkColor();

  // One pillar activates per scroll stage, using the same red-pop treatment
  // mouse hover triggers elsewhere.
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const stages = pillars.length;
      const clear = () => setScrollActive((prev) => (prev === null ? prev : null));

      // Pin only when the whole scene genuinely fits the viewport. Pinning a
      // section taller than the screen freezes it with its last pillars (and
      // the CTA) below the fold, so they light up unseen and read as arriving
      // late. Short or narrow screens scroll naturally instead, with the same
      // spotlight following the reading line.
      const fits =
        window.innerWidth >= 768 &&
        sectionRef.current.offsetHeight <= window.innerHeight + 4;

      if (!fits) {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: () => {
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
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${stages * STAGE_VH}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Even share per pillar across the spotlight span; the tail holds
            // the last one rather than giving it a double-length stage.
            const idx = Math.min(
              stages - 1,
              Math.floor((self.progress / SPOTLIGHT_SPAN) * stages),
            );
            setScrollActive((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      tl.to(gridRef.current, { yPercent: 16, ease: "none", duration: 1 }, 0);
      tl.to(
        contentRef.current,
        { scale: 0.97, opacity: 0.85, ease: "none", duration: 1 - SPOTLIGHT_SPAN },
        SPOTLIGHT_SPAN,
      );
    },
    { scope: sectionRef, dependencies: [pillars.length] },
  );

  return (
    // Centred in a viewport-tall frame so the pinned scene shows every pillar
    // and the CTA at once — the spotlight must never land on a row that's
    // scrolled out of sight.
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden veil-1 pb-16 pt-28 text-ink md:pb-20 md:pt-32"
    >
      <div ref={gridRef} className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <MorphField className="pointer-events-none absolute right-10 top-14 hidden opacity-60 lg:block" />

      <div ref={contentRef} className="relative mx-auto w-full max-w-6xl px-6">
        <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">The Growth Stack</h2>
        <p className="mt-3 max-w-xl text-ink/60">
          Every pillar supports and amplifies the others, built as one integrated system — not
          services sold in isolation.
        </p>

        <div className="mt-8 border-t border-ink/10">
          {pillars.map((pillar, i) => {
            const on = hovered === i || scrollActive === i;
            return (
              <motion.div
                key={pillar.title}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                data-cursor="card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative grid items-baseline gap-2 border-b border-ink/10 py-5 md:grid-cols-[1fr_2fr_auto] md:gap-12"
              >
                {/* Red wash pops in behind the row */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -mx-5 rounded-[14px]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(251,54,64,0.22) 0%, rgba(251,54,64,0.08) 42%, rgba(251,54,64,0) 78%)",
                  }}
                  initial={false}
                  animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.965 }}
                  transition={POP}
                />

                {/* Neon edge snaps up at the left */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-5 top-1/2 h-14 w-[3px] rounded-full bg-brand-red"
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
                  className="relative text-xl font-semibold"
                  initial={false}
                  animate={
                    on
                      ? {
                          x: 12,
                          color: "#fb3640",
                          textShadow: "0 0 18px rgba(251,54,64,0.55)",
                        }
                      : { x: 0, color: ink.hex, textShadow: "0 0 0px rgba(251,54,64,0)" }
                  }
                  transition={POP}
                >
                  {pillar.title}
                </motion.h3>

                <motion.p
                  className="relative max-w-2xl"
                  initial={false}
                  animate={on ? { color: `rgba(${ink.rgb},0.88)` } : { color: `rgba(${ink.rgb},0.55)` }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {pillar.description}
                </motion.p>

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
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8">
          <MagneticLink href="/services" className="btn-secondary-invert" arrow>
            View all services
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
