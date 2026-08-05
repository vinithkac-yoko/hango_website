import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hango — digital marketing and software development in Coimbatore, Tamil Nadu.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-surface-0)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="circuit-floor absolute inset-0" />
        <div
          className="orb-a absolute -left-[10%] top-[-30%] h-[52vw] w-[52vw] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(251,54,64,0.18) 0%, transparent 64%)" }}
        />
        <div
          className="orb-b absolute -right-[14%] bottom-[-25%] h-[46vw] w-[46vw] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(255,242,209,0.06) 0%, transparent 66%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 70% at 45% 45%, transparent 25%, rgba(0,0,0,0.7) 100%)",
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto grid max-w-5xl gap-12 px-6 pb-20 pt-32 md:grid-cols-2 md:pb-28 md:pt-36">
        <div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Let&apos;s talk about your project
          </h1>
          <div className="mt-8 h-px w-40 neon-rule" aria-hidden="true" />
          <p className="mt-6 text-lg text-white/60">
            Tell us a bit about your business and what you&apos;re looking for — we&apos;ll
            get back to you with a plan.
          </p>

          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-white">Address</dt>
              <dd className="text-white/55">{siteConfig.address}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Email</dt>
              <dd className="text-white/55">{siteConfig.email}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Phone</dt>
              <dd className="text-white/55">{siteConfig.phones.join(" · ")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Instagram</dt>
              <dd className="text-white/55">
                <a href={siteConfig.instagram.url} className="transition-colors hover:text-brand-red">
                  {siteConfig.instagram.handle}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[18px] border border-white/10 bg-[var(--color-surface-2)]/70 p-8 backdrop-blur-sm">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
