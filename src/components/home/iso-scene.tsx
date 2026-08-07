"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import Logo3D from "./logo-3d";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- layout ----------
   Flat 2D, not isometric: nodes sit at even angles on a ring around the
   logo, and every trace starts on a smaller clearance ring rather than at
   dead centre. That clearance ring is what keeps the traces from ever
   crossing the mark — earlier they radiated from the centre point itself,
   so their opening segments ran directly behind the logo and showed
   through the transparent gaps in its letterforms. */

const CX = 300;
const CY = 265;
/** Comfortably clears the 168×232 logo's half-diagonal (~143px). */
const RING_R = 150;
const NODE_R = 220;

const NODES = [
  { id: "seo", label: "SEO", angle: -90 },
  { id: "ads", label: "Ads", angle: -30 },
  { id: "web", label: "Web", angle: 30 },
  { id: "brand", label: "Brand", angle: 90 },
  { id: "social", label: "Social", angle: 150 },
  { id: "data", label: "Data", angle: 210 },
];

function polar(angleDeg: number, r: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + Math.cos(rad) * r, CY + Math.sin(rad) * r];
}

/** Straight spoke from the clearance ring out to a node — never any closer
    to centre than RING_R, at any angle. */
function tracePath(angle: number) {
  const [sx, sy] = polar(angle, RING_R);
  const [ex, ey] = polar(angle, NODE_R);
  return `M${sx.toFixed(1)},${sy.toFixed(1)} L${ex.toFixed(1)},${ey.toFixed(1)}`;
}

export default function IsoScene({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Flat 2D drift only — no rotateX/rotateY tilt, so the circuit always
  // faces the viewer instead of skewing into a 3D read.
  const driftX = useTransform(mx, (v) => v * 16);
  const driftY = useTransform(my, (v) => v * 10);

  return (
    <div className="relative w-full max-w-[680px]" aria-hidden="true">
      <motion.svg
        viewBox="0 0 600 520"
        className="h-full w-full overflow-visible"
        style={{ x: driftX, y: driftY }}
      >
        <defs>
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

        {/* Beat 1 — the clearance ring settles in, framing the logo */}
        <motion.circle
          cx={CX}
          cy={CY}
          r={RING_R}
          fill="none"
          stroke="#fb3640"
          strokeOpacity="0.16"
          strokeWidth="1"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />

        {/* Beat 2 — circuit traces draw outward from the ring */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {NODES.map((n, i) => {
            const d = tracePath(n.angle);
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
                  transition={{ duration: 0.7, delay: 0.75 + i * 0.11, ease: EASE }}
                />
                <motion.path
                  d={d}
                  stroke="#fb3640"
                  strokeWidth="1.6"
                  filter="url(#neon)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.75 + i * 0.11, ease: EASE }}
                />
                {/* Beat 4 — data pulses keep travelling the traces */}
                <motion.path
                  d={d}
                  pathLength={100}
                  stroke="#fff2d1"
                  strokeWidth="2.2"
                  strokeDasharray="16 84"
                  filter="url(#neon)"
                  initial={{ strokeDashoffset: 100, opacity: 0 }}
                  animate={{ strokeDashoffset: [100, 0], opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 1.1,
                    delay: 1.9 + i * 0.28,
                    repeat: Infinity,
                    repeatDelay: 1.6,
                    ease: "linear",
                  }}
                />
              </g>
            );
          })}
        </g>

        {/* Beat 3 — capability nodes light up */}
        {NODES.map((n, i) => {
          const [sx, sy] = polar(n.angle, NODE_R);
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.3 + i * 0.1, ease: EASE }}
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

        {/* The core glow the logo sits inside */}
        <motion.circle
          cx={CX}
          cy={CY}
          r="150"
          fill="url(#coreGlow)"
          opacity="0.7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.85, delay: 0.35, ease: EASE }}
        />
      </motion.svg>

      {/* Faux-3D mark, floating inside the clearance ring. Kept in HTML
          rather than SVG so it can use real CSS 3D transforms for the
          extrusion — its own tilt is independent of the flat circuit
          around it. */}
      <motion.div
        className="absolute"
        style={{
          left: `${(CX / 600) * 100}%`,
          top: `${(CY / 520) * 100}%`,
          x: "-50%",
          y: "-50%",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 1.05, ease: EASE }}
      >
        <Logo3D mx={mx} my={my} size={168} />
      </motion.div>
    </div>
  );
}
