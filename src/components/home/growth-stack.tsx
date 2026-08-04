"use client";

import { motion, useReducedMotion } from "motion/react";
import { MagneticLink } from "@/components/motion/magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function GrowthStack({
  pillars,
}: {
  pillars: readonly { title: string; description: string }[];
}) {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-brand-black py-20 text-white md:py-28">
      {/* Subtle grid + drifting glow */}
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="animate-drift pointer-events-none absolute -right-1/4 top-1/4 h-[45vw] w-[45vw] rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(251,54,64,0.16) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.h2
          className="max-w-2xl text-3xl font-bold md:text-5xl"
          initial={reduce ? undefined : { opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          The Growth Stack
        </motion.h2>
        <motion.p
          className="mt-4 max-w-xl text-white/60"
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
        >
          Every pillar supports and amplifies the others, built as one integrated system —
          not services sold in isolation.
        </motion.p>

        <div className="mt-12 border-t border-white/10">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              data-cursor="card"
              className="group relative grid gap-3 border-b border-white/10 py-8 md:grid-cols-[1fr_2fr] md:gap-12"
              initial={reduce ? undefined : { opacity: 0, x: -28 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.06, ease: EASE }}
            >
              {/* Row lights up on hover */}
              <span className="pointer-events-none absolute inset-0 -mx-4 rounded-[14px] bg-white/0 transition-colors duration-500 group-hover:bg-white/[0.035]" />
              {/* Red progress line expands */}
              <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

              <h3 className="relative flex items-center gap-3 text-xl font-semibold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 text-brand-red transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90"
                >
                  <path
                    fill="currentColor"
                    d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z"
                  />
                </svg>
                {pillar.title}
              </h3>
              <p className="relative max-w-2xl text-white/60 transition-colors duration-500 group-hover:text-white/80">
                {pillar.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12"
          initial={reduce ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <MagneticLink href="/services" className="btn-secondary-invert" arrow>
            View all services
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
}
