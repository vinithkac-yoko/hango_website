"use client";

import { useRef, useState, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Card wrapper: a scroll-linked entrance (offset by index so a grid arrives
 * as a wave) plus a hover pop that lifts the card and lights its edge red.
 *
 * The hover state is published as `data-pop` on the container, so ordinary
 * server-rendered children can respond with `group-data-[pop=on]:` utilities
 * instead of every card needing to become a client component itself.
 *
 * The lift uses the standalone `translate` property rather than a transform
 * utility, because GSAP owns `transform` here for the entrance — the two
 * compose instead of overwriting each other.
 */
export default function PopCard({
  children,
  index = 0,
  className = "",
  featured = false,
  lift = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  /** Permanently lit (e.g. a recommended pricing tier). */
  featured?: boolean;
  /** Set false for bare list entries that shouldn't physically move. */
  lift?: boolean;
  /** Use "li" when the card sits directly inside a <ul>. */
  as?: "div" | "li";
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [on, setOn] = useState(false);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        ref.current,
        { y: 42 + index * 8, opacity: 0.25 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 94%",
            end: "top 62%",
            scrub: 0.8,
          },
        },
      );
    },
    { scope: ref, dependencies: [index] },
  );

  return (
    <Tag
      ref={ref}
      data-cursor="card"
      data-pop={on || featured ? "on" : "off"}
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      className={`group relative ${className}`}
      style={{
        translate: on && lift ? "0 -6px" : "0 0",
        borderColor: on || featured ? "rgba(251,54,64,0.55)" : undefined,
        boxShadow: on || featured ? "0 0 28px rgba(251,54,64,0.18)" : undefined,
        transition:
          "translate var(--dur-base) var(--ease-out-expo), border-color var(--dur-base) var(--ease-out-expo), box-shadow var(--dur-base) var(--ease-out-expo)",
      }}
    >
      {children}
    </Tag>
  );
}
