"use client";

import { motion } from "motion/react";
import { MagneticLink } from "@/components/motion/magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function GrowthStack({
  pillars,
}: {
  pillars: readonly { title: string; description: string }[];
}) {
  return (
    <section className="relative overflow-hidden bg-brand-black py-20 text-white md:py-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="orb-b pointer-events-none absolute -right-1/4 top-1/4 h-[45vw] w-[45vw] rounded-full blur-3xl"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(251,54,64,0.16) 0%, transparent 65%)" }}
      />

      {/* Section rises up as a whole */}
      <motion.div
        className="relative mx-auto max-w-6xl px-6"
        initial={{ opacity: 0, y: 64 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">The Growth Stack</h2>
        <p className="mt-4 max-w-xl text-white/60">
          Every pillar supports and amplifies the others, built as one integrated system — not
          services sold in isolation.
        </p>

        <div className="mt-12 border-t border-white/10">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              data-cursor="card"
              className="group relative grid items-baseline gap-3 border-b border-white/10 py-8 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:py-10 md:grid-cols-[1fr_2fr_auto] md:gap-12"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: EASE }}
            >
              <span className="pointer-events-none absolute inset-0 -mx-5 rounded-[14px] bg-white/0 transition-colors duration-500 group-hover:bg-white/[0.045]" />
              <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

              <h3 className="relative text-xl font-semibold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {pillar.title}
              </h3>

              <p className="relative max-w-2xl text-white/55 transition-colors duration-500 group-hover:text-white/85">
                {pillar.description}
              </p>

              {/* Arrow fades in from the left edge on hover */}
              <span
                aria-hidden="true"
                className="relative hidden -translate-x-2 text-brand-red opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:opacity-100 md:block"
              >
                <svg viewBox="0 0 20 20" className="h-5 w-5">
                  <path
                    fill="currentColor"
                    d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z"
                  />
                </svg>
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-12">
          <MagneticLink href="/services" className="btn-secondary-invert" arrow>
            View all services
          </MagneticLink>
        </div>
      </motion.div>
    </section>
  );
}
