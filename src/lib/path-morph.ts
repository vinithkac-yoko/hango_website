/**
 * Minimal shape-morphing kit: resamples arbitrary closed SVG paths into a
 * fixed number of evenly-spaced points, aligns their winding start so the
 * morph doesn't twist, then linearly interpolates between point sets.
 *
 * Client-only — relies on a live SVGPathElement to measure arc length, so
 * every export here must be called from an effect, never during render.
 */

export type Point = [number, number];

export function samplePath(d: string, count: number): Point[] {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  const len = path.getTotalLength();
  const pts: Point[] = [];
  for (let i = 0; i < count; i++) {
    const p = path.getPointAtLength((len * i) / count);
    pts.push([p.x, p.y]);
  }
  return pts;
}

export function pointsToPath(pts: Point[]): string {
  if (!pts.length) return "";
  const [first, ...rest] = pts;
  const seg = rest.map(([x, y]) => `L${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  return `M${first[0].toFixed(2)},${first[1].toFixed(2)} ${seg} Z`;
}

/** Rotates `b`'s point order to whichever cyclic offset best matches `a`. */
export function alignPoints(a: Point[], b: Point[]): Point[] {
  const n = a.length;
  let bestOffset = 0;
  let bestCost = Infinity;
  for (let offset = 0; offset < n; offset++) {
    let cost = 0;
    for (let i = 0; i < n; i++) {
      const [bx, by] = b[(i + offset) % n];
      const dx = a[i][0] - bx;
      const dy = a[i][1] - by;
      cost += dx * dx + dy * dy;
    }
    if (cost < bestCost) {
      bestCost = cost;
      bestOffset = offset;
    }
  }
  return Array.from({ length: n }, (_, i) => b[(i + bestOffset) % n]);
}

export function lerpPoints(a: Point[], b: Point[], t: number): Point[] {
  return a.map(([ax, ay], i) => {
    const [bx, by] = b[i];
    return [ax + (bx - ax) * t, ay + (by - ay) * t] as Point;
  });
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
