import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ScrollSpyNav } from "@/components/ui/ScrollSpyNav";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { PixelTransition } from "@/components/ui/PixelTransition";
import { PixelTransitionProvider } from "@/components/theme/PixelTransitionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nihadh.dev"), // TODO: replace with real deployed domain
  title: "Nihadh — Software Engineer",
  description:
    "Nihad Nilabdeen — Software Engineering Undergraduate at the University of Kelaniya, building scalable software systems, intelligent data-driven applications, and modern user-focused interfaces.",
  keywords: [
    "Nihadh",
    "Nihad Nilabdeen",
    "University of Kelaniya",
    "Software Engineer",
    "Net-Centric Applications",
    "Data Science",
  ],
  authors: [{ name: "Nihad Nilabdeen" }],
  openGraph: {
    title: "Nihadh — Software Engineer",
    description:
      "Portfolio of Nihad Nilabdeen, 3rd-year Software Engineering Undergraduate at UoK, Sri Lanka.",
    type: "website",
    images: [{ url: "/images/zamzam-poster.png" }],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: next-themes sets the dark/light class on the
    // client before paint, which will legitimately differ from the server's
    // markup for a single attribute — this is the documented, expected fix.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent-primary)]/30 overflow-x-hidden">
        <PixelTransitionProvider>
          <SmoothScrollProvider>
            {/* Pixel-grid unmask reveal, wraps the whole app shell */}
            <PixelTransition>
              <ScrollSpyNav />
              <main className="relative min-h-screen">
                {children}
              </main>
            </PixelTransition>
          </SmoothScrollProvider>
        </PixelTransitionProvider>
      </body>
    </html>
  );
}
