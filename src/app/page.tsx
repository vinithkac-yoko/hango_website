import Link from "next/link";
import { elevatorPitch, coreValues, growthStack } from "@/data/company";

export default function Home() {
  return (
    <>
      <section className="border-b border-black/10 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
          <h1
            className="motion-rise max-w-4xl text-5xl font-bold text-black md:text-[5.5rem] md:leading-[0.95]"
            style={{ animationDelay: "0ms" }}
          >
            We are Hango.
            <br />
            <span className="text-brand-red">Engineering Digital Growth.</span>
          </h1>

          <p
            className="motion-rise mt-8 max-w-2xl text-xl font-medium text-black md:text-2xl"
            style={{ animationDelay: "120ms" }}
          >
            {elevatorPitch.hook}
          </p>

          <p
            className="motion-rise mt-4 max-w-xl text-black/60"
            style={{ animationDelay: "200ms" }}
          >
            {elevatorPitch.body}
          </p>

          <div
            className="motion-rise mt-10 flex flex-wrap gap-4"
            style={{ animationDelay: "280ms" }}
          >
            <Link href="/contact" className="btn-primary">
              Get a Quote
            </Link>
            <Link href="/services" className="btn-secondary">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          <p className="text-2xl font-medium text-black md:text-3xl">
            &ldquo;{coreValues[0].description}&rdquo;
          </p>
          <ul className="space-y-6 border-t border-black/10 pt-6">
            {coreValues.slice(1, 4).map((value) => (
              <li key={value.title} className="border-b border-black/10 pb-6">
                <h3 className="text-lg font-semibold text-black">{value.title}</h3>
                <p className="mt-1 text-black/60">{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-black py-20 text-white md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="max-w-2xl text-3xl font-bold md:text-5xl">The Growth Stack</h2>
          <p className="mt-4 max-w-xl text-white/60">
            Every pillar supports and amplifies the others, built as one integrated system —
            not services sold in isolation.
          </p>

          <div className="mt-12 divide-y divide-white/10 border-t border-white/10">
            {growthStack.map((pillar) => (
              <div
                key={pillar.title}
                className="grid gap-3 py-8 md:grid-cols-[1fr_2fr] md:gap-12"
              >
                <h3 className="text-xl font-semibold">{pillar.title}</h3>
                <p className="max-w-2xl text-white/60">{pillar.description}</p>
              </div>
            ))}
          </div>

          <Link href="/services" className="btn-secondary-invert mt-12">
            View all services
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <h2 className="max-w-2xl text-3xl font-bold text-black md:text-5xl">
          Ready to grow with Hango?
        </h2>
        <p className="mt-4 max-w-xl text-black/60">
          Tell us about your business and we&apos;ll put together a plan.
        </p>
        <Link href="/contact" className="btn-primary mt-8">
          Get in touch
        </Link>
      </section>
    </>
  );
}
