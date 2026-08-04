"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The intro loader runs once per full page load. Client-side navigations keep
 * the layout mounted, so sections that stagger behind the intro read this to
 * skip the wait instead of sitting blank.
 */
let introPlayed = false;

export function hasIntroPlayed() {
  return introPlayed;
}

export default function PageLoader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      introPlayed = true;
      return;
    }
    const t = setTimeout(() => {
      introPlayed = true;
      setDone(true);
    }, 1200);
    return () => clearTimeout(t);
  }, [reduce]);

  const holding = !done && !reduce;

  useEffect(() => {
    document.body.style.overflow = holding ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [holding]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: EASE }}
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 110" className="h-20 w-auto" fill="none">
            {/* Hango mark: two offset bars forming an H */}
            <motion.path
              d="M18 8 v42 h28 v-42"
              stroke="var(--color-brand-red)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, ease: EASE }}
            />
            <motion.path
              d="M54 102 v-42 h28 v42"
              stroke="var(--color-brand-red)"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, delay: 0.12, ease: EASE }}
            />
          </svg>

          <div className="mt-8 h-[2px] w-32 overflow-hidden rounded-full bg-black/10">
            <motion.div
              className="h-full bg-brand-red"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              style={{ transformOrigin: "left" }}
              transition={{ duration: 1.05, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
