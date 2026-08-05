import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import MorphField from "@/components/motion/morph-field";
import { internshipPrograms, collegeTieUp } from "@/data/internships";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Hango's internship certificate program for 2nd year and final year college students — real client projects, certification, and college MOU partnerships.",
};

export default function InternshipsPage() {
  return (
    <>
      <PageHero
        title="Real client work. A real certificate."
        lead="For 2nd year and final year college students — work on an actual client project and receive a certificate for it."
        motif="certificate"
      />

      <section className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 md:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {internshipPrograms.map((program) => (
              <div
                key={program.slug}
                data-cursor="card"
                className="group rounded-[18px] border border-white/10 bg-[var(--color-surface-2)]/70 p-8 backdrop-blur-sm transition-colors duration-500 hover:border-brand-red/50"
              >
                <p
                  className="text-sm font-semibold text-brand-red"
                  style={{ textShadow: "0 0 12px rgba(251,54,64,0.45)" }}
                >
                  {program.duration}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">{program.title}</h2>
                <p className="mt-1 text-sm text-white/45">{program.audience}</p>
                <p className="mt-4 text-white/65">{program.description}</p>
              </div>
            ))}
          </div>

          <div
            className="neon-edge mt-6 rounded-[18px] bg-[var(--color-surface-0)] p-8 text-white"
            data-cursor="card"
          >
            <h2 className="text-xl font-semibold">{collegeTieUp.title}</h2>
            <p className="mt-3 max-w-2xl text-white/65">{collegeTieUp.description}</p>
            <Link href="/contact" className="btn-primary mt-6">
              Discuss a partnership
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-0)] py-24 md:py-32">
        <MorphField className="pointer-events-none absolute right-10 top-16 hidden opacity-60 lg:block" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Ready to apply?</h2>
          <p className="mt-4 max-w-xl text-white/55">
            Reach out with your college, department of interest, and preferred duration.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Apply now
          </Link>
        </div>
      </section>
    </>
  );
}
