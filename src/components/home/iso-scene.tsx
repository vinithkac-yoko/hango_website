"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Logo3D from "./logo-3d";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- isometric projection ---------- */

const U = 44; // grid unit in px
const COS30 = 0.866;
const SIN30 = 0.5;
const CX = 300;
const CY = 265;

/** Grid space (x, y, height z) -> screen space. */
function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * COS30 * U + CX, (x + y) * SIN30 * U - z * U + CY];
}

const pt = (x: number, y: number, z = 0) => iso(x, y, z).join(",");

/* ---------- scene layout ---------- */

/** The six capabilities that radiate from the core. */
const NODES = [
  { id: "seo", x: -3.4, y: -3.4, label: "SEO" },
  { id: "ads", x: 3.4, y: -3.4, label: "Ads" },
  { id: "web", x: 4.2, y: 0.6, label: "Web" },
  { id: "brand", x: 1.4, y: 3.8, label: "Brand" },
  { id: "social", x: -2.6, y: 3.8, label: "Social" },
  { id: "data", x: -4.2, y: 0.4, label: "Data" },
];

/** Right-angled circuit routing, like traces on a board. */
function tracePath(nx: number, ny: number) {
  const a = iso(0, 0, 0.34);
  const b = iso(nx, 0, 0.34);
  const c = iso(nx, ny, 0.34);
  return `M${a[0]},${a[1]} L${b[0]},${b[1]} L${c[0]},${c[1]}`;
}

const PLATFORM = [
  pt(-5.6, -5.6),
  pt(5.6, -5.6),
  pt(5.6, 5.6),
  pt(-5.6, 5.6),
].join(" ");

const PLATFORM_SIDE_L = [
  pt(-5.6, 5.6),
  pt(5.6, 5.6),
  pt(5.6, 5.6, -0.5),
  pt(-5.6, 5.6, -0.5),
].join(" ");

const PLATFORM_SIDE_R = [
  pt(5.6, -5.6),
  pt(5.6, 5.6),
  pt(5.6, 5.6, -0.5),
  pt(5.6, -5.6, -0.5),
].join(" ");

/** Core pedestal — a raised plinth the mark sits on. */
const PLINTH_TOP = [
  pt(-1.5, -1.5, 0.34),
  pt(1.5, -1.5, 0.34),
  pt(1.5, 1.5, 0.34),
  pt(-1.5, 1.5, 0.34),
].join(" ");

const PLINTH_L = [
  pt(-1.5, 1.5, 0.34),
  pt(1.5, 1.5, 0.34),
  pt(1.5, 1.5, 0),
  pt(-1.5, 1.5, 0),
].join(" ");

const PLINTH_R = [
  pt(1.5, -1.5, 0.34),
  pt(1.5, 1.5, 0.34),
  pt(1.5, 1.5, 0),
  pt(1.5, -1.5, 0),
].join(" ");

/** Faint isometric floor grid. */
const GRID_LINES: string[] = [];
for (let i = -5; i <= 5; i += 1) {
  GRID_LINES.push(`M${pt(i, -5.6)} L${pt(i, 5.6)}`);
  GRID_LINES.push(`M${pt(-5.6, i)} L${pt(5.6, i)}`);
}

export default function IsoScene({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Gentle pointer-driven tilt — the diorama leans toward the cursor.
  const rotY = useTransform(mx, [-0.5, 0.5], [7, -7]);
  const rotX = useTransform(my, [-0.5, 0.5], [-5, 5]);
  const driftX = useTransform(mx, (v) => v * 16);
  const driftY = useTransform(my, (v) => v * 10);

  return (
    <motion.div
      className="relative w-full max-w-[680px]"
      style={{ perspective: 1400 }}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 600 520"
        className="h-full w-full overflow-visible"
        style={{ rotateX: rotX, rotateY: rotY, x: driftX, y: driftY, transformStyle: "preserve-3d" }}
      >
        <defs>
          <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b1710" />
            <stop offset="100%" stopColor="#0c0a06" />
          </linearGradient>
          <linearGradient id="plinth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#241e14" />
            <stop offset="100%" stopColor="#14100a" />
          </linearGradient>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#fb3640" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#fb3640" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#fb3640" stopOpacity="0" />
          </radialGradient>
          <filter id="neon" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softNeon" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>

        {/* Beat 1 — the deck settles in */}
        <motion.g
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <polygon points={PLATFORM_SIDE_L} fill="#070503" />
          <polygon points={PLATFORM_SIDE_R} fill="#110e09" />
          <polygon points={PLATFORM} fill="url(#deck)" stroke="#2b2519" strokeWidth="1" />

          <g stroke="#fff2d1" strokeOpacity="0.07" strokeWidth="0.75">
            {GRID_LINES.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </motion.g>

        {/* Beat 2 — circuit traces draw outward from the core */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {NODES.map((n, i) => {
            const d = tracePath(n.x, n.y);
            return (
              <g key={n.id}>
                <motion.path
                  d={d}
                  stroke="#fb3640"
                  strokeOpacity="0.28"
                  strokeWidth="5"
                  filter="url(#softNeon)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.75 + i * 0.11, ease: EASE }}
                />
                <motion.path
                  d={d}
                  stroke="#fb3640"
                  strokeWidth="1.6"
                  filter="url(#neon)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.75 + i * 0.11, ease: EASE }}
                />
                {/* Beat 5 — data pulses keep travelling the traces */}
                <motion.path
                  d={d}
                  stroke="#fff2d1"
                  strokeWidth="2.2"
                  strokeDasharray="10 460"
                  filter="url(#neon)"
                  initial={{ strokeDashoffset: 470, opacity: 0 }}
                  animate={{ strokeDashoffset: [470, 0], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2.8,
                    delay: 2.1 + i * 0.45,
                    repeat: Infinity,
                    repeatDelay: 2.4,
                    ease: "linear",
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Beat 3 — capability nodes light up */}
        {NODES.map((n, i) => {
          const [sx, sy] = iso(n.x, n.y, 0.34);
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.5 + i * 0.1, ease: EASE }}
              style={{ transformOrigin: `${sx}px ${sy}px` }}
            >
              <circle cx={sx} cy={sy} r="30" fill="url(#coreGlow)" opacity="0.6" />
              <polygon
                points={[
                  `${sx},${sy - 9}`,
                  `${sx + 11},${sy}`,
                  `${sx},${sy + 9}`,
                  `${sx - 11},${sy}`,
                ].join(" ")}
                fill="#0e0b07"
                stroke="#fb3640"
                strokeWidth="1.6"
                filter="url(#neon)"
              />
              <motion.circle
                cx={sx}
                cy={sy}
                r="4"
                fill="#fb3640"
                filter="url(#neon)"
                animate={{ opacity: [0.55, 1, 0.55] }}
                transition={{ duration: 2.4, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>
          );
        })}

        {/* Beat 4 — the core plinth rises and the mark ignites */}
        <motion.g
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.35, ease: EASE }}
        >
          <circle cx={CX} cy={CY - 0.34 * U} r="120" fill="url(#coreGlow)" opacity="0.7" />
          <polygon points={PLINTH_L} fill="#0c0a06" />
          <polygon points={PLINTH_R} fill="#14100a" />
          <polygon
            points={PLINTH_TOP}
            fill="url(#plinth)"
            stroke="#fb3640"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            filter="url(#neon)"
          />
        </motion.g>
      </motion.svg>

      {/* Faux-3D mark, parked on the plinth. Kept in HTML rather than SVG so it
          can use real CSS 3D transforms for the extrusion. */}
      <motion.div
        className="absolute"
        style={{
          left: `${(CX / 600) * 100}%`,
          top: `${((CY - 0.34 * U) / 520) * 100}%`,
          x: "-50%",
          y: "-72%",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
      >
        <Logo3D mx={mx} my={my} />
      </motion.div>
    </motion.div>
  );
}
