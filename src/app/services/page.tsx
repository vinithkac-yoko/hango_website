import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import MorphField from "@/components/motion/morph-field";
import ScrollScene from "@/components/motion/scroll-scene";
import PopRows from "@/components/motion/pop-rows";
import PopCard from "@/components/motion/pop-card";
import { retainerService, projectServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing retainers and one-time project services from Hango — SEO, ads, content, brand design, and web development.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Marketing retainers and one-time projects, priced to fit."
        motif="layers"
      />

      <ScrollScene
        className="veil-1 py-20 md:py-28"
        bg={<div className="bg-grid absolute inset-0 opacity-60" />}
      >
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-ink md:text-3xl">{retainerService.title}</h2>
          <p className="mt-2 max-w-2xl text-ink/55">{retainerService.description}</p>
          <p className="mt-3 max-w-2xl text-sm text-ink/35">
            {retainerService.includes.join(" · ")}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {retainerService.tiers.map((tier, i) => (
              <PopCard
                key={tier.name}
                index={i}
                featured={i === 1}
                className="flex flex-col rounded-[18px] border border-ink/10 bg-[var(--color-surface-2)]/70 p-8 backdrop-blur-sm"
              >
                <h3 className="text-lg font-semibold text-ink transition-colors duration-500 group-data-[pop=on]:text-brand-red">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-ink/45">Contact us for pricing</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-ink/70">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span
                        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red"
                        style={{ boxShadow: "0 0 8px rgba(251,54,64,0.9)" }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={
                    i === 1
                      ? "btn-primary mt-8 justify-center"
                      : "btn-secondary-invert mt-8 justify-center"
                  }
                >
                  Get a Quote
                </Link>
              </PopCard>
            ))}
          </div>
        </div>
      </ScrollScene>

      <ScrollScene className="veil-0 py-20 text-ink md:py-28">
        <MorphField className="pointer-events-none absolute right-10 top-16 hidden opacity-60 lg:block" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold md:text-3xl">One-Time Services</h2>
          <p className="mt-2 max-w-2xl text-ink/55">
            Fixed packages for standard jobs, custom quotes for larger projects.
          </p>

          <div className="mt-12">
            <PopRows
              items={projectServices.map((service) => ({
                key: service.slug,
                title: service.title,
                description: service.description,
                sub: service.includes.join(" · "),
                meta: service.pricingNote,
              }))}
            />
          </div>
        </div>
      </ScrollScene>

      <ScrollScene
        className="veil-1 py-24 md:py-32"
        bg={<div className="circuit-floor absolute inset-0" />}
      >
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-ink md:text-5xl">Not sure what you need?</h2>
          <p className="mt-4 max-w-xl text-ink/55">
            Book a consultation and we&apos;ll recommend the right package for your business.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Get in touch
          </Link>
        </div>
      </ScrollScene>
    </>
  );
}
