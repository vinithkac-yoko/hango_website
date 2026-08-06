"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";
import { MagneticLink } from "@/components/motion/magnetic";
import { useInkColor } from "@/lib/use-ink-color";

const EASE = [0.16, 1, 0.3, 1] as const;
/** Slight overshoot so the red reads as a "pop", not a fade — matches Growth Stack. */
const POP = { type: "spring", stiffness: 460, damping: 24, mass: 0.55 } as const;

export default function Values({
  quote,
  items,
}: {
  quote: string;
  items: readonly { title: string; description: string }[];
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLHeadingElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [scrollActive, setScrollActive] = useState<number | null>(null);
  const ink = useInkColor();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 110, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 110, damping: 18, mass: 0.6 });

  // Capped at 2° — enough to read as depth, never as a gimmick.
  const rotateY = useTransform(sx, [-0.5, 0.5], [-2, 2]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [2, -2]);
  const shadowX = useTransform(sx, [-0.5, 0.5], [18, -18]);
  const shadowY = useTransform(sy, [-0.5, 0.5], [14, -6]);
  const boxShadow = useTransform(
    [shadowX, shadowY],
    ([bx, by]: number[]) => `${bx}px ${by + 16}px 54px rgba(251,54,64,0.10)`,
  );

  function onMove(e: React.MouseEvent) {
    if (reduce) return;
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  // Pinned quote scene: the quote builds word by word, then each value
  // card gets its own scroll stage — highlighted one at a time (the same
  // red-pop treatment Growth Stack uses for its pillars), not all three
  // fading in together. The split runs synchronously in this same effect
  // (not via a state-driven hook) so this section's ScrollTrigger
  // registers in the same pass as Hero's and Growth Stack's — otherwise
  // it lands one render late, after its siblings have already measured
  // the page and gotten the wrong pin positions for it.
  useGSAP(
    () => {
      if (!sectionRef.current || !quoteRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const split = new SplitType(quoteRef.current, { types: "words", tagName: "span" });
      const words = split.words ?? [];
      if (!words.length) return;

      const wordsDuration = 1.3;
      const cardStageStart = wordsDuration + 0.2;
      const perCardStage = 0.9;
      const totalDuration = cardStageStart + items.length * perCardStage;

      gsap.set(words, { opacity: 0.14, filter: "blur(3px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const t = self.progress * totalDuration;
            const idx =
              t < cardStageStart
                ? null
                : Math.min(items.length - 1, Math.floor((t - cardStageStart) / perCardStage));
            setScrollActive((prev) => (prev === idx ? prev : idx));
          },
        },
      });

      tl.to(words, { opacity: 1, filter: "blur(0px)", stagger: 0.06, ease: "none", duration: wordsDuration }, 0);
      tl.to(gridRef.current, { yPercent: 14, ease: "none", duration: totalDuration }, 0);
      tl.to(
        contentRef.current,
        { scale: 0.97, opacity: 0.85, ease: "none", duration: 0.4 },
        totalDuration - 0.4,
      );

      return () => split.revert();
    },
    { scope: sectionRef, dependencies: [quote, items.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden veil-1 py-20 md:py-28"
    >
      <div ref={gridRef} className="circuit-floor pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
      <div
        ref={contentRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-20"
        style={{ perspective: 1200 }}
      >
        {/* Editorial quote — words build in as the section is pinned */}
        <motion.h2
          ref={quoteRef}
          className="text-2xl font-medium text-ink md:text-3xl"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          &ldquo;{quote}&rdquo;
        </motion.h2>

        {/* Value list — one card highlights per scroll stage, mouse hover still works too */}
        <motion.ul
          className="rounded-[18px] border-t border-ink/10 pt-6"
          style={{ boxShadow }}
        >
          {items.map((value, i) => {
            const on = hovered === i || scrollActive === i;
            return (
              <motion.li
                key={value.title}
                data-cursor="card"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative border-b border-ink/10 py-6"
              >
                {/* Red wash pops in behind the card */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -mx-4 rounded-[14px]"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(251,54,64,0.18) 0%, rgba(251,54,64,0.07) 48%, rgba(251,54,64,0) 82%)",
                  }}
                  initial={false}
                  animate={on ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.965 }}
                  transition={POP}
                />

                {/* Neon edge snaps up at the left */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-4 top-1/2 h-10 w-[3px] rounded-full bg-brand-red"
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
                  className="relative text-lg font-semibold"
                  initial={false}
                  animate={
                    on
                      ? { x: 10, color: "#fb3640", textShadow: "0 0 18px rgba(251,54,64,0.55)" }
                      : { x: 0, color: ink.hex, textShadow: "0 0 0px rgba(251,54,64,0)" }
                  }
                  transition={POP}
                >
                  {value.title}
                </motion.h3>

                <motion.p
                  className="relative mt-1"
                  initial={false}
                  animate={on ? { color: `rgba(${ink.rgb},0.88)` } : { color: `rgba(${ink.rgb},0.55)` }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  {value.description}
                </motion.p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}

/** Closing call to action — enters with a zoom-fade. */
export function ClosingCta() {
  return (
    <section className="relative overflow-hidden veil-0">
      <div className="circuit-floor pointer-events-none absolute inset-0" aria-hidden="true" />
      <motion.div
        className="relative mx-auto max-w-6xl px-6 py-32 md:py-40"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <h2 className="max-w-2xl text-3xl font-bold text-ink md:text-5xl">
          Ready to grow with Hango?
        </h2>
        <p className="mt-4 max-w-xl text-ink/55">
          Tell us about your business and we&apos;ll put together a plan.
        </p>
        <div className="mt-8">
          <MagneticLink href="/contact" className="btn-primary" strength={12} arrow>
            Get in touch
          </MagneticLink>
        </div>
      </motion.div>
    </section>
  );
}
