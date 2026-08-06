"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Drives the whole document's scroll through Lenis for momentum/inertia,
 * synced to GSAP's ticker so ScrollTrigger stays in lockstep with it.
 * Skipped entirely under prefers-reduced-motion — native scroll is fine.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Pinned sections insert spacers that change the document's real
    // height *after* Lenis has already measured it — without telling
    // Lenis to re-measure on every ScrollTrigger refresh, its virtual
    // scroll bounds go stale and sections appear to skip or replay.
    function onRefresh() {
      lenis.resize();
    }
    ScrollTrigger.addEventListener("refresh", onRefresh);

    function update(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refresh).catch(() => {});
    window.addEventListener("load", refresh);
    const settleTimer = window.setTimeout(refresh, 300);

    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("load", refresh);
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
