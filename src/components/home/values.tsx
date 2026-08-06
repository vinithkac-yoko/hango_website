"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useSplitWords } from "@/lib/use-split-words";
import { MagneticLink } from "@/components/motion/magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

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
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const words = useSplitWords(quoteRef, quote);

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
  // card steps in on its own beat, all scrubbed to scroll position.
  useGSAP(
    () => {
      if (!sectionRef.current || !words || !words.length) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = cardRefs.current.filter((el): el is HTMLLIElement => el !== null);

      gsap.set(words, { opacity: 0.14, filter: "blur(3px)" });
      gsap.set(cards, { opacity: 0, y: 24 });

      const cardStart = 1.5;
      const cardGap = 0.42;
      const totalDuration = cardStart + Math.max(0, cards.length - 1) * cardGap + 0.5;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(words, { opacity: 1, filter: "blur(0px)", stagger: 0.06, ease: "none", duration: 1.3 }, 0);
      cards.forEach((card, i) => {
        tl.to(card, { opacity: 1, y: 0, ease: "none", duration: 0.5 }, cardStart + i * cardGap);
      });
      tl.to(gridRef.current, { yPercent: 14, ease: "none", duration: totalDuration }, 0);
      tl.to(
        contentRef.current,
        { scale: 0.97, opacity: 0.85, ease: "none", duration: 0.4 },
        totalDuration - 0.4,
      );
    },
    { scope: sectionRef, dependencies: [words] },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 md:py-28"
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
          className="text-2xl font-medium text-white md:text-3xl"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          &ldquo;{quote}&rdquo;
        </motion.h2>

        {/* Value list — each card steps in on its own scroll beat */}
        <motion.ul
          className="rounded-[18px] border-t border-white/10 pt-6"
          style={{ boxShadow }}
        >
          {items.map((value, i) => (
            <li
              key={value.title}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              data-cursor="card"
              className="group relative border-b border-white/10 py-6"
            >
              <span className="pointer-events-none absolute inset-0 -mx-4 rounded-[14px] bg-brand-red/0 transition-colors duration-500 group-hover:bg-brand-red/[0.07]" />
              <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <h3 className="relative text-lg font-semibold text-white transition-colors duration-500 group-hover:text-brand-red group-hover:[text-shadow:0_0_18px_rgba(251,54,64,0.55)]">
                {value.title}
              </h3>
              <p className="relative mt-1 text-white/55 transition-colors duration-500 group-hover:text-white/85">
                {value.description}
              </p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/** Closing call to action — enters with a zoom-fade. */
export function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-0)]">
      <div className="circuit-floor pointer-events-none absolute inset-0" aria-hidden="true" />
      <motion.div
        className="relative mx-auto max-w-6xl px-6 py-32 md:py-40"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <h2 className="max-w-2xl text-3xl font-bold text-white md:text-5xl">
          Ready to grow with Hango?
        </h2>
        <p className="mt-4 max-w-xl text-white/55">
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
