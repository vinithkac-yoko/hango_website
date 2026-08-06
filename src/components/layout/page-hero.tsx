import type { ReactNode } from "react";
import IsoMotif, { type MotifKind } from "@/components/iso/iso-motif";

/**
 * Page header matching the homepage hero's lighting so inner pages read as
 * the same world: circuit floor, red bloom and an isometric motif. Adapts
 * to the active theme via the surface/ink tokens in globals.css.
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
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-0)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="circuit-floor absolute inset-0" />
        <div className="edge-light absolute inset-0" />
      </div>

      <div
        className={`relative z-[2] mx-auto max-w-6xl px-6 pb-20 pt-32 md:pb-24 md:pt-36 ${
          motif ? "grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]" : ""
        }`}
      >
        <div>
          <h1 className="max-w-3xl text-4xl font-bold text-ink md:text-6xl">{title}</h1>
          <div className="mt-8 h-px w-40 neon-rule" aria-hidden="true" />
          {lead && <p className="mt-6 max-w-xl text-lg text-ink/55">{lead}</p>}
          {children}
        </div>

        {motif && (
          <IsoMotif kind={motif} className="hidden aspect-[7/6] w-full max-w-[440px] lg:block" />
        )}
      </div>
    </section>
  );
}
