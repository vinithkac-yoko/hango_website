"use client";

import { useMemo } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useTheme } from "next-themes";
import { buildFieldSvg } from "@/lib/nerve-field";
import { useMounted } from "@/lib/use-mounted";

/**
 * Sitewide ambient circuit field: neon "nerves" radiating from a bright core,
 * drifting slowly past as the page scrolls.
 *
 * Sits behind every section (surfaces above it are veiled rather than fully
 * opaque), so it reads as depth beneath the page rather than an overlay
 * across the text.
 *
 * The field is a rasterised background image, not live SVG, and the drift is
 * a transform on that single layer. Both matter: an inline <svg> of the same
 * field re-rasterised on every scroll frame, and a blend mode over the whole
 * viewport re-composited the screen — together they cost about half the
 * frame rate.
 */
/**
 * Drift as a share of the layer's own size. The layer is 140% of the viewport,
 * so it overhangs by 12vh — which is 12/124 ≈ 9.7% of the layer. Staying under
 * that keeps the field covering the screen at every scroll position. The
 * layer is kept only as large as the drift needs: its area is raster work on
 * every resize and blit work on every frame.
 */
const DRIFT_Y = 8;
const DRIFT_X = 3;

export default function NeonNerves() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  // Brand red glows on the dark canvas; on cream it has to go deeper to
  // register at all. Defaults to the dark value, matching ThemeProvider.
  const color = mounted && resolvedTheme === "light" ? "#b81d27" : "#fb3640";

  const image = useMemo(() => buildFieldSvg(color), [color]);

  const reduce = useReducedMotion();
  const rate = reduce ? 0 : 1;

  // Driven by document progress, not raw scrollY, and expressed as a share of
  // the layer so it stays inside the overhang — a raw-pixel drift slides the
  // field clean off a long page and leaves the bottom of the site bare.
  // Percentages rather than px keeps it correct at any viewport size without
  // tracking resizes; Lenis already smooths the scroll, so no spring needed.
  const { scrollYProgress } = useScroll();
  const driftY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${DRIFT_Y * rate}%`, `${-DRIFT_Y * rate}%`],
  );
  const driftX = useTransform(
    scrollYProgress,
    [0, 1],
    [`${DRIFT_X * rate}%`, `${-DRIFT_X * rate}%`],
  );

  return (
    <div className="nerve-root pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="nerve-layer absolute left-1/2 top-1/2 h-[124%] w-[124%] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: driftX,
          y: driftY,
          backgroundImage: `url("${image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
}
