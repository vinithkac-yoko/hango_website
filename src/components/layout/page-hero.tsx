"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import IsoMotif, { type MotifKind } from "@/components/iso/iso-motif";

/**
 * Page header matching the homepage hero's lighting so inner pages read as
 * the same world: circuit floor, red bloom and an isometric motif. Adapts
 * to the active theme via the surface/ink tokens in globals.css.
 *
 * Scrolling away drifts the copy and the motif at different rates, so the
 * header recedes with depth rather than just sliding off.
 */
export default function PageHero({
  title,
  lead,
  motif,
  children,
}: {
  title: string;
  lead?: string;
  motif?: MotifKind;
  children?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const motifRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const scrollTrigger = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 0.6,
      } as const;

      gsap.to(copyRef.current, { y: -48, opacity: 0.45, ease: "none", scrollTrigger });
      if (motifRef.current) {
        gsap.to(motifRef.current, { y: -104, scale: 1.06, ease: "none", scrollTrigger });
      }
      gsap.to(bgRef.current, { yPercent: 12, ease: "none", scrollTrigger });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden veil-0"
    >
      <div ref={bgRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="circuit-floor absolute inset-0" />
        <div className="edge-light absolute inset-0" />
      </div>

      <div
        className={`relative z-[2] mx-auto max-w-6xl px-6 pb-20 pt-32 md:pb-24 md:pt-36 ${
          motif ? "grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]" : ""
        }`}
      >
        <div ref={copyRef}>
          <h1 className="max-w-3xl text-4xl font-bold text-ink md:text-6xl">{title}</h1>
          <div className="mt-8 h-px w-40 neon-rule" aria-hidden="true" />
          {lead && <p className="mt-6 max-w-xl text-lg text-ink/55">{lead}</p>}
          {children}
        </div>

        {motif && (
          <div ref={motifRef} className="hidden lg:block">
            <IsoMotif kind={motif} className="aspect-[7/6] w-full max-w-[440px]" />
          </div>
        )}
      </div>
    </section>
  );
}
