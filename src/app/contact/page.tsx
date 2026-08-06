import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import IsoMotif from "@/components/iso/iso-motif";
import MorphField from "@/components/motion/morph-field";
import ScrollScene from "@/components/motion/scroll-scene";
import PopCard from "@/components/motion/pop-card";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hango — digital marketing and software development in Coimbatore, Tamil Nadu.",
};

const details = [
  { term: "Address", value: siteConfig.address },
  { term: "Email", value: siteConfig.email },
  { term: "Phone", value: siteConfig.phones.join(" · ") },
] as const;

export default function ContactPage() {
  return (
    // This section opens above the fold, so it keeps the background drift
    // but skips the scroll-in entrance that would leave it dimmed on load.
    <ScrollScene
      className="bg-[var(--color-surface-0)]"
      lift={0}
      parallax={8}
      bg={
        <>
          <div className="circuit-floor absolute inset-0" />
          <div className="edge-light absolute inset-0" />
        </>
      }
    >
      <div className="relative z-[2] mx-auto grid max-w-5xl gap-12 px-6 pb-20 pt-32 md:grid-cols-2 md:pb-28 md:pt-36">
        <div>
          <h1 className="text-4xl font-bold text-ink md:text-5xl">
            Let&apos;s talk about your project
          </h1>
          <div className="mt-8 h-px w-40 neon-rule" aria-hidden="true" />
          <p className="mt-6 text-lg text-ink/60">
            Tell us a bit about your business and what you&apos;re looking for — we&apos;ll
            get back to you with a plan.
          </p>

          <dl className="mt-10 space-y-1 text-sm">
            {details.map((detail, i) => (
              <PopCard
                key={detail.term}
                index={i}
                lift={false}
                className="-mx-3 rounded-[12px] px-3 py-2"
              >
                <dt className="font-semibold text-ink transition-colors duration-500 group-data-[pop=on]:text-brand-red">
                  {detail.term}
                </dt>
                <dd className="text-ink/55 transition-colors duration-500 group-data-[pop=on]:text-ink/85">
                  {detail.value}
                </dd>
              </PopCard>
            ))}
            <PopCard index={3} lift={false} className="-mx-3 rounded-[12px] px-3 py-2">
              <dt className="font-semibold text-ink transition-colors duration-500 group-data-[pop=on]:text-brand-red">
                Instagram
              </dt>
              <dd className="text-ink/55">
                <a href={siteConfig.instagram.url} className="transition-colors hover:text-brand-red">
                  {siteConfig.instagram.handle}
                </a>
              </dd>
            </PopCard>
          </dl>

          <IsoMotif
            kind="signal"
            className="mt-8 hidden aspect-[7/6] w-full max-w-[300px] lg:block"
          />
        </div>

        <PopCard
          index={0}
          lift={false}
          className="rounded-[18px] border border-ink/10 bg-[var(--color-surface-2)]/70 p-8 backdrop-blur-sm"
        >
          <MorphField
            className="pointer-events-none absolute -right-6 -top-6 hidden opacity-50 md:block"
            size={80}
          />
          <ContactForm />
        </PopCard>
      </div>
    </ScrollScene>
  );
}
