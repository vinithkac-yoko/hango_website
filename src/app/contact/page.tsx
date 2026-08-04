import type { Metadata } from "next";
import ContactForm from "@/components/contact-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Hango — digital marketing and software development in Coimbatore, Tamil Nadu.",
};

export default function ContactPage() {
  return (
    <section className="bg-brand-cream">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <h1 className="text-4xl font-bold text-black md:text-5xl">
            Let&apos;s talk about your project
          </h1>
          <p className="mt-4 text-lg text-black/70">
            Tell us a bit about your business and what you&apos;re looking for — we&apos;ll
            get back to you with a plan.
          </p>

          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-black">Location</dt>
              <dd className="text-black/60">{siteConfig.location}</dd>
            </div>
            <div>
              <dt className="font-semibold text-black">Email</dt>
              <dd className="text-black/60">{siteConfig.email}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded border border-black/15 bg-white p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
