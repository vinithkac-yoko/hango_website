"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` lets Motion honour the OS setting internally: transform
 * and layout animations are dropped while opacity fades are kept. Handling it
 * here — rather than branching props on `useReducedMotion()` — keeps the server
 * and client trees identical, which is what hydration requires.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
