"use client";

import { motion } from "motion/react";
import MorphIcon from "./morph-icon";

/**
 * Places a single morphing icon with a slow, GPU-composited drift.
 * Respects reduced motion automatically via the app-level MotionConfig.
 */
export default function MorphField({
  className,
  size = 110,
  driftY = 14,
  duration = 7,
}: {
  className?: string;
  size?: number;
  driftY?: number;
  duration?: number;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      animate={{ y: [0, -driftY, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <MorphIcon size={size} />
    </motion.div>
  );
}
