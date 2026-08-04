import type { Metadata } from "next";
import Link from "next/link";
import { retainerService, projectServices } from "@/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Digital marketing retainers and one-time project services from Hango — SEO, ads, content, brand design, and web development.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-black/10 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <h1 className="max-w-2xl text-4xl font-bold text-black md:text-6xl">
            Marketing retainers and one-time projects, priced to fit.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <h2 className="text-2xl font-bold text-black md:text-3xl">{retainerService.title}</h2>
        <p className="mt-2 max-w-2xl text-black/60">{retainerService.description}</p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {retainerService.tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded p-8 ${
                i === 1 ? "border-2 border-brand-red" : "border border-black/15"
              }`}
            >
              <h3 className="text-lg font-semibold text-black">{tier.name}</h3>
              <p className="mt-1 text-sm text-black/50">Contact us for pricing</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-black/70">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={i === 1 ? "btn-primary mt-8 justify-center" : "btn-secondary mt-8 justify-center"}
              >
                Get a Quote
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold md:text-3xl">One-Time Services</h2>
          <p className="mt-2 max-w-2xl text-white/60">
            Fixed packages for standard jobs, custom quotes for larger projects.
          </p>

          <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {projectServices.map((service) => (
              <div
                key={service.slug}
                className="grid gap-2 py-7 md:grid-cols-[1fr_2fr_auto] md:items-baseline md:gap-8"
              >
                <h3 className="font-semibold">{service.title}</h3>
                <p className="text-white/60">{service.description}</p>
                <p className="text-sm whitespace-nowrap text-brand-red md:text-right">
                  {service.pricingNote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <h2 className="text-3xl font-bold text-black md:text-5xl">Not sure what you need?</h2>
        <p className="mt-4 max-w-xl text-black/60">
          Book a consultation and we&apos;ll recommend the right package for your business.
        </p>
        <Link href="/contact" className="btn-primary mt-8">
          Get in touch
        </Link>
      </section>
    </>
  );
}
