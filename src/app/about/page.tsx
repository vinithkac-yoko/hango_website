import type { Metadata } from "next";
import Link from "next/link";
import { about, mission, vision, coreValues, targetAudience, elevatorPitch } from "@/data/company";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Hango — a full-stack digital growth partner in Coimbatore, Tamil Nadu, uniting marketing, technology, and branding.",
};

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-brand-cream">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <h1 className="text-4xl font-bold text-black md:text-6xl">
            To hang high is the point.
          </h1>
          <div className="mt-8 space-y-5 text-lg text-black/70">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-black/40">Mission</h2>
            <p className="mt-3 text-2xl font-medium text-black">{mission}</p>
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-black/40">Vision</h2>
            <p className="mt-3 text-2xl font-medium text-black">{vision}</p>
          </div>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">What we hold to</h2>

          <div className="mt-12 grid gap-x-12 gap-y-10 border-t border-white/10 pt-10 md:grid-cols-2">
            {coreValues.map((value) => (
              <div key={value.title}>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="mt-2 text-white/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <p className="text-2xl font-medium text-black md:text-4xl">
          &ldquo;{elevatorPitch.hook}&rdquo;
        </p>
      </section>

      <section className="border-t border-black/10 bg-brand-cream py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold text-black md:text-5xl">Who we work with</h2>

          <div className="mt-12 divide-y divide-black/10 border-t border-black/10">
            {targetAudience.map((segment) => (
              <div
                key={segment.title}
                className="grid gap-2 py-7 md:grid-cols-[1fr_2fr] md:gap-12"
              >
                <h3 className="font-semibold text-black">{segment.title}</h3>
                <p className="text-black/60">{segment.description}</p>
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
