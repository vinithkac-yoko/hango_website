import type { ReactNode } from "react";

/**
 * Dark neon page header, matching the homepage hero's lighting so inner pages
 * read as the same world: circuit floor, red bloom and a centring vignette.
 */
export default function PageHero({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-0)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="circuit-floor absolute inset-0" />
        <div
          className="orb-a absolute -left-[12%] top-[-45%] h-[52vw] w-[52vw] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(251,54,64,0.18) 0%, transparent 64%)",
          }}
        />
        <div
          className="orb-b absolute -right-[16%] top-[-20%] h-[46vw] w-[46vw] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(255,242,209,0.06) 0%, transparent 66%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 40% 40%, transparent 25%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-6xl px-6 pb-20 pt-32 md:pb-24 md:pt-36">
        <h1 className="max-w-3xl text-4xl font-bold text-white md:text-6xl">{title}</h1>
        <div className="mt-8 h-px w-40 neon-rule" aria-hidden="true" />
        {lead && <p className="mt-6 max-w-xl text-lg text-white/55">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
