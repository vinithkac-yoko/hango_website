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
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { MagneticLink } from "@/components/motion/magnetic";
import { hasIntroPlayed } from "@/components/motion/page-loader";
import IsoScene from "./iso-scene";

const EASE = [0.16, 1, 0.3, 1] as const;

const HEADLINE_LINES = [
  { text: "We are Hango.", accent: false },
  { text: "Engineering Digital", accent: true },
  { text: "Growth.", accent: true },
];

const BURST = Array.from({ length: 14 }, (_, i) => {
  const angle = (i / 14) * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle), d: 60 + (i % 4) * 26 };
});

export default function Hero({ hook, body }: { hook: string; body: string }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentGridRef = useRef<HTMLDivElement>(null);
  const headlineOuterRef = useRef<HTMLDivElement>(null);
  const bodyOuterRef = useRef<HTMLDivElement>(null);
  const visualOuterRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const [base] = useState(() => (hasIntroPlayed() ? 0.05 : 1.25));
  const [burst, setBurst] = useState<{ id: number; x: number; y: number } | null>(null);

  // Scenes 2 & 3: once the load-in (scene 1) has settled, scrolling takes
  // over — the headline lifts, the visual expands, then the whole hero
  // compresses as the next section rises beneath it.
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=160%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(scrollCueRef.current, { opacity: 0, ease: "none" }, 0)
        .to(headlineOuterRef.current, { y: -46, ease: "none" }, 0)
        .to(bodyOuterRef.current, { y: -22, opacity: 0.82, ease: "none" }, 0)
        .to(visualOuterRef.current, { scale: 1.14, ease: "none" }, 0)
        .to(bgRef.current, { filter: "brightness(0.72) saturate(1.25)", ease: "none" }, 0)
        .addLabel("compress", 0.62)
        .to(contentGridRef.current, { scale: 0.97, opacity: 0.82, ease: "none" }, "compress")
        .to(bgRef.current, { opacity: 0.55, ease: "none" }, "compress");
    },
    { scope: sectionRef },
  );

  const mxRaw = useMotionValue(0);
  const myRaw = useMotionValue(0);
  const mx = useSpring(mxRaw, { stiffness: 90, damping: 20, mass: 0.7 });
  const my = useSpring(myRaw, { stiffness: 90, damping: 20, mass: 0.7 });

  const headX = useTransform(mx, (v) => v * 20);
  const headY = useTransform(my, (v) => v * 20);
  const paraX = useTransform(mx, (v) => v * 12);
  const paraY = useTransform(my, (v) => v * 12);
  const btnX = useTransform(mx, (v) => v * 8);
  const btnY = useTransform(my, (v) => v * 8);
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
      className="relative overflow-hidden veil-0"
      style={{ perspective: 1000 }}
    >
      {/* Circuit floor + ambient neon bloom */}
      <div ref={bgRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="circuit-floor absolute inset-0" />
        {/* Vignette keeps focus centred */}
        <div className="edge-light absolute inset-0" />
      </div>

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
                style={{ boxShadow: "0 0 12px rgba(251,54,64,0.9)" }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x * p.d, y: p.y * p.d, opacity: 0, scale: 0.3 }}
                transition={{ duration: 0.85, ease: EASE }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={contentGridRef}
        className="relative z-[2] mx-auto grid max-w-6xl items-center gap-12 px-6 pb-24 pt-32 md:pb-28 md:pt-36 lg:grid-cols-[1fr_1fr]"
      >
        <div>
          <div ref={headlineOuterRef}>
            <motion.h1
              className="max-w-3xl text-5xl font-bold text-ink md:text-[5rem] md:leading-[0.95]"
              style={{ x: headX, y: headY }}
            >
              {HEADLINE_LINES.map((line, li) => (
                <span key={line.text} className="block overflow-hidden pb-[0.08em]">
                  <motion.span
                    className={`inline-block ${line.accent ? "kinetic-accent neon-text" : ""}`}
                    initial={{ y: "108%", opacity: 0, filter: "blur(10px)", rotate: 1.6 }}
                    animate={{ y: "0%", opacity: 1, filter: "blur(0px)", rotate: 0 }}
                    transition={{ duration: 0.9, delay: base + li * 0.12, ease: EASE }}
                  >
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </div>

          <div ref={bodyOuterRef}>
            <motion.div
              className="mt-8 h-px w-40 neon-rule"
              style={{ x: paraX }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, delay: base + 0.3, ease: EASE }}
            />

            <motion.p
              className="mt-6 max-w-2xl text-xl font-medium text-ink md:text-2xl"
              style={{ x: paraX, y: paraY }}
              initial={{ opacity: 0, y: 22, filter: "blur(8px)", rotate: 0.6 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
              transition={{ duration: 0.8, delay: base + 0.4, ease: EASE }}
            >
              {hook}
            </motion.p>

            <motion.p
              className="mt-4 max-w-xl text-ink/55"
              style={{ x: paraX, y: paraY }}
              initial={{ opacity: 0, y: 22, filter: "blur(8px)", rotate: 0.5 }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", rotate: 0 }}
              transition={{ duration: 0.8, delay: base + 0.52, ease: EASE }}
            >
              {body}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap gap-4"
              style={{ x: btnX, y: btnY }}
              initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: base + 0.64, ease: EASE }}
            >
              <MagneticLink href="/contact" className="btn-primary" arrow>
                Get a Quote
              </MagneticLink>
              <MagneticLink href="/services" className="btn-secondary-invert" arrow>
                Explore Services
              </MagneticLink>
            </motion.div>
          </div>
        </div>

        <div ref={visualOuterRef} className="hidden justify-self-center lg:flex">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: base + 0.1, ease: EASE }}
          >
            <IsoScene mx={mx} my={my} />
          </motion.div>
        </div>
      </div>

      <div ref={scrollCueRef}>
        <ScrollCue delay={base + 0.9} />
      </div>
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
      <div className="flex h-9 w-[22px] items-start justify-center rounded-full border border-ink/25 p-1.5">
        <motion.span
          className="block h-1.5 w-1 rounded-full bg-brand-red"
          style={{ boxShadow: "0 0 10px rgba(251,54,64,0.9)" }}
          animate={{ y: [0, 9, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <span className="text-xs font-medium tracking-wide text-ink/35">Scroll to Explore</span>
    </motion.div>
  );
}
