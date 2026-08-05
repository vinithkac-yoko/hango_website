"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useReducedMotion,
} from "motion/react";

/** Subscribes to a media query without a synchronous setState in the effect body. */
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return matches;
}

/** A large, very soft radial light that follows the pointer. */
export function Spotlight() {
  const reduce = useReducedMotion();
  const pointerFine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = pointerFine && !reduce;

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.9 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.9 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[1] h-[760px] w-[760px] rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        opacity: 0.12,
        mixBlendMode: "soft-light",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 32%, rgba(255,255,255,0) 68%)",
      }}
    />
  );
}

/**
 * Cinematic film grain — sits above everything, below the cursor.
 * Hidden under reduced motion via CSS so the markup stays hydration-stable.
 */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="grain-root pointer-events-none fixed inset-0 z-[2] overflow-hidden"
      style={{ opacity: 0.028 }}
    >
      <div
        className="grain-layer absolute -inset-[8%]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23g)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/** Thin scroll-progress rail pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left rounded-full"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, var(--color-brand-red) 0%, #ff7a80 55%, var(--color-brand-red) 100%)",
      }}
    />
  );
}

/**
 * Easter eggs: "H" pulses the page, the Konami code nudges the logo.
 * Both are opt-in flourishes and no-ops under reduced motion.
 */
export function EasterEggs() {
  const reduce = useReducedMotion();
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (reduce) return;

    const KONAMI = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];
    let progress = 0;

    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      // Never hijack typing.
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      if (e.key.toLowerCase() === "h" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setPulse((p) => p + 1);
      }

      const expected = KONAMI[progress];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          window.dispatchEvent(new CustomEvent("hango:konami"));
        }
      } else {
        progress = e.key === KONAMI[0] ? 1 : 0;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [reduce]);

  return (
    <motion.div
      key={pulse}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[3]"
      style={{ background: "radial-gradient(circle at 50% 50%, rgba(251,54,64,0.16), transparent 70%)" }}
      initial={{ opacity: 0 }}
      animate={pulse > 0 ? { opacity: [0, 1, 0] } : { opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}
