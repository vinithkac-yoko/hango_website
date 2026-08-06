/**
 * Deterministic generator for the ambient neon "nerve" field — PCB-style
 * traces radiating from a bright core, the way the brand key art routes them:
 * axis-aligned runs broken by 45° elbows, with solder-point nodes at the
 * turns.
 *
 * Everything is seeded, so the server and the client generate byte-identical
 * geometry and hydration stays stable.
 */

export const FIELD_W = 1600;
export const FIELD_H = 1200;
const CX = FIELD_W / 2;
const CY = FIELD_H / 2;

/** mulberry32 — small, fast, deterministic. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Point = [number, number];

/**
 * Routes a trace outward using alternating straight runs and 45° elbows, so
 * it reads as etched copper rather than a hand-drawn squiggle.
 */
function route(x0: number, y0: number, x1: number, y1: number, rnd: () => number): Point[] {
  const pts: Point[] = [[x0, y0]];
  let x = x0;
  let y = y0;
  const sx = Math.sign(x1 - x0) || 1;
  const sy = Math.sign(y1 - y0) || 1;

  for (let guard = 0; guard < 10; guard++) {
    const remX = Math.abs(x1 - x);
    const remY = Math.abs(y1 - y);
    if (remX < 6 && remY < 6) break;

    if (remX >= remY) {
      const run = Math.max(28, (remX - remY) * (0.35 + rnd() * 0.5));
      x += sx * Math.min(run, remX);
      pts.push([x, y]);
      const diag = Math.min(Math.abs(x1 - x), Math.abs(y1 - y)) * (0.35 + rnd() * 0.45);
      if (diag > 10) {
        x += sx * diag;
        y += sy * diag;
        pts.push([x, y]);
      }
    } else {
      const run = Math.max(28, (remY - remX) * (0.35 + rnd() * 0.5));
      y += sy * Math.min(run, remY);
      pts.push([x, y]);
      const diag = Math.min(Math.abs(x1 - x), Math.abs(y1 - y)) * (0.35 + rnd() * 0.45);
      if (diag > 10) {
        x += sx * diag;
        y += sy * diag;
        pts.push([x, y]);
      }
    }
  }

  pts.push([x1, y1]);
  return pts;
}

function toPath(pts: Point[]) {
  return pts
    .map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`)
    .join(" ");
}

export type Trace = {
  d: string;
  /** Faint traces sit further back; bright ones carry the eye. */
  depth: number;
  nodes: Point[];
};

export function buildField(seed = 20260806): { traces: Trace[] } {
  const rnd = rng(seed);
  const traces: Trace[] = [];
  const RAYS = 22;

  for (let i = 0; i < RAYS; i++) {
    // Spread rays around the core, jittered so they never look like a fan.
    const angle = (i / RAYS) * Math.PI * 2 + (rnd() - 0.5) * 0.28;
    const startR = 26 + rnd() * 70;
    const x0 = CX + Math.cos(angle) * startR;
    const y0 = CY + Math.sin(angle) * startR;

    // Push the endpoint past the canvas edge so traces bleed off-frame.
    const endR = 780 + rnd() * 420;
    const x1 = CX + Math.cos(angle) * endR;
    const y1 = CY + Math.sin(angle) * endR * 0.78;

    const pts = route(x0, y0, x1, y1, rnd);
    const nodes = pts
      .slice(1, -1)
      .filter(() => rnd() > 0.45)
      .slice(0, 3);

    traces.push({ d: toPath(pts), depth: rnd(), nodes });
  }

  return { traces };
}

/**
 * Serialises the field to a data URI.
 *
 * Rendering this as a background image rather than live SVG matters: the
 * browser rasterises it once and the scroll drift becomes a plain GPU layer
 * move. Transforming an equivalent inline <svg> re-rasterised every frame and
 * cost roughly a third of the frame rate on its own.
 */
export function buildFieldSvg(color: string, seed?: number): string {
  const { traces } = buildField(seed);

  const body = traces
    .map((t) => {
      const halo = `<path d="${t.d}" fill="none" stroke="${color}" stroke-width="${(5 + t.depth * 4).toFixed(1)}" stroke-opacity="0.09" stroke-linecap="round" stroke-linejoin="round"/>`;
      const core = `<path d="${t.d}" fill="none" stroke="${color}" stroke-width="${(0.9 + t.depth * 0.7).toFixed(2)}" stroke-opacity="0.75" stroke-linecap="round" stroke-linejoin="round"/>`;
      const nodes = t.nodes
        .map(
          ([nx, ny]) =>
            `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="${(1.6 + t.depth * 1.4).toFixed(2)}" fill="${color}" fill-opacity="0.9"/>`,
        )
        .join("");
      return `<g opacity="${(0.35 + t.depth * 0.65).toFixed(2)}">${halo}${core}${nodes}</g>`;
    })
    .join("");

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FIELD_W} ${FIELD_H}">` +
    `<defs><radialGradient id="c" cx="50%" cy="50%" r="50%">` +
    `<stop offset="0%" stop-color="${color}" stop-opacity="0.55"/>` +
    `<stop offset="45%" stop-color="${color}" stop-opacity="0.12"/>` +
    `<stop offset="100%" stop-color="${color}" stop-opacity="0"/>` +
    `</radialGradient></defs>` +
    `<circle cx="${FIELD_W / 2}" cy="${FIELD_H / 2}" r="430" fill="url(#c)"/>` +
    `${body}</svg>`;

  // encodeURIComponent turns the gradient's "#c" reference into %23c, which is
  // what a data URI needs.
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
