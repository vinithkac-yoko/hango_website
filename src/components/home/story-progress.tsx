"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Premium vertical scrollspy for the homepage's cinematic scroll journey.
 * Tracks how far through #targetId the viewport has travelled, spring-
 * smoothed so it never feels like it's snapping to the raw scroll value.
 */
export default function StoryProgress({
  targetId,
  labels,
}: {
  targetId: string;
  labels: readonly string[];
}) {
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.5 });
  const scaleY = useTransform(smooth, (v) => v);
  const frame = useRef(0);

  useEffect(() => {
    function onScroll() {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const root = document.getElementById(targetId);
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        raw.set(p);
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId, raw]);

  return (
    <div
      className="pointer-events-none fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-hidden="true"
    >
      <div className="relative h-44 w-[3px] rounded-full bg-white/10">
        <motion.div
          className="absolute inset-x-0 top-0 origin-top rounded-full bg-brand-red"
          style={{ scaleY, height: "100%", boxShadow: "0 0 12px rgba(251,54,64,0.85)" }}
        />
        {labels.map((label, i) => (
          <span
            key={label}
            className="absolute right-0 h-1.5 w-1.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/25"
            style={{ top: `${(i / (labels.length - 1)) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}
