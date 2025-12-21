import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { UserMenu } from "@/components/UserMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechConnect Live",
  description:
    "A professional Omegle-style platform for tech folks, powered by LinkedIn and GitHub authentication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050710] text-[#f8f3e8]`}
      >
        <Providers>
        <div className="flex min-h-screen flex-col bg-[#050710]">
          <header className="relative z-50 border-b border-[#262a3d] bg-[#050813]/90 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#ffd44766] bg-[#0b1018] text-xs font-bold tracking-[0.16em] text-[#ffd447] shadow-[0_0_24px_rgba(250,204,21,0.35)]">
                  TCL
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#f8f3e8]">
                    TechConnect Live
                  </span>
                  <span className="text-[11px] text-[#9aa2c2]">
                    Drop‑in conversations for people who build and hire
                  </span>
                </div>
              </div>
              <nav className="flex items-center gap-4 text-[12px] text-[#c5cbe6]">
                <div className="hidden items-center gap-6 sm:flex">
                  <a href="/" className="hover:text-[#ffd447]">
                    Home
                  </a>
                  <a href="/about" className="hover:text-[#ffd447]">
                    About
                  </a>
                  <a href="/guidelines" className="hover:text-[#ffd447]">
                    Guidelines
                  </a>
                  <a href="/early-access" className="hover:text-[#ffd447]">
                    Early access
                  </a>
                </div>
                <UserMenu />
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#262a3d] bg-[#04050c] pt-10 pb-4 text-[13px] text-[#8b92b0]">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4">
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-3">
                  <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
                    TechConnect Live
                  </p>
                  <p className="text-[13px] text-[#d3dcec]">
                    Drop‑in 1:1 conversations for people who write code, manage
                    teams, hire talent, or are just getting started.
                  </p>
                  <p className="text-[12px] text-[#9aa2c2]">
                    Built for engineers, founders, students, HR, and leadership
                    who want signal over noise.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#d3dcec]">
                    Product
                  </p>
                  <ul className="space-y-1 text-[13px]">
                    <li>
                      <a href="/" className="hover:text-[#ffd447]">
                        Overview
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="hover:text-[#ffd447]">
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="/early-access" className="hover:text-[#ffd447]">
                        Early access
                      </a>
                    </li>
                    <li>
                      <a href="/guidelines" className="hover:text-[#ffd447]">
                        Safety & guidelines
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#d3dcec]">
                    For teams
                  </p>
                  <ul className="space-y-1 text-[13px]">
                    <li>
                      <span className="cursor-default text-[#9aa2c2]">
                        Hiring & talent partners
                      </span>
                    </li>
                    <li>
                      <span className="cursor-default text-[#9aa2c2]">
                        Founder & leadership sessions
                      </span>
                    </li>
                    <li>
                      <span className="cursor-default text-[#9aa2c2]">
                        University & community pilots
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#d3dcec]">
                    Legal & docs
                  </p>
                  <ul className="space-y-1 text-[13px]">
                    <li>
                      <a href="/guidelines" className="hover:text-[#ffd447]">
                        Community guidelines
                      </a>
                    </li>
                    <li>
                      <a href="/about" className="hover:text-[#ffd447]">
                        Privacy & terms (beta)
                      </a>
                    </li>
                    <li>
                      <span className="cursor-default text-[#9aa2c2]">
                        Cookie & data usage
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col items-center justify-between gap-2 border-t border-[#262a3d] pt-3 text-[12px] sm:flex-row">
                <p>© {new Date().getFullYear()} TechConnect Live. All rights reserved.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[#6f7695]">
                    Built for night owls, calendar warriors, and first‑timers.
                  </span>
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
