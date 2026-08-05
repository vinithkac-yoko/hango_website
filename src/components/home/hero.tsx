"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { MagneticLink } from "@/components/motion/magnetic";
import { hasIntroPlayed } from "@/components/motion/page-loader";
import HeroVisual from "./hero-visual";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE_LINES = [
  { text: "We are Hango.", accent: false },
  { text: "Engineering Digital", accent: true },
  { text: "Growth.", accent: true },
];

/** Particles for the double-click burst, pre-computed so render stays pure. */
const BURST = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle), d: 60 + (i % 4) * 26 };
});

export default function Hero({ hook, body }: { hook: string; body: string }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [base] = useState(() => (hasIntroPlayed() ? 0.05 : 1.25));
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null);

  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 90, damping: 20, mass: 0.7 });
  const my = useSpring(myRaw, { stiffness: 90, damping: 20, mass: 0.7 });

  // Layered depth: heading travels furthest, buttons least.
  const headX = useTransform(mx, (v) => v * 20);
  const headY = useTransform(my, (v) => v * 20);
  const paraX = useTransform(mx, (v) => v * 12);
  const paraY = useTransform(my, (v) => v * 12);
  const btnX = useTransform(mx, (v) => v * 8);
  const btnY = useTransform(my, (v) => v * 8);
  const orbAX = useTransform(mx, (v) => v * 42);
  const orbAY = useTransform(my, (v) => v * 42);
  const orbBX = useTransform(mx, (v) => v * -30);
  const orbBY = useTransform(my, (v) => v * -30);
  const orbCX = useTransform(mx, (v) => v * 18);
  const orbCY = useTransform(my, (v) => v * 18);

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

  function onDoubleClick(e: React.MouseEvent) {
    if (reduce) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setBurst({ id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onDoubleClick={onDoubleClick}
      className="bg-noise relative overflow-hidden border-b border-black/5 bg-brand-cream"
      style={{ perspective: 1000 }}
    >
      {/* Three liquid orbs, each on its own path and parallax rate */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="orb-a absolute -left-[15%] top-[-25%] h-[62vw] w-[62vw] rounded-full blur-3xl"
          style={{
            x: orbAX,
            y: orbAY,
            background: "radial-gradient(circle, rgba(251,54,64,0.18) 0%, transparent 66%)",
          }}
        />
        <motion.div
          className="orb-b absolute -right-[18%] top-[8%] h-[55vw] w-[55vw] rounded-full blur-3xl"
          style={{
            x: orbBX,
            y: orbBY,
            background: "radial-gradient(circle, rgba(255,168,92,0.16) 0%, transparent 66%)",
          }}
        />
        <motion.div
          className="orb-c absolute bottom-[-30%] left-[22%] h-[50vw] w-[50vw] rounded-full blur-3xl"
          style={{
            x: orbCX,
            y: orbCY,
            background: "radial-gradient(circle, rgba(255,242,209,0.9) 0%, transparent 68%)",
          }}
        />
      </div>

      {/* Double-click particle burst */}
      <AnimatePresence>
        {burst && (
          <motion.div
            key={burst.id}
            className="pointer-events-none absolute z-10"
            style={{ left: burst.x, top: burst.y }}
            onAnimationComplete={() => setBurst(null)}
            aria-hidden="true"
          >
            {BURST.map((p, i) => (
              <motion.span
                key={i}
                className="absolute block h-1.5 w-1.5 rounded-full bg-brand-red"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x * p.d, y: p.y * p.d, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-[2] mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.h1
            className="max-w-3xl text-5xl font-bold text-brand-black md:text-[5.5rem] md:leading-[0.95]"
            style={{ x: headX, y: headY }}
          >
            {HEADLINE_LINES.map((line, li) => (
              <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                <motion.span
                  className={`inline-block ${line.accent ? "kinetic-accent" : ""}`}
                  initial={
                    { y: "108%", opacity: 0, filter: "blur(10px)", rotate: 1.6 }
                  }
                  animate={
                    { y: "0%", opacity: 1, filter: "blur(0px)", rotate: 0 }
                  }
                  transition={{ duration: 0.9, delay: base + li * 0.12, ease: EASE }}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="mt-8 max-w-2xl text-xl font-medium text-brand-black md:text-2xl"
            style={{ x: paraX, y: paraY }}
            initial={{ opacity: 0, y: 22, filter: "blur(8px)", rotate: 0.6 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
            transition={{ duration: 0.8, delay: base + 0.36, ease: EASE }}
          >
            {hook}
          </motion.p>

          <motion.p
            className="mt-4 max-w-xl text-brand-black/60"
            style={{ x: paraX, y: paraY }}
            initial={{ opacity: 0, y: 22, filter: "blur(8px)", rotate: 0.5 }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
            transition={{ duration: 0.8, delay: base + 0.48, ease: EASE }}
          >
            {body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            style={{ x: btnX, y: btnY }}
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: base + 0.6, ease: EASE }}
          >
            <MagneticLink href="/contact" className="btn-primary" arrow>
              Get a Quote
            </MagneticLink>
            <MagneticLink href="/services" className="btn-secondary" arrow>
              Explore Services
            </MagneticLink>
          </motion.div>
        </div>

        <motion.div
          className="hidden justify-self-center lg:flex"
          initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.1, delay: base + 0.14, ease: EASE }}
        >
          <HeroVisual mx={mx} my={my} />
        </motion.div>
      </div>

      <ScrollCue delay={base + 0.8} />
    </section>
  );
}

function ScrollCue({ delay }: { delay: number }) {
  return (
    <motion.div
      className="relative z-[2] flex flex-col items-center gap-2 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      aria-hidden="true"
    >
      <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-brand-black/25 p-1.5">
        <motion.span
          className="block h-1.5 w-1 rounded-full bg-brand-red"
          animate={{ y: [0, 9, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs font-medium tracking-wide text-brand-black/40">
        Scroll to Explore
      </span>
    </motion.div>
  );
}
