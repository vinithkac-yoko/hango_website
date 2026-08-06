"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { WordReveal } from "@/components/motion/reveal";
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
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const gridY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [24, -24]);

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
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 md:py-28"
    >
      <motion.div
        className="circuit-floor pointer-events-none absolute inset-0 opacity-70"
        style={{ y: gridY }}
        aria-hidden="true"
      />
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-20"
        style={{ perspective: 1200, y: contentY }}
      >
        {/* Editorial quote — enters from the left */}
        <motion.h2
          className="text-2xl font-medium text-white md:text-3xl"
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, x: -56, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <WordReveal text={`“${quote}”`} />
        </motion.h2>

        {/* Value list — enters from the right */}
        <motion.ul
          className="rounded-[18px] border-t border-white/10 pt-6"
          style={{ boxShadow }}
          initial={{ opacity: 0, x: 56, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.85, delay: 0.1, ease: EASE }}
        >
          {items.map((value, i) => (
            <motion.li
              key={value.title}
              data-cursor="card"
              className="group relative border-b border-white/10 py-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.24 + i * 0.09, ease: EASE }}
              whileHover={{ y: -3 }}
            >
              <span className="pointer-events-none absolute inset-0 -mx-4 rounded-[14px] bg-brand-red/0 transition-colors duration-500 group-hover:bg-brand-red/[0.07]" />
              <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <h3 className="relative text-lg font-semibold text-white transition-colors duration-500 group-hover:text-brand-red group-hover:[text-shadow:0_0_18px_rgba(251,54,64,0.55)]">
                {value.title}
              </h3>
              <p className="relative mt-1 text-white/55 transition-colors duration-500 group-hover:text-white/85">
                {value.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
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
