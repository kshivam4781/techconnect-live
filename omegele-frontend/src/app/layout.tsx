import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
        <div className="flex min-h-screen flex-col bg-[#050710]">
          <header className="border-b border-[#262a3d] bg-[#050813]/90 backdrop-blur">
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
              <nav className="hidden items-center gap-6 text-[12px] text-[#c5cbe6] sm:flex">
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
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-[#262a3d] bg-[#050813] py-4 text-xs text-[#8b92b0]">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
              <p>© {new Date().getFullYear()} TechConnect Live. All rights reserved.</p>
              <div className="flex gap-4">
                <a href="/guidelines" className="hover:text-[#ffd447]">
                  Community guidelines
                </a>
                <span className="hidden sm:inline">·</span>
                <a href="/about" className="hover:text-[#ffd447]">
                  Privacy & terms
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
