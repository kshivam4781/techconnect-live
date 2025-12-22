"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [stats, setStats] = useState<{
    totalRegisteredUsers: number;
    totalActive: number;
    totalOnline: number;
  } | null>(null);

  // Fetch user statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/activity/stats");
        const data = await res.json();
        if (data.totalRegisteredUsers !== undefined) {
          setStats({
            totalRegisteredUsers: data.totalRegisteredUsers,
            totalActive: data.totalActive || 0,
            totalOnline: data.totalOnline || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    // Update stats every 10 seconds
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  // Check if user needs onboarding
  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      setCheckingOnboarding(false);
      return;
    }

    // Check onboarded status from session first (faster)
    const sessionOnboarded = (session as any)?.onboarded;
    if (sessionOnboarded === false) {
      router.push("/onboarding");
      return;
    }

    // If not in session, fetch from API
    if (sessionOnboarded === undefined) {
      const checkOnboarding = async () => {
        try {
          const res = await fetch("/api/me");
          const data = await res.json();
          if (data.user && !data.user.onboarded) {
            router.push("/onboarding");
            return;
          }
        } catch (error) {
          console.error("Error checking onboarding:", error);
        } finally {
          setCheckingOnboarding(false);
        }
      };
      checkOnboarding();
    } else {
      setCheckingOnboarding(false);
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-[#0b1018] text-[#f8f3e8]">
      <section className="relative overflow-hidden border-b border-[#272f45]">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover"
            src="/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#d4d4d433] via-[#02061799] to-[#020617ee] backdrop-blur-sm" />
        </div>

        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center sm:flex-row sm:items-stretch sm:gap-16 sm:text-left">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#3b435a] bg-[#131827] px-3 py-1 text-[11px] font-medium text-[#d3dcec] shadow-sm backdrop-blur">
              <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
              Built for people who actually ship things
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Find the{" "}
              <span className="underline decoration-[#ffd447] decoration-[6px] underline-offset-8">
                tech conversations
              </span>{" "}
              you wish your timeline had.
            </h1>
            <p className="max-w-xl text-balance text-sm text-[#d3dcec] sm:text-base">
              TechConnect Live pairs you with engineers, founders, students, and
              builders for spontaneous 1:1 conversations. Less small talk, more
              real stories, ideas, and unfiltered advice.
            </p>

            {checkingOnboarding && session ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#343d55] bg-[#050816] px-4 py-3 text-left text-xs text-[#d3dcec]">
                  <p className="text-[11px] font-semibold text-[#bef264]">
                    Checking your profile…
                  </p>
                </div>
              </div>
            ) : session ? (
              <div className="space-y-3">
                <div className="rounded-2xl border border-[#343d55] bg-[#050816] px-4 py-3 text-left text-xs text-[#d3dcec]">
                  <p className="text-[11px] font-semibold text-[#bef264]">
                    You&apos;re all set.
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#f8f3e8]">
                    Signed in as{" "}
                    <span className="font-semibold">
                      {session.user?.name || session.user?.email}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] text-[#9aa2c2]">
                    Ready to start conversations. Click &quot;Start conversation&quot; when you&apos;re ready.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => router.push("/match")}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
                  >
                    Start conversation
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-5 text-sm font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
                  >
                    Sign out
                  </button>
                </div>
                <p className="text-xs text-[#9aa2c2]">
                  OAuth only · No anonymous accounts · You choose what you
                  share.
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={() => signIn("github")}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
                  >
                Start with GitHub
              </button>
            </div>
            <p className="text-xs text-[#9aa2c2]">
                  OAuth only · No anonymous accounts · You choose what you
                  share.
            </p>
              </>
            )}

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-4 py-3">
                <p className="text-2xl sm:text-3xl font-semibold text-[#f8f3e8]">
                  {stats ? (
                    <>
                      {stats.totalRegisteredUsers.toLocaleString()}
                      {stats.totalRegisteredUsers >= 1000 && "+"}
                    </>
                  ) : (
                    "—"
                  )}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  registered users
                </p>
              </div>
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-4 py-3">
                <p className="text-2xl sm:text-3xl font-semibold text-[#f8f3e8]">
                  {stats ? (
                    <>
                      {stats.totalActive}
                      <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-[#bef264]" />
                    </>
                  ) : (
                    "—"
                  )}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  users active now
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-1 justify-center sm:mt-0">
            <div className="relative w-full max-w-md animate-[float_10s_ease-in-out_infinite] rounded-3xl border border-[#343d55] bg-[#0e1422] p-4 shadow-xl shadow-[0_0_50px_rgba(15,23,42,0.9)]">
              <div className="pointer-events-none absolute -inset-px rounded-3xl border border-[#ffd44733] bg-[conic-gradient(from_180deg_at_50%_0%,rgba(250,204,21,0.4),transparent_35%,rgba(190,242,100,0.4),transparent_70%,rgba(250,204,21,0.4))] opacity-0 blur-xl transition-opacity duration-500 hover:opacity-100" />
              <div className="relative space-y-3 text-[11px] text-[#e4e8f7]">
                <div className="flex items-center justify-between text-[#d3dcec]">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#bef264]" />
                    Matching you with
                  </span>
                  <span className="rounded-full bg-[#151c33] px-2 py-0.5 text-[10px] text-[#d3dcec]">
                    Backend · AI/ML · Career
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2 rounded-2xl border border-[#343d55] bg-[#050816] p-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#232a3e] text-[10px] font-semibold">
                        Y
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#7d88aa]">
                          You
                        </p>
                        <p className="text-xs font-semibold text-[#f8f3e8]">
                          Senior Backend Eng
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#c7d0f0]">
                      “Let&apos;s talk architecture, scaling, and career jumps.”
                    </p>
                    <p className="text-[10px] text-[#9aa2c2]">
                      LinkedIn · GitHub connected
                    </p>
                  </div>

                  <div className="space-y-2 rounded-2xl border border-[#343d55] bg-[#050816] p-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#ffd447] text-[10px] font-semibold text-[#18120b]">
                        A
                      </span>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#7d88aa]">
                          Your match
                        </p>
                        <p className="text-xs font-semibold text-[#f8f3e8]">
                          Staff Eng · SF · ML
                        </p>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#c7d0f0]">
                      “Happy to share interview tips and startup war stories.”
                    </p>
                    <p className="text-[10px] text-[#bef264]">
                      Verified via LinkedIn
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-[#343d55] bg-[#050816] px-3 py-2 text-[11px] text-[#d3dcec]">
                  <span>Session starts in 00:07…</span>
                  <div className="flex gap-2">
                    <button className="rounded-full bg-[#141b30] px-3 py-1 text-[11px] hover:bg-[#1b2340]">
                      Text only
                    </button>
                    <button className="rounded-full bg-[#bef264] px-3 py-1 text-[11px] font-medium text-[#0b1018] hover:bg-[#d9f99d]">
                      Join with video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-[#272f45] bg-[#070b12] px-4 py-16"
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-left">
            How it works
          </h2>
          <div className="grid gap-6 text-sm text-[#d3dcec] sm:grid-cols-3">
            <div className="space-y-2 rounded-2xl border border-[#272f45] bg-[#0c111c] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2]">
                1. Sign in
              </p>
              <p className="text-sm font-medium text-[#f8f3e8]">
                Authenticate with LinkedIn or GitHub
              </p>
              <p>
                We use OAuth to confirm you’re a real professional. No passwords
                stored, no anonymous accounts.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-[#272f45] bg-[#0c111c] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2]">
                2. Choose what to talk about
              </p>
              <p className="text-sm font-medium text-[#f8f3e8]">
                Pick topics and your seniority
              </p>
              <p>
                Select themes like backend, AI/ML, interviews, startups, or
                networking. We&apos;ll use this to find a relevant match.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-[#272f45] bg-[#0c111c] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2]">
                3. Get matched
              </p>
              <p className="text-sm font-medium text-[#f8f3e8]">
                1:1 live conversation in seconds
              </p>
              <p>
                You&apos;re paired with another tech person for a focused
                conversation. Skip, block, or report anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="safety"
        className="border-t border-[#272f45] bg-[#050911] px-4 py-16"
      >
        <div className="mx-auto max-w-6xl space-y-6 text-sm text-[#d3dcec]">
          <h2 className="text-2xl font-semibold tracking-tight">Safety first</h2>
          <p className="max-w-2xl">
            Omegle struggled because it couldn&apos;t reliably authenticate or
            hold people accountable. TechConnect Live starts with identity: every
            user signs in with LinkedIn or GitHub, and you can block or report
            anyone in one tap.
          </p>
          
          {/* Auto-scrolling Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient fade on left edge */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-[#050911] to-transparent" />
            {/* Gradient fade on right edge */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-[#050911] to-transparent" />
            <div 
              className="flex gap-4" 
              style={{ 
                animation: "scroll 60s linear infinite",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.animationPlayState = "paused";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.animationPlayState = "running";
              }}
            >
              {/* Duplicate items for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-4">
                  {/* Verified Identity */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffd447]/20">
                        <svg className="h-5 w-5 text-[#ffd447]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">Verified Identity</p>
                        <p className="text-xs text-[#9aa2c2]">LinkedIn & GitHub OAuth</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      Every user is authenticated through professional profiles. No anonymous accounts or throwaway identities.
                    </p>
                  </div>

                  {/* Block & Report */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                        <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">One-Tap Block & Report</p>
                        <p className="text-xs text-[#9aa2c2]">Instant Protection</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      Quickly block or report anyone with a single tap. Bad actors are flagged and removed from the platform.
                    </p>
                  </div>

                  {/* Screenshot Prevention */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">Screenshot Protection</p>
                        <p className="text-xs text-[#9aa2c2]">Privacy First</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      Advanced detection prevents screenshots and screen captures. Your conversations stay private and protected.
                    </p>
                  </div>

                  {/* Right-Click Prevention */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20">
                        <svg className="h-5 w-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">Right-Click Protection</p>
                        <p className="text-xs text-[#9aa2c2]">Content Security</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      Context menus and text selection are disabled to prevent unauthorized copying or saving of content.
                    </p>
                  </div>

                  {/* DevTools Detection */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                        <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">DevTools Detection</p>
                        <p className="text-xs text-[#9aa2c2]">Active Monitoring</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      Real-time monitoring detects developer tools and suspicious activity to protect your privacy.
                    </p>
                  </div>

                  {/* Keyboard Shortcut Blocking */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                        <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">Shortcut Blocking</p>
                        <p className="text-xs text-[#9aa2c2]">Print Screen & More</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      Print Screen, Snipping Tool shortcuts, and other screenshot methods are blocked to maintain privacy.
                    </p>
                  </div>

                  {/* Account Accountability */}
                  <div className="flex-shrink-0 w-[320px] rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
                        <svg className="h-5 w-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#f8f3e8]">Account Accountability</p>
                        <p className="text-xs text-[#9aa2c2]">Tracked Behavior</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#d3dcec]">
                      User behavior is tracked. Repeat offenders and flagged accounts are automatically removed from the platform.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="border-t border-[#272f45] bg-[#050911] px-4 pb-16 pt-12"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 text-sm text-[#d3dcec] sm:flex-row sm:items-start">
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to meet the tech internet?
            </h2>
            <p className="max-w-md">
              We&apos;re starting with web, LinkedIn and GitHub sign-in, and
              1:1 matching. Mobile apps and more advanced filters will follow.
            </p>
          </div>
          <div className="flex-1 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Early access
            </p>
            <p className="text-sm font-medium text-[#f8f3e8]">
              Want to be one of the first to try it?
            </p>
            <p className="text-xs">
              We&apos;ll soon connect these buttons to real LinkedIn/GitHub
              authentication. For now, they&apos;re just UI entry points.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-[#ffd447] px-4 text-xs font-semibold text-[#18120b] shadow-sm transition hover:bg-[#facc15]">
                Sign in with LinkedIn
              </button>
              <button className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-4 text-xs font-medium text-[#f8f3e8] transition hover:border-[#6471a3] hover:bg-[#151f35]">
                Sign in with GitHub
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
