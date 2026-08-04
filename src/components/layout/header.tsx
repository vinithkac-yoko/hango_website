"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Logo from "@/components/ui/logo";
import { MagneticLink } from "@/components/motion/magnetic";
import { siteConfig } from "@/lib/site-config";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      className="sticky top-0 z-50"
      animate={{
        backgroundColor: scrolled ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0)",
        borderBottomColor: scrolled ? "rgba(0,15,8,0.08)" : "rgba(0,15,8,0)",
        backdropFilter: scrolled ? "blur(14px) saturate(180%)" : "blur(0px)",
        boxShadow: scrolled ? "0 1px 2px rgba(0,15,8,0.04), 0 8px 24px rgba(0,15,8,0.05)" : "none",
      }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <motion.span
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 340, damping: 16 }}
            className="inline-block"
          >
            <Logo as="mark" className="h-8 w-auto" />
          </motion.span>
          <span className="font-display text-xl font-bold text-brand-black">Hango</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href}
              className="nav-link text-brand-black/70 hover:text-brand-red data-[active=true]:text-brand-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <MagneticLink href="/contact" className="btn-primary" arrow>
            Get a Quote
          </MagneticLink>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-brand-black md:hidden"
        >
          <span className="sr-only">Toggle menu</span>
          <div className="flex flex-col gap-1.5">
            <motion.span
              className="block h-0.5 w-6 bg-current"
              animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-current"
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block h-0.5 w-6 bg-current"
              animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="overflow-hidden border-t border-black/5 bg-white/95 backdrop-blur md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-[12px] px-3 py-2.5 text-sm font-medium text-brand-black/80 transition-colors hover:bg-brand-cream"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 justify-center"
              >
                Get a Quote
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
