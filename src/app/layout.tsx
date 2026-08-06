import type { Metadata } from "next";
import { Arimo, Space_Grotesk } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Cursor from "@/components/motion/cursor";
import PageLoader from "@/components/motion/page-loader";
import { Spotlight, Grain, ScrollProgress, EasterEggs } from "@/components/motion/ambient";
import MotionProvider from "@/components/motion/motion-provider";
import LenisProvider from "@/components/motion/lenis-provider";
import ThemeProvider from "@/components/motion/theme-provider";
import NeonNerves from "@/components/motion/neon-nerves";
import "./globals.css";

const arimo = Arimo({
  variable: "--font-arimo",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Hango — Engineering Digital Growth",
    template: "%s | Hango",
  },
  description:
    "Hango is a full-stack digital growth partner in Coimbatore, Tamil Nadu — marketing, advertising, technology, and branding, engineered for qualified leads and revenue.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${arimo.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <MotionProvider>
            <LenisProvider>
              <NeonNerves />
              <PageLoader />
              <ScrollProgress />
              <Spotlight />
              <Grain />
              <EasterEggs />
              <Cursor />
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10001] focus:rounded-[12px] focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
              >
                Skip to content
              </a>
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </LenisProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
