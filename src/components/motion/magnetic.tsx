"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const SPRING = { stiffness: 260, damping: 22, mass: 0.6 };

/**
 * Pulls the element slightly toward the pointer, then springs back.
 * `strength` is the max px offset at the element's edge.
 */
function useMagnet(strength: number) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relX * strength * 2);
    y.set(relY * strength * 2);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return { ref, sx, sy, onMove, onLeave };
}

export function MagneticLink({
  href,
  children,
  className,
  strength = 8,
  arrow = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  strength?: number;
  arrow?: boolean;
}) {
  const { ref, sx, sy, onMove, onLeave } = useMagnet(strength);

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy, display: "inline-block" }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
    >
      <Link href={href} className={`${className ?? ""} group`} data-cursor="button">
        {children}
        {arrow && <Arrow />}
      </Link>
    </motion.div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
    >
      <path
        fill="currentColor"
        d="M11.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4-1.4l3.3-3.3H3a1 1 0 1 1 0-2h11.6l-3.3-3.3a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}
