export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <section className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center gap-10 px-4 py-16 text-center sm:flex-row sm:items-stretch sm:gap-16 sm:text-left">
        <div className="flex-1 space-y-6">
          <p className="inline-flex rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300 shadow-sm">
            Built for tech folks who actually use LinkedIn & GitHub
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Random 1:1 conversations{" "}
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              with verified tech professionals
            </span>
            .
          </h1>
          <p className="max-w-xl text-balance text-sm text-slate-300 sm:text-base">
            TechConnect Live matches you with engineers, founders, and creators in
            real time. Every participant signs in with LinkedIn or GitHub, so you
            get fewer trolls and more useful conversations.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button className="inline-flex h-11 items-center justify-center rounded-full bg-sky-500 px-5 text-sm font-medium text-slate-950 shadow-sm transition hover:bg-sky-400">
              Start with LinkedIn
            </button>
            <button className="inline-flex h-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-5 text-sm font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
              Start with GitHub
            </button>
          </div>
          <p className="text-xs text-slate-400">
            OAuth only · No anonymous accounts · You stay in control of what you
            share.
          </p>
        </div>

        <div className="mt-4 flex flex-1 justify-center sm:mt-0">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-sky-500/10">
            <div className="mb-3 flex items-center justify-between text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Matching you with
              </span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                Backend · AI/ML · Career
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-200">
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  You
                </p>
                <p className="text-sm font-semibold">Senior Backend Engineer</p>
                <p className="text-[11px] text-slate-300">
                  Looking to talk system design, scaling, and career growth.
                </p>
                <p className="text-[10px] text-slate-400">
                  LinkedIn · GitHub connected
                </p>
              </div>

              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  Your match
                </p>
                <p className="text-sm font-semibold">Staff Engineer · SF</p>
                <p className="text-[11px] text-slate-300">
                  “Here to chat about architecture, interviewing, and startups.”
                </p>
                <p className="text-[10px] text-emerald-400">
                  Verified via LinkedIn
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-[11px] text-slate-300">
              <span>Session starts in 00:07…</span>
              <div className="flex gap-2">
                <button className="rounded-full bg-slate-800 px-3 py-1 text-[11px] hover:bg-slate-700">
                  Text only
                </button>
                <button className="rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-medium text-slate-950 hover:bg-emerald-400">
                  Join with video
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-slate-800/60 bg-slate-950 px-4 py-16"
      >
        <div className="mx-auto max-w-6xl space-y-8">
          <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-left">
            How it works
          </h2>
          <div className="grid gap-6 text-sm text-slate-300 sm:grid-cols-3">
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                1. Sign in
              </p>
              <p className="text-sm font-medium text-slate-50">
                Authenticate with LinkedIn or GitHub
              </p>
              <p>
                We use OAuth to confirm you’re a real professional. No passwords
                stored, no anonymous accounts.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                2. Choose what to talk about
              </p>
              <p className="text-sm font-medium text-slate-50">
                Pick topics and your seniority
              </p>
              <p>
                Select themes like backend, AI/ML, interviews, startups, or
                networking. We&apos;ll use this to find a relevant match.
              </p>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                3. Get matched
              </p>
              <p className="text-sm font-medium text-slate-50">
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
        className="border-t border-slate-800/60 bg-slate-950 px-4 py-16"
      >
        <div className="mx-auto max-w-6xl space-y-6 text-sm text-slate-300">
          <h2 className="text-2xl font-semibold tracking-tight">Safety first</h2>
          <p className="max-w-2xl">
            Omegle struggled because it couldn&apos;t reliably authenticate or
            hold people accountable. TechConnect Live starts with identity: every
            user signs in with LinkedIn or GitHub, and you can block or report
            anyone in one tap.
          </p>
          <ul className="grid gap-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm font-medium text-slate-50">
                Verified sign-ins only
              </p>
              <p className="mt-1 text-xs text-slate-300">
                No throwaway accounts. Each user is tied to a professional profile.
              </p>
            </li>
            <li className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm font-medium text-slate-50">
                One-tap block & report
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Quickly remove bad actors from your experience and flag issues.
              </p>
            </li>
            <li className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <p className="text-sm font-medium text-slate-50">
                Clear community guidelines
              </p>
              <p className="mt-1 text-xs text-slate-300">
                No harassment, hate, or spam. Repeat offenders are removed.
              </p>
            </li>
          </ul>
        </div>
      </section>

      <section
        id="faq"
        className="border-t border-slate-800/60 bg-slate-950 px-4 pb-16 pt-12"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-8 text-sm text-slate-300 sm:flex-row sm:items-start">
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
            <p className="text-sm font-medium text-slate-50">
              Want to be one of the first to try it?
            </p>
            <p className="text-xs">
              We&apos;ll soon connect these buttons to real LinkedIn/GitHub
              authentication. For now, they&apos;re just UI entry points.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button className="inline-flex h-10 flex-1 items-center justify-center rounded-full bg-sky-500 px-4 text-xs font-medium text-slate-950 shadow-sm transition hover:bg-sky-400">
                Sign in with LinkedIn
              </button>
              <button className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 text-xs font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
                Sign in with GitHub
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
