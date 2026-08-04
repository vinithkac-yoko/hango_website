import Link from "next/link";
import Logo from "@/components/ui/logo";
import { siteConfig } from "@/lib/site-config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-brand-cream">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo variant="white" as="mark" className="h-8 w-auto" />
              <span className="font-display text-xl font-bold text-white">Hango</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-brand-cream/70">
              {siteConfig.tagline}. Based in {siteConfig.location}.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-cream/70 transition-colors hover:text-brand-red"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-cream/70">
              <li>{siteConfig.address}</li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="transition-colors hover:text-brand-red"
                >
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="transition-colors hover:text-brand-red"
                  >
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.instagram.url}
                  className="transition-colors hover:text-brand-red"
                >
                  {siteConfig.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-brand-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Hango. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
