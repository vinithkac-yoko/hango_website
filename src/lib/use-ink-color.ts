"use client";

import { useTheme } from "next-themes";
import { useMounted } from "./use-mounted";

/**
 * Framer Motion's `animate` prop needs literal color values to interpolate
 * smoothly — it can't spring to/from a CSS var — so components that tween
 * between brand-red and the resting "ink" color read the resolved value
 * here instead of hardcoding white.
 */
export function useInkColor() {
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();
  const isLight = mounted && resolvedTheme === "light";

  return {
    hex: isLight ? "#14110b" : "#ffffff",
    rgb: isLight ? "20,17,11" : "255,255,255",
  };
}
