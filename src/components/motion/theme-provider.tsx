"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Dark is the brand-forward default; light is an opt-in the visitor picks
 * via the toggle and which persists in localStorage. Not system-driven —
 * predictable rather than surprising a returning visitor with a theme they
 * didn't choose.
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
