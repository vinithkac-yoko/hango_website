"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal, WordReveal } from "@/components/motion/reveal";
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

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-12 md:grid-cols-2 md:gap-20">
        <h2 className="text-2xl font-medium text-brand-black md:text-3xl">
          <WordReveal text={`“${quote}”`} />
        </h2>

        <ul className="border-t border-black/10 pt-6">
          {items.map((value, i) => (
            <motion.li
              key={value.title}
              data-cursor="card"
              className="group relative border-b border-black/10 py-6"
              initial={reduce ? undefined : { opacity: 0, y: 22, filter: "blur(5px)" }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: EASE }}
              whileHover={reduce ? undefined : { y: -3 }}
            >
              <span className="pointer-events-none absolute inset-0 -mx-4 rounded-[14px] bg-brand-cream/0 transition-colors duration-500 group-hover:bg-brand-cream/60" />
              <span className="pointer-events-none absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-brand-red transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

              <h3 className="relative text-lg font-semibold text-brand-black">{value.title}</h3>
              <p className="relative mt-1 text-brand-black/60">{value.description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="animate-drift pointer-events-none absolute left-1/2 top-1/2 h-[55vw] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(251,54,64,0.1) 0%, transparent 65%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-32 md:py-40">
        <Reveal>
          <h2 className="max-w-2xl text-3xl font-bold text-brand-black md:text-5xl">
            Ready to grow with Hango?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mt-4 max-w-xl text-brand-black/60">
            Tell us about your business and we&apos;ll put together a plan.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div className="mt-8">
            <MagneticLink href="/contact" className="btn-primary" strength={10} arrow>
              Get in touch
            </MagneticLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
