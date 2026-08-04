"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { MagneticLink } from "@/components/motion/magnetic";
import { hasIntroPlayed } from "@/components/motion/page-loader";
import HeroVisual from "./hero-visual";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE_LINES = [
  [{ text: "We are Hango.", accent: false }],
  [{ text: "Engineering Digital", accent: true }],
  [{ text: "Growth.", accent: true }],
];

export default function Hero({
  hook,
  body,
}: {
  hook: string;
  body: string;
}) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  // Wait out the intro loader on a cold load; start immediately on client-side nav.
  const [base] = useState(() => (hasIntroPlayed() ? 0.05 : 1.25));

  // Normalised pointer position (-0.5 … 0.5), springed for weight.
  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 90, damping: 20, mass: 0.7 });
  const my = useSpring(myRaw, { stiffness: 90, damping: 20, mass: 0.7 });

  function onMouseMove(e: React.MouseEvent) {
    if (reduce) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mxRaw.set((e.clientX - rect.left) / rect.width - 0.5);
    myRaw.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mxRaw.set(0);
    myRaw.set(0);
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="bg-noise relative overflow-hidden border-b border-black/5 bg-brand-cream"
    >
      {/* Slow-drifting ambient gradient */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="animate-drift absolute -left-1/4 top-[-30%] h-[70vw] w-[70vw] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(251,54,64,0.12) 0%, transparent 65%)",
          }}
        />
        <div
          className="animate-drift absolute -right-1/4 bottom-[-40%] h-[60vw] w-[60vw] rounded-full blur-3xl"
          style={{
            animationDelay: "-9s",
            background:
              "radial-gradient(circle, rgba(0,15,8,0.07) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h1 className="max-w-3xl text-5xl font-bold text-brand-black md:text-[5.5rem] md:leading-[0.95]">
            {HEADLINE_LINES.map((line, li) => (
              <span key={li} className="block overflow-hidden">
                <motion.span
                  className={`inline-block ${line[0].accent ? "text-brand-red" : ""}`}
                  initial={reduce ? undefined : { y: "110%" }}
                  animate={reduce ? undefined : { y: "0%" }}
                  transition={{ duration: 0.85, delay: base + li * 0.1, ease: EASE }}
                >
                  {line[0].text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-8 max-w-2xl text-xl font-medium text-brand-black md:text-2xl"
            initial={reduce ? undefined : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: base + 0.35, ease: EASE }}
          >
            {hook}
          </motion.p>

          <motion.p
            className="mt-4 max-w-xl text-brand-black/60"
            initial={reduce ? undefined : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: base + 0.47, ease: EASE }}
          >
            {body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={reduce ? undefined : { opacity: 0, y: 18 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: base + 0.59, ease: EASE }}
          >
            <MagneticLink href="/contact" className="btn-primary" arrow>
              Get a Quote
            </MagneticLink>
            <MagneticLink href="/services" className="btn-secondary">
              Explore Services
            </MagneticLink>
          </motion.div>
        </div>

        <motion.div
          className="hidden justify-self-center lg:flex"
          initial={reduce ? undefined : { opacity: 0, scale: 0.94 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: base + 0.1, ease: EASE }}
        >
          <HeroVisual mx={mx} my={my} />
        </motion.div>
      </div>

      <ScrollCue delay={base + 0.75} />
    </section>
  );
}

function ScrollCue({ delay }: { delay: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="relative z-10 flex flex-col items-center gap-2 pb-10"
      initial={reduce ? undefined : { opacity: 0 }}
      animate={reduce ? undefined : { opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      aria-hidden="true"
    >
      <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-brand-black/25 p-1.5">
        <motion.span
          className="block h-1.5 w-1 rounded-full bg-brand-red"
          animate={reduce ? undefined : { y: [0, 9, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs font-medium tracking-wide text-brand-black/40">
        Scroll to Explore
      </span>
    </motion.div>
  );
}
