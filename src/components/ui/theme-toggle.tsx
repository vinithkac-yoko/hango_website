"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useMounted } from "@/lib/use-mounted";

const SPRING = { type: "spring", stiffness: 480, damping: 32, mass: 0.6 } as const;

/**
 * Neumorphic light/dark toggle: the track sits in a pressed groove, the
 * thumb pops out of the surface, and the sun/moon glyph morphs as it
 * slides across. Defaults to the "dark" appearance before mount (matching
 * ThemeProvider's defaultTheme) so there's no structural hydration diff —
 * only the icon/position may need one animated correction once the real
 * stored preference is known, same pattern as the site's other
 * mount-then-sync hooks.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const reduce = useReducedMotion();

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
      aria-pressed={isDark}
      data-cursor="button"
      className={`theme-toggle relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 ${className ?? ""}`}
    >
      <motion.span
        className="theme-toggle-thumb relative flex h-6 w-6 items-center justify-center rounded-full text-brand-red"
        animate={{ x: isDark ? 0 : 24 }}
        transition={reduce ? { duration: 0 } : SPRING}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="moon"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              aria-hidden="true"
              initial={reduce ? false : { rotate: -70, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { rotate: 70, opacity: 0, scale: 0.6 }}
              transition={{ duration: reduce ? 0.001 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <path
                d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"
                fill="currentColor"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="sun"
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              initial={reduce ? false : { rotate: 70, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { rotate: -70, opacity: 0, scale: 0.6 }}
              transition={{ duration: reduce ? 0.001 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <circle cx="12" cy="12" r="4.2" fill="currentColor" stroke="none" />
              <path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
