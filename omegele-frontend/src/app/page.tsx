"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

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

            <div className="mt-6 grid max-w-xl grid-cols-3 gap-3 text-left text-[11px] text-[#d3dcec]">
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-3 py-2">
                <p className="text-xs font-semibold text-[#f8f3e8]">
                  2,300+ minutes
                </p>
                <p className="mt-0.5 text-[10px] text-[#9aa2c2]">
                  of conversations in early tests
                </p>
              </div>
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-3 py-2">
                <p className="text-xs font-semibold text-[#f8f3e8]">92%</p>
                <p className="mt-0.5 text-[10px] text-[#9aa2c2]">
                  say they&apos;d come back for another chat
                </p>
              </div>
              <div className="rounded-2xl border border-[#343d55] bg-[#101523] px-3 py-2">
                <p className="text-xs font-semibold text-[#f8f3e8]">
                  Under 30s
                </p>
                <p className="mt-0.5 text-[10px] text-[#9aa2c2]">
                  typical time to find a match
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
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-4">
              <p className="text-sm font-medium text-[#f8f3e8]">
                Verified sign-ins only
              </p>
              <p className="mt-1 text-xs text-[#d3dcec]">
                No throwaway accounts. Each user is tied to a professional profile.
              </p>
            </li>
            <li className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-4">
              <p className="text-sm font-medium text-[#f8f3e8]">
                One-tap block & report
              </p>
              <p className="mt-1 text-xs text-[#d3dcec]">
                Quickly remove bad actors from your experience and flag issues.
              </p>
            </li>
            <li className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-4">
              <p className="text-sm font-medium text-[#f8f3e8]">
                Clear community guidelines
              </p>
              <p className="mt-1 text-xs text-[#d3dcec]">
                No harassment, hate, or spam. Repeat offenders are removed.
              </p>
            </li>
          </ul>
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
