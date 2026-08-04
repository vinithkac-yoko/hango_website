"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type CursorMode = "default" | "button" | "heading" | "card";

const MODES: Record<CursorMode, { size: number; border: number; fill: string; scaleX: number }> = {
  default: { size: 10, border: 0, fill: "var(--color-brand-red)", scaleX: 1 },
  button: { size: 42, border: 0, fill: "rgba(251,54,64,0.28)", scaleX: 1 },
  heading: { size: 46, border: 1.5, fill: "transparent", scaleX: 1 },
  card: { size: 26, border: 0, fill: "rgba(251,54,64,0.22)", scaleX: 1.5 },
};

/** True only on real pointer devices; evaluated once, after hydration. */
function usePointerFine() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return fine;
}

export default function Cursor() {
  const reduce = useReducedMotion();
  const pointerFine = usePointerFine();
  const enabled = pointerFine && !reduce;
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 42, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 42, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    document.body.dataset.customCursor = "on";

    function resolveMode(target: EventTarget | null): CursorMode {
      if (!(target instanceof Element)) return "default";
      if (target.closest("[data-cursor='button'], a, button")) return "button";
      if (target.closest("[data-cursor='card']")) return "card";
      if (target.closest("h1, h2, [data-cursor='heading']")) return "heading";
      return "default";
    }

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setMode(resolveMode(e.target));
    }
    function onLeave() {
      setVisible(false);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      delete document.body.dataset.customCursor;
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const m = MODES[mode];

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full"
      style={{
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        mixBlendMode: mode === "heading" ? "difference" : "normal",
      }}
      animate={{
        width: m.size,
        height: m.size,
        opacity: visible ? 1 : 0,
        backgroundColor: m.fill,
        borderWidth: m.border,
        borderColor: mode === "heading" ? "#ffffff" : "transparent",
        scaleX: m.scaleX,
        boxShadow: mode === "button" ? "0 0 24px 6px rgba(251,54,64,0.35)" : "0 0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26, mass: 0.5 }}
    />
  );
}
