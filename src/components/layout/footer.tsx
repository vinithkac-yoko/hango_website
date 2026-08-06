"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Logo from "@/components/ui/logo";
import { siteConfig } from "@/lib/site-config";

const EASE = [0.16, 1, 0.3, 1] as const;

const riseChild = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

const linkClass =
  "relative inline-block text-sm text-brand-cream/70 transition-colors duration-300 hover:text-brand-red after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-brand-red after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:origin-left hover:after:scale-x-100";

export default function Footer() {
  const year = new Date().getFullYear();
  const reduce = useReducedMotion();
  const [konami, setKonami] = useState(0);

  useEffect(() => {
    const bump = () => setKonami((k) => k + 1);
    window.addEventListener("hango:konami", bump);
    return () => window.removeEventListener("hango:konami", bump);
  }, []);

  return (
    <footer className="bg-[var(--color-surface-dark)] text-brand-cream">
      {/* Thin divider that draws itself into view */}
      <motion.div
        className="h-px w-full origin-left bg-gradient-to-r from-brand-red/70 via-white/15 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE }}
      />

      <div className="mx-auto max-w-6xl px-6 py-14">
        <motion.div
          className="grid gap-10 md:grid-cols-3"
          initial={"hidden"}
          whileInView={"show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.div variants={riseChild}>
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <motion.span
                className="relative inline-block"
                whileHover={{ scale: 1.06 }}
                animate={
                  konami > 0 && !reduce
                    ? { rotate: [0, -12, 12, 0], scale: [1, 1.25, 1.25, 1] }
                    : undefined
                }
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: "rgba(251,54,64,0.55)" }}
                />
                <Logo variant="white" as="mark" className="h-8 w-auto" />
              </motion.span>
              <span className="font-display text-xl font-bold text-white">Hango</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-brand-cream/70">
              {siteConfig.tagline}. Based in {siteConfig.location}.
            </p>
          </motion.div>

          <motion.div variants={riseChild}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={riseChild}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Get in touch
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-cream/70">
              <li>{siteConfig.address}</li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className={linkClass}>
                    {phone}
                  </a>
                </li>
              ))}
              <li>
                <motion.a
                  href={siteConfig.instagram.url}
                  className="inline-flex items-center gap-2 text-sm text-brand-cream/70 transition-colors duration-300 hover:text-brand-red"
                  whileHover={{ y: -2, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 340, damping: 18 }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M12 2c2.7 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.46.65.26 1.2.6 1.76 1.15.55.55.89 1.11 1.15 1.76.24.64.4 1.37.45 2.43C21.99 8.94 22 9.3 22 12s-.01 3.06-.06 4.12c-.05 1.06-.21 1.79-.45 2.43a4.9 4.9 0 0 1-1.15 1.76c-.56.55-1.11.89-1.76 1.15-.64.24-1.37.4-2.43.45-1.06.05-1.42.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.21-2.43-.45a4.9 4.9 0 0 1-1.76-1.15 4.9 4.9 0 0 1-1.15-1.76c-.24-.64-.4-1.37-.46-2.43C2.01 15.06 2 14.7 2 12s.01-3.06.06-4.12c.06-1.06.22-1.79.46-2.43.26-.65.6-1.21 1.15-1.76A4.9 4.9 0 0 1 5.43 2.52c.64-.24 1.37-.41 2.43-.46C8.94 2.01 9.3 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm6.5-.75a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0ZM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
                    />
                  </svg>
                  {siteConfig.instagram.handle}
                </motion.a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
          className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-brand-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Hango. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
}
