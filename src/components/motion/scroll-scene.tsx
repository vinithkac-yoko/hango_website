"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Section wrapper whose content entrance and background drift are both tied
 * to scroll position rather than autoplaying once on view — the same
 * scroll-controlled feel as the homepage scenes, minus the pinning (inner
 * pages should still scroll naturally; pinning every section fights that).
 *
 * Content renders visible by default and GSAP only takes over when motion
 * is allowed, so a failed script or reduced-motion never hides the page.
 */
export default function ScrollScene({
  children,
  className = "",
  bg,
  parallax = 10,
  lift = 44,
}: {
  children: ReactNode;
  className?: string;
  bg?: ReactNode;
  parallax?: number;
  lift?: number;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      if (bgRef.current && parallax) {
        gsap.fromTo(
          bgRef.current,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      if (contentRef.current && lift) {
        gsap.fromTo(
          contentRef.current,
          { y: lift, opacity: 0.3 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 88%",
              end: "top 48%",
              scrub: 0.8,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      {bg && (
        // Extra vertical bleed so the parallax drift never exposes an edge.
        <div
          ref={bgRef}
          className="pointer-events-none absolute inset-x-0 -inset-y-[14%]"
          aria-hidden="true"
        >
          {bg}
        </div>
      )}
      <div ref={contentRef} className="relative">
        {children}
      </div>
    </section>
  );
}
