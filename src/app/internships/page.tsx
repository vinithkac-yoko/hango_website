import type { Metadata } from "next";
import Link from "next/link";
import { internshipPrograms, collegeTieUp } from "@/data/internships";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Hango's internship certificate program for 2nd year and final year college students — real client projects, certification, and college MOU partnerships.",
};

export default function InternshipsPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:pb-28 md:pt-36">
          <h1 className="max-w-2xl text-4xl font-bold text-black md:text-6xl">
            Real client work. A real certificate.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-black/70">
            For 2nd year and final year college students — work on an actual client project
            and receive a certificate for it.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-2">
          {internshipPrograms.map((program) => (
            <div key={program.slug} className="rounded-[18px] border border-black/15 p-8">
              <p className="text-sm font-semibold text-brand-red">{program.duration}</p>
              <h2 className="mt-2 text-xl font-semibold text-black">{program.title}</h2>
              <p className="mt-1 text-sm text-black/50">{program.audience}</p>
              <p className="mt-4 text-black/70">{program.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[18px] bg-brand-black p-8 text-white">
          <h2 className="text-xl font-semibold">{collegeTieUp.title}</h2>
          <p className="mt-3 max-w-2xl text-white/70">{collegeTieUp.description}</p>
          <Link href="/contact" className="btn-primary mt-6">
            Discuss a partnership
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <h2 className="text-3xl font-bold text-black md:text-5xl">Ready to apply?</h2>
        <p className="mt-4 max-w-xl text-black/60">
          Reach out with your college, department of interest, and preferred duration.
        </p>
        <Link href="/contact" className="btn-primary mt-8">
          Apply now
        </Link>
      </section>
    </>
  );
}
