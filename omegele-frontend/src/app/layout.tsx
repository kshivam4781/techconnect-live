import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { UserMenu } from "@/components/UserMenu";
import { LoginButton } from "@/components/LoginButton";
import { Logo } from "@/components/Logo";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechConnect Live",
  description:
    "A professional Omegle-style platform for tech folks, powered by LinkedIn and GitHub authentication.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <GoogleAnalytics />
        <Providers>
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-gray-200 via-gray-400 via-gray-600 via-gray-800 to-[#050710]">
          <header className="relative z-50 border-b border-gray-200 bg-white/98 backdrop-blur-sm shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Logo />
                <div className="flex flex-col leading-tight">
                  <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.16em] text-gray-900">
                    Vinamah
                  </span>
                  <span className="text-sm text-gray-600">
                    Drop‑in conversations for people who build and hire
                  </span>
                </div>
              </div>
              <nav className="flex items-center gap-4 text-sm sm:text-base text-gray-700">
                <div className="hidden items-center gap-6 sm:flex">
                  <a href="/" className="hover:text-[#ffd447] transition-colors">
                    Home
                  </a>
                  <a href="/about" className="hover:text-[#ffd447] transition-colors">
                    About
                  </a>
                  <a href="/events" className="hover:text-[#ffd447] transition-colors">
                    Events
                  </a>
                  <a href="/use-case" className="hover:text-[#ffd447] transition-colors">
                    Use Case
                  </a>
                  <a href="/guidelines" className="hover:text-[#ffd447] transition-colors">
                    Guidelines
                  </a>
                  <a href="/feedback" className="hover:text-[#ffd447] transition-colors">
                    Support
                  </a>
                </div>
                <LoginButton />
                <UserMenu />
              </nav>
            </div>
          </header>
          <main className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050710] pointer-events-none" />
            <div className="relative z-10">{children}</div>
          </main>
          <footer className="border-t border-gray-300 bg-gradient-to-b from-white via-gray-100 to-gray-200 pt-10 pb-4 text-base text-gray-700">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Logo className="h-10 w-10" />
                    <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-700">
                      Vinamah
                    </p>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Drop‑in 1:1 conversations for people who write code, manage
                    teams, hire talent, or are just getting started.
                  </p>
                  <p className="text-sm text-gray-500">
                    Built for engineers, founders, students, HR, and leadership
                    who want signal over noise.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-800">
                    Product
                  </p>
                  <ul className="space-y-1 text-base">
                    <li>
                      <a href="/" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Overview
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="/use-case" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Use Cases
                      </a>
                    </li>
                    <li>
                      <a href="/early-access" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Early access
                      </a>
                    </li>
                    <li>
                      <a href="/guidelines" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Safety & guidelines
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-800">
                    For teams
                  </p>
                  <ul className="space-y-1 text-base">
                    <li>
                      <span className="cursor-default text-gray-500">
                        Hiring & talent partners
                      </span>
                    </li>
                    <li>
                      <span className="cursor-default text-gray-500">
                        Founder & leadership sessions
                      </span>
                    </li>
                    <li>
                      <span className="cursor-default text-gray-500">
                        University & community pilots
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium uppercase tracking-[0.16em] text-gray-800">
                    Legal & docs
                  </p>
                  <ul className="space-y-1 text-base">
                    <li>
                      <a href="/guidelines" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Community guidelines
                      </a>
                    </li>
                    <li>
                      <a href="/acceptable-use" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Acceptable Use Policy
                      </a>
                    </li>
                    <li>
                      <a href="/terms" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a href="/privacy" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Privacy Policy
                      </a>
                    </li>
                    <li>
                      <a href="/cookies" className="text-gray-600 hover:text-[#ffd447] transition-colors">
                        Cookie Policy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-300 pt-6">
                <div className="flex items-center gap-4">
                  <a
                    href="https://www.linkedin.com/company/vinamah/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-[#ffd447] hover:text-[#ffd447] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.youtube.com/@vinamah"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:border-[#ffd447] hover:text-[#ffd447] transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                </div>
                <div className="flex flex-col items-center justify-between gap-2 text-sm sm:flex-row w-full">
                  <p className="text-gray-600">© {new Date().getFullYear()} Vinamah. All rights reserved.</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm text-gray-500">
                      Built for night owls, calendar warriors, and first‑timers.
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <a 
                      href="mailto:noreply@mail.vinamah.com" 
                      className="text-sm text-gray-600 hover:text-[#ffd447] transition-colors"
                    >
                      noreply@mail.vinamah.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        </Providers>
      </body>
    </html>
  );
}
