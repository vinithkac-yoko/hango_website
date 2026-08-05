import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import MorphField from "@/components/motion/morph-field";
import {
  about,
  mission,
  vision,
  coreValues,
  targetAudience,
  elevatorPitch,
  whyHango,
} from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Hango — a full-stack digital growth partner in Coimbatore, Tamil Nadu, uniting marketing, technology, and branding.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero title="To hang high is the point." motif="ascend">
        <div className="mt-8 max-w-2xl space-y-5 text-lg text-white/60">
          {about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </PageHero>

      <section className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 md:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-brand-red">Mission</h2>
            <p className="mt-3 text-2xl font-medium text-white">{mission}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-brand-red">Vision</h2>
            <p className="mt-3 text-2xl font-medium text-white">{vision}</p>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-0)] py-20 text-white md:py-28">
        <MorphField className="pointer-events-none absolute right-10 top-16 hidden opacity-60 lg:block" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">What we hold to</h2>

          <div className="mt-12 grid gap-x-12 gap-y-10 border-t border-white/10 pt-10 md:grid-cols-2">
            {coreValues.map((value) => (
              <div key={value.title} data-cursor="card" className="group">
                <h3 className="text-xl font-semibold transition-colors duration-500 group-hover:text-brand-red">
                  {value.title}
                </h3>
                <p className="mt-2 text-white/55 transition-colors duration-500 group-hover:text-white/80">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 text-center md:py-28">
        <div className="circuit-floor pointer-events-none absolute inset-0" aria-hidden="true" />
        <p className="relative mx-auto max-w-4xl px-6 text-2xl font-medium text-white md:text-4xl">
          &ldquo;{elevatorPitch.hook}&rdquo;
        </p>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-0)] py-20 md:py-28">
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Why Hango</h2>
          <ul className="mt-10 grid gap-x-12 gap-y-4 sm:grid-cols-2">
            {whyHango.map((point) => (
              <li key={point} className="flex items-center gap-3 text-lg text-white/85">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className="h-5 w-5 shrink-0 text-brand-red"
                  style={{ filter: "drop-shadow(0 0 6px rgba(251,54,64,0.7))" }}
                >
                  <path
                    fill="currentColor"
                    d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z"
                  />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 md:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold text-white md:text-5xl">Who we work with</h2>

          <div className="mt-12 border-t border-white/10">
            {targetAudience.map((segment) => (
              <div
                key={segment.title}
                data-cursor="card"
                className="group relative grid gap-2 border-b border-white/10 py-7 md:grid-cols-[1fr_2fr] md:gap-12"
              >
                <span className="pointer-events-none absolute inset-0 -mx-5 rounded-[14px] bg-brand-red/0 transition-colors duration-500 group-hover:bg-brand-red/[0.07]" />
                <h3 className="relative font-semibold text-white transition-colors duration-500 group-hover:text-brand-red">
                  {segment.title}
                </h3>
                <p className="relative text-white/55 transition-colors duration-500 group-hover:text-white/80">
                  {segment.description}
                </p>
              </div>
            ))}
          </div>

          <Link href="/contact" className="btn-primary mt-12">
            Start a conversation
          </Link>
        </div>
      </section>
    </>
  );
}
