import { pointsToPath, type Point } from "@/lib/path-morph";

/**
 * Blocky, low-poly icon silhouettes — deliberately stepped rather than
 * curved so they read as part of the same circuit/isometric visual
 * language as the rest of the site. All live in a shared 0-100 viewBox;
 * MorphIcon resamples each to a fixed point count, so vertex counts don't
 * need to match across shapes.
 */

function polar(cx: number, cy: number, r: number, angle: number): Point {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function gearPath(): string {
  const cx = 50;
  const cy = 50;
  const rOuter = 38;
  const rInner = 25;
  const teeth = 8;
  const step = (Math.PI * 2) / teeth;
  const toothWidth = step * 0.55;
  const pts: Point[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(polar(cx, cy, rInner, a));
    pts.push(polar(cx, cy, rOuter, a + toothWidth * 0.22));
    pts.push(polar(cx, cy, rOuter, a + toothWidth * 0.78));
    pts.push(polar(cx, cy, rInner, a + toothWidth));
  }
  return pointsToPath(pts);
}

export const MORPH_ICONS: { name: string; d: string }[] = [
  {
    // Megaphone — stepped horn, campaigns and reach.
    name: "megaphone",
    d: "M10,42 L10,58 L24,58 L24,66 L34,66 L34,74 L44,74 L44,26 L34,26 L34,34 L24,34 L24,42 Z",
  },
  {
    // Ascending bars — growth and analytics.
    name: "growth",
    d: "M12,82 L12,66 L30,66 L30,50 L48,50 L48,34 L66,34 L66,18 L82,18 L82,82 Z",
  },
  {
    // Gear — engineering and systems.
    name: "gear",
    d: gearPath(),
  },
  {
    // Rocket — launch and momentum.
    name: "rocket",
    d: "M50,10 L62,30 L62,60 L72,74 L62,74 L62,84 L38,84 L38,74 L28,74 L38,60 L38,30 Z",
  },
  {
    // Cursor — UX, clicks, conversions.
    name: "cursor",
    d: "M20,15 L20,80 L34,66 L44,86 L54,82 L44,60 L62,60 Z",
  },
  {
    // Cloud — hosting and infrastructure.
    name: "cloud",
    d: "M25,60 L25,50 L35,50 L35,40 L50,40 L50,32 L65,32 L65,40 L78,40 L78,50 L88,50 L88,60 L82,60 L82,68 L28,68 L28,60 Z",
  },
];
