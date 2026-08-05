"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "motion/react";
import {
  alignPoints,
  easeInOutCubic,
  lerpPoints,
  pointsToPath,
  samplePath,
  type Point,
} from "@/lib/path-morph";
import { MORPH_ICONS } from "@/data/morph-icons";

const SAMPLE_COUNT = 48;
const HOLD_MS = 1800;
const MORPH_MS = 950;

/**
 * Cycles an SVG path through the icon set in src/data/morph-icons.ts via
 * point-based interpolation (true morphing, not a crossfade). Pauses
 * off-screen via IntersectionObserver and freezes on the first shape when
 * the user prefers reduced motion.
 */
export default function MorphIcon({
  className,
  size = 120,
}: {
  className?: string;
  size?: number;
}) {
  const filterId = useId();
  const pathRef = useRef<SVGPathElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const pathEl = pathRef.current;
    if (!pathEl) return;

    const frames: Point[][] = [samplePath(MORPH_ICONS[0].d, SAMPLE_COUNT)];
    for (let i = 1; i < MORPH_ICONS.length; i++) {
      frames.push(alignPoints(frames[i - 1], samplePath(MORPH_ICONS[i].d, SAMPLE_COUNT)));
    }

    pathEl.setAttribute("d", pointsToPath(frames[0]));

    if (reduce || frames.length < 2) return;

    let raf = 0;
    let frameIndex = 0;
    let phase: "hold" | "morph" = "hold";
    let phaseStart = performance.now();

    function tick(now: number) {
      if (!visibleRef.current) {
        phaseStart = now;
        raf = requestAnimationFrame(tick);
        return;
      }
      const elapsed = now - phaseStart;

      if (phase === "hold") {
        if (elapsed >= HOLD_MS) {
          phase = "morph";
          phaseStart = now;
        }
      } else {
        const t = Math.min(1, elapsed / MORPH_MS);
        const from = frames[frameIndex];
        const to = frames[(frameIndex + 1) % frames.length];
        pathEl!.setAttribute("d", pointsToPath(lerpPoints(from, to, easeInOutCubic(t))));
        if (t >= 1) {
          frameIndex = (frameIndex + 1) % frames.length;
          phase = "hold";
          phaseStart = now;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--color-brand-red)"
          strokeWidth={1.6}
          strokeLinejoin="round"
          strokeLinecap="round"
          filter={`url(#${filterId})`}
          opacity={0.78}
        />
      </svg>
    </div>
  );
}
