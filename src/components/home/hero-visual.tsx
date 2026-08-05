"use client";

import { motion, type MotionValue, useTransform } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Nodes of the growth network, in a 300x300 viewBox. */
const NODES = [
  { id: "core", x: 150, y: 150, r: 13 },
  { id: "seo", x: 60, y: 72, r: 7 },
  { id: "ads", x: 236, y: 66, r: 7 },
  { id: "web", x: 264, y: 168, r: 7 },
  { id: "brand", x: 190, y: 258, r: 7 },
  { id: "social", x: 78, y: 232, r: 7 },
  { id: "data", x: 34, y: 158, r: 7 },
];

const EDGES = NODES.slice(1).map((n) => ({ from: NODES[0], to: n }));

/** Bars of the growth trend, rising left to right. */
const BARS = [
  { x: 96, h: 26 },
  { x: 120, h: 42 },
  { x: 144, h: 36 },
  { x: 168, h: 62 },
  { x: 192, h: 84 },
];

export default function HeroVisual({
  mx,
  my,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  // Layers drift at different rates for depth.
  const farX = useTransform(mx, (v) => v * 14);
  const farY = useTransform(my, (v) => v * 14);
  const nearX = useTransform(mx, (v) => v * 28);
  const nearY = useTransform(my, (v) => v * 28);

  return (
    <div className="relative aspect-square w-full max-w-[520px]" aria-hidden="true">
      {/* Ambient glow behind the graph */}
      <motion.div
        className="absolute inset-[12%] rounded-full blur-3xl"
        style={{
          x: farX,
          y: farY,
          background:
            "radial-gradient(circle, rgba(251,54,64,0.22) 0%, rgba(251,54,64,0.06) 45%, transparent 70%)",
        }}
      />

      <motion.svg
        viewBox="0 0 300 300"
        className="relative h-full w-full"
        style={{ x: nearX, y: nearY }}
      >
        <defs>
          <linearGradient id="barGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#fb3640" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#fb3640" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Connective tissue */}
        <g stroke="#fb3640" strokeOpacity="0.28" strokeWidth="1">
          {EDGES.map((e, i) => (
            <motion.line
              key={i}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.07, ease: EASE }}
            />
          ))}
        </g>

        {/* Growth trend */}
        <g>
          {BARS.map((b, i) => (
            <motion.rect
              key={b.x}
              x={b.x}
              width="13"
              rx="4"
              fill="url(#barGrad)"
              initial={{ height: 0, y: 214 }}
              whileInView={{ height: b.h, y: 214 - b.h }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.55 + i * 0.09, ease: EASE }}
            />
          ))}
        </g>

        {/* Satellite nodes */}
        {NODES.slice(1).map((n, i) => (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.45 + i * 0.07, ease: EASE }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          >
            <circle cx={n.x} cy={n.y} r={n.r + 5} fill="#fb3640" fillOpacity="0.1" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="#fb3640" fillOpacity="0.75" />
            <motion.circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="none"
                stroke="#fb3640"
                strokeOpacity="0.5"
                animate={{ r: [n.r, n.r + 12], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.6,
                  delay: i * 0.42,
                  repeat: Infinity,
                ease: "easeOut",
              }}
            />
          </motion.g>
        ))}

        {/* Core */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
          style={{ transformOrigin: "150px 150px" }}
        >
          <circle cx="150" cy="150" r="26" fill="#fb3640" fillOpacity="0.12" />
          <circle cx="150" cy="150" r="13" fill="#fb3640" />
        </motion.g>
      </motion.svg>
    </div>
  );
}
