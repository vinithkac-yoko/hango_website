"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ---------- shared isometric projection ---------- */

const U = 30;
const COS30 = 0.866;
const SIN30 = 0.5;
const CX = 210;
const CY = 190;

function iso(x: number, y: number, z = 0): [number, number] {
  return [(x - y) * COS30 * U + CX, (x + y) * SIN30 * U - z * U + CY];
}

const pt = (x: number, y: number, z = 0) => iso(x, y, z).join(",");

/** Top face of a plate spanning ±r on the grid, raised to height z. */
function plateTop(r: number, z = 0) {
  return [pt(-r, -r, z), pt(r, -r, z), pt(r, r, z), pt(-r, r, z)].join(" ");
}

/** The two visible sides of that plate, giving it thickness. */
function plateSides(r: number, z: number, t: number) {
  return {
    left: [pt(-r, r, z), pt(r, r, z), pt(r, r, z - t), pt(-r, r, z - t)].join(" "),
    right: [pt(r, -r, z), pt(r, r, z), pt(r, r, z - t), pt(r, -r, z - t)].join(" "),
  };
}

export type MotifKind = "layers" | "ascend" | "certificate" | "signal";

/* ---------- motif geometry ---------- */

/** Services — service tiers as separated plates. */
const LAYER_PLATES = [
  { r: 3.4, z: 0, t: 0.22 },
  { r: 2.7, z: 1.15, t: 0.2 },
  { r: 2.0, z: 2.3, t: 0.18 },
];

/** About — "to hang high", a climb in four steps. */
const STEPS = [
  { x: -2.4, y: 2.4, h: 0.85 },
  { x: -0.8, y: 0.8, h: 1.45 },
  { x: 0.8, y: -0.8, h: 2.05 },
  { x: 2.4, y: -2.4, h: 2.65 },
];

/** Internships — a certificate plane on a plinth. */
const SEAL = iso(0, 0, 1.55);

/** Contact — a beacon with expanding ground rings. */
const RINGS = [1.6, 2.5, 3.4];

export default function IsoMotif({
  kind,
  className,
}: {
  kind: MotifKind;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20, mass: 0.7 });
  const sy = useSpring(my, { stiffness: 90, damping: 20, mass: 0.7 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [8, -8]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-6, 6]);

  function onMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ perspective: 1200 }}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 420 360"
        className="h-full w-full overflow-visible"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <defs>
          <linearGradient id={`deck-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1b1710" />
            <stop offset="100%" stopColor="#0c0a06" />
          </linearGradient>
          <radialGradient id={`glow-${kind}`}>
            <stop offset="0%" stopColor="#fb3640" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#fb3640" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#fb3640" stopOpacity="0" />
          </radialGradient>
          <filter id={`neon-${kind}`} x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="3.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {kind === "layers" && <Layers kind={kind} />}
        {kind === "ascend" && <Ascend kind={kind} />}
        {kind === "certificate" && <Certificate kind={kind} />}
        {kind === "signal" && <Signal kind={kind} />}
      </motion.svg>
    </div>
  );
}

/* ---------- motifs ---------- */

function Layers({ kind }: { kind: MotifKind }) {
  return (
    <g>
      <circle cx={CX} cy={CY} r="120" fill={`url(#glow-${kind})`} opacity="0.5" />
      {LAYER_PLATES.map((p, i) => {
        const sides = plateSides(p.r, p.z, p.t);
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.14, ease: EASE }}
          >
            {/* Each plate breathes at its own rate, so the stack feels alive. */}
            <motion.g
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4.5 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              <polygon points={sides.left} fill="#0c0a06" />
              <polygon points={sides.right} fill="#14100a" />
              <polygon
                points={plateTop(p.r, p.z)}
                fill={`url(#deck-${kind})`}
                stroke="#fb3640"
                strokeOpacity={0.35 + i * 0.2}
                strokeWidth="1.3"
                filter={`url(#neon-${kind})`}
              />
            </motion.g>
          </motion.g>
        );
      })}
    </g>
  );
}

function Ascend({ kind }: { kind: MotifKind }) {
  return (
    <g>
      <circle cx={CX} cy={CY} r="120" fill={`url(#glow-${kind})`} opacity="0.45" />
      {STEPS.map((s, i) => {
        const r = 0.72;
        const top = [
          pt(s.x - r, s.y - r, s.h),
          pt(s.x + r, s.y - r, s.h),
          pt(s.x + r, s.y + r, s.h),
          pt(s.x - r, s.y + r, s.h),
        ].join(" ");
        const left = [
          pt(s.x - r, s.y + r, s.h),
          pt(s.x + r, s.y + r, s.h),
          pt(s.x + r, s.y + r, 0),
          pt(s.x - r, s.y + r, 0),
        ].join(" ");
        const right = [
          pt(s.x + r, s.y - r, s.h),
          pt(s.x + r, s.y + r, s.h),
          pt(s.x + r, s.y + r, 0),
          pt(s.x + r, s.y - r, 0),
        ].join(" ");
        const [mxp, myp] = iso(s.x, s.y, s.h);

        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.13, ease: EASE }}
          >
            <polygon points={left} fill="#0c0a06" />
            <polygon points={right} fill="#14100a" />
            <polygon
              points={top}
              fill={`url(#deck-${kind})`}
              stroke="#fb3640"
              strokeOpacity="0.5"
              strokeWidth="1.2"
              filter={`url(#neon-${kind})`}
            />
            {/* Marker that climbs step by step, on a loop */}
            <motion.circle
              cx={mxp}
              cy={myp - 10}
              r="4"
              fill="#fb3640"
              filter={`url(#neon-${kind})`}
              animate={{ opacity: [0, 1, 1, 0], y: [4, 0, 0, -4] }}
              transition={{
                duration: 3.2,
                delay: i * 0.55,
                repeat: Infinity,
                repeatDelay: STEPS.length * 0.55,
                ease: "easeOut",
              }}
            />
          </motion.g>
        );
      })}
    </g>
  );
}

function Certificate({ kind }: { kind: MotifKind }) {
  const sides = plateSides(3.2, 0, 0.24);
  const card = [pt(-1.9, -1.4, 1.5), pt(1.9, -1.4, 1.5), pt(1.9, 1.4, 1.5), pt(-1.9, 1.4, 1.5)].join(" ");

  return (
    <g>
      <circle cx={CX} cy={CY} r="118" fill={`url(#glow-${kind})`} opacity="0.45" />

      <motion.g
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <polygon points={sides.left} fill="#0c0a06" />
        <polygon points={sides.right} fill="#14100a" />
        <polygon points={plateTop(3.2)} fill={`url(#deck-${kind})`} stroke="#2b2519" strokeWidth="1" />
      </motion.g>

      {/* The certificate lifts off the plinth and hovers */}
      <motion.g
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
      >
        <motion.g
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <polygon
            points={card}
            fill="#1b1710"
            stroke="#fb3640"
            strokeOpacity="0.65"
            strokeWidth="1.4"
            filter={`url(#neon-${kind})`}
          />
          {/* Ruled lines on the certificate */}
          {[-0.5, 0, 0.5].map((o, i) => (
            <line
              key={i}
              x1={iso(-1.2, o, 1.5)[0]}
              y1={iso(-1.2, o, 1.5)[1]}
              x2={iso(1.2, o, 1.5)[0]}
              y2={iso(1.2, o, 1.5)[1]}
              stroke="#fff2d1"
              strokeOpacity="0.22"
              strokeWidth="1"
            />
          ))}
          <motion.circle
            cx={SEAL[0]}
            cy={SEAL[1]}
            r="7"
            fill="#fb3640"
            filter={`url(#neon-${kind})`}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      </motion.g>
    </g>
  );
}

function Signal({ kind }: { kind: MotifKind }) {
  const sides = plateSides(3.4, 0, 0.24);
  const beacon = iso(0, 0, 0);

  return (
    <g>
      <circle cx={CX} cy={CY} r="118" fill={`url(#glow-${kind})`} opacity="0.45" />

      <motion.g
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <polygon points={sides.left} fill="#0c0a06" />
        <polygon points={sides.right} fill="#14100a" />
        <polygon points={plateTop(3.4)} fill={`url(#deck-${kind})`} stroke="#2b2519" strokeWidth="1" />

        {/* Rings travelling outward across the deck */}
        {RINGS.map((r, i) => (
          <motion.polygon
            key={r}
            points={plateTop(r, 0.02)}
            fill="none"
            stroke="#fb3640"
            strokeWidth="1.4"
            filter={`url(#neon-${kind})`}
            animate={{ opacity: [0, 0.85, 0], scale: [0.75, 1.12, 1.25] }}
            transition={{
              duration: 3.4,
              delay: i * 1.1,
              repeat: Infinity,
              ease: "easeOut",
            }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />
        ))}
      </motion.g>

      {/* Beacon mast */}
      <motion.g
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
      >
        <line
          x1={beacon[0]}
          y1={beacon[1]}
          x2={beacon[0]}
          y2={beacon[1] - 58}
          stroke="#fb3640"
          strokeWidth="2"
          filter={`url(#neon-${kind})`}
        />
        <motion.circle
          cx={beacon[0]}
          cy={beacon[1] - 62}
          r="6"
          fill="#fb3640"
          filter={`url(#neon-${kind})`}
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
    </g>
  );
}
