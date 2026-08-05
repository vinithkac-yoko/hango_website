"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
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
    ([bx, by]: number[]) => `${bx}px ${by + 16}px 44px rgba(0,15,8,0.10)`,
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
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="grid gap-12 md:grid-cols-2 md:gap-20"
        style={{ perspective: 1200 }}
      >
        {/* Editorial quote — enters from the left */}
        <motion.h2
          className="text-2xl font-medium text-brand-black md:text-3xl"
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
          className="rounded-[18px] border-t border-black/10 pt-6"
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
              className="group relative border-b border-black/10 py-6"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.24 + i * 0.09, ease: EASE }}
              whileHover={{ y: -3 }}
            >
              <span className="pointer-events-none absolute inset-0 -mx-4 rounded-[14px] bg-brand-cream/0 transition-colors duration-500 group-hover:bg-brand-cream/70" />
              <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
              <h3 className="relative text-lg font-semibold text-brand-black">{value.title}</h3>
              <p className="relative mt-1 text-brand-black/60 transition-colors duration-500 group-hover:text-brand-black/80">
                {value.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/** Closing call to action — enters with a zoom-fade. */
export function ClosingCta() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="orb-c pointer-events-none absolute left-1/2 top-1/2 h-[58vw] w-[58vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(251,54,64,0.12) 0%, transparent 66%)" }}
      />
      <motion.div
        className="relative mx-auto max-w-6xl px-6 py-32 md:py-40"
        initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <h2 className="max-w-2xl text-3xl font-bold text-brand-black md:text-5xl">
          Ready to grow with Hango?
        </h2>
        <p className="mt-4 max-w-xl text-brand-black/60">
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
