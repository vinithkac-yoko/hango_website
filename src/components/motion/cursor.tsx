"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

type CursorMode = "default" | "button" | "link" | "heading" | "card" | "image";

/** Ring geometry per mode. The inner dot stays constant except where noted. */
const RING: Record<
  CursorMode,
  { size: number; scaleX: number; scaleY: number; alpha: number; blur: number; glow: string }
> = {
  default: { size: 34, scaleX: 1, scaleY: 1, alpha: 0.32, blur: 0, glow: "none" },
  button: { size: 58, scaleX: 1, scaleY: 1, alpha: 0.5, blur: 0, glow: "0 0 26px 8px rgba(251,54,64,0.28)" },
  link: { size: 34, scaleX: 2.1, scaleY: 0.62, alpha: 0.45, blur: 0, glow: "none" },
  heading: { size: 46, scaleX: 1, scaleY: 1, alpha: 0.4, blur: 0, glow: "none" },
  card: { size: 66, scaleX: 1, scaleY: 1, alpha: 0.22, blur: 0, glow: "0 0 20px 6px rgba(251,54,64,0.16)" },
  image: { size: 62, scaleX: 1, scaleY: 1, alpha: 0.3, blur: 5, glow: "none" },
};

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
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  // The dot tracks almost instantly; the ring trails for weight.
  const dotX = useSpring(x, { stiffness: 1600, damping: 60, mass: 0.25 });
  const dotY = useSpring(y, { stiffness: 1600, damping: 60, mass: 0.25 });
  const ringX = useSpring(x, { stiffness: 340, damping: 32, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 340, damping: 32, mass: 0.55 });

  useEffect(() => {
    if (!enabled) return;
    document.body.dataset.customCursor = "on";

    function resolveMode(target: EventTarget | null): CursorMode {
      if (!(target instanceof Element)) return "default";
      if (target.closest("[data-cursor='image'], img")) return "image";
      if (target.closest("[data-cursor='button'], button, .btn-primary, .btn-secondary, .btn-secondary-invert"))
        return "button";
      if (target.closest("[data-cursor='card']")) return "card";
      if (target.closest("a")) return "link";
      if (target.closest("h1, h2, [data-cursor='heading']")) return "heading";
      return "default";
    }

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setMode(resolveMode(e.target));
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      delete document.body.dataset.customCursor;
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const r = RING[mode];

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-brand-red"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: r.size,
          height: r.size,
          opacity: visible ? r.alpha : 0,
          scaleX: r.scaleX * (pressed ? 0.86 : 1),
          scaleY: r.scaleY * (pressed ? 0.86 : 1),
          filter: r.blur ? `blur(${r.blur}px)` : "blur(0px)",
          boxShadow: r.glow,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.5 }}
      />
      {/* Inner dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-brand-red"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: mode === "default" ? 7 : 5,
          height: mode === "default" ? 7 : 5,
          opacity: visible && mode !== "image" ? 1 : 0,
          scale: pressed ? 0.7 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
    </>
  );
}
