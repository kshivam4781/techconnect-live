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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-violet-500 text-xs font-bold text-white shadow-sm">
                  TC
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold tracking-tight">
                    TechConnect Live
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Random 1:1 chats for tech professionals
                  </span>
                </div>
              </div>
              <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-300 sm:flex">
                <a href="/" className="hover:text-zinc-900 dark:hover:text-white">
                  Home
                </a>
                <a
                  href="/about"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  About
                </a>
                <a
                  href="/guidelines"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Guidelines
                </a>
                <a
                  href="/early-access"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Early access
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-zinc-200 bg-white/70 py-4 text-xs text-zinc-500 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
              <p>© {new Date().getFullYear()} TechConnect Live. All rights reserved.</p>
              <div className="flex gap-4">
                <a
                  href="/guidelines"
                  className="hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Community guidelines
                </a>
                <span className="hidden sm:inline">·</span>
                <a
                  href="/about"
                  className="hover:text-zinc-700 dark:hover:text-zinc-300"
                >
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
