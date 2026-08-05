import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/page-hero";
import { retainerService, projectServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing retainers and one-time project services from Hango — SEO, ads, content, brand design, and web development.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Marketing retainers and one-time projects, priced to fit." />

      <section className="relative overflow-hidden bg-[var(--color-surface-1)] py-20 md:py-28">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{retainerService.title}</h2>
          <p className="mt-2 max-w-2xl text-white/55">{retainerService.description}</p>
          <p className="mt-3 max-w-2xl text-sm text-white/35">
            {retainerService.includes.join(" · ")}
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {retainerService.tiers.map((tier, i) => (
              <div
                key={tier.name}
                data-cursor="card"
                className={`flex flex-col rounded-[18px] bg-[var(--color-surface-2)]/70 p-8 backdrop-blur-sm transition-colors duration-500 ${
                  i === 1
                    ? "border border-brand-red/70 shadow-[0_0_28px_rgba(251,54,64,0.18)]"
                    : "border border-white/10 hover:border-white/25"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
                <p className="mt-1 text-sm text-white/45">Contact us for pricing</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-white/70">
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
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-0)] py-20 text-white md:py-28">
        <div
          className="orb-c pointer-events-none absolute -right-1/4 top-1/3 h-[42vw] w-[42vw] rounded-full blur-3xl"
          aria-hidden="true"
          style={{ background: "radial-gradient(circle, rgba(251,54,64,0.14) 0%, transparent 65%)" }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold md:text-3xl">One-Time Services</h2>
          <p className="mt-2 max-w-2xl text-white/55">
            Fixed packages for standard jobs, custom quotes for larger projects.
          </p>

          <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {projectServices.map((service) => (
              <div
                key={service.slug}
                data-cursor="card"
                className="group relative grid gap-2 py-7 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-8"
              >
                <span className="pointer-events-none absolute inset-0 -mx-5 rounded-[14px] bg-brand-red/0 transition-colors duration-500 group-hover:bg-brand-red/[0.07]" />
                <h3 className="relative font-semibold transition-colors duration-500 group-hover:text-brand-red">
                  {service.title}
                </h3>
                <div className="relative">
                  <p className="text-white/60">{service.description}</p>
                  <p className="mt-1.5 text-sm text-white/30">{service.includes.join(" · ")}</p>
                </div>
                <p className="relative whitespace-nowrap text-sm text-brand-red md:text-right">
                  {service.pricingNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-1)] py-24 md:py-32">
        <div className="circuit-floor pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-6">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Not sure what you need?</h2>
          <p className="mt-4 max-w-xl text-white/55">
            Book a consultation and we&apos;ll recommend the right package for your business.
          </p>
          <Link href="/contact" className="btn-primary mt-8">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
}
