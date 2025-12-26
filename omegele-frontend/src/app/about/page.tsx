export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(190,242,100,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,212,71,0.1),transparent_50%)]" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#3b435a] bg-[#131827] px-4 py-2 text-sm font-medium text-[#d3dcec] shadow-sm backdrop-blur mb-6">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#bef264]" />
            About Vinamah
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            Where hiring managers, builders, and learners all share the same room.
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#d3dcec] leading-relaxed">
            Vinamah started as a late‑night idea between a recruiter, a staff engineer, 
            and a founder who were tired of forced networking. We wanted a place where 
            students, senior ICs, and execs could all drop in for honest 1:1 conversations 
            without it feeling like a pitch or a panel.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Story Section */}
        <section className="mb-16 space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Our Story
            </h2>
            <p className="text-base leading-relaxed text-slate-700 mb-4">
              Every session is grounded in identity&mdash;people sign in with LinkedIn or 
              GitHub&mdash;but the vibe is closer to a good hallway track at a conference 
              than a formal interview loop. We believe the best connections happen when 
              people can be authentic, share real experiences, and have conversations that 
              matter.
            </p>
            <p className="text-base leading-relaxed text-slate-700">
              Vinamah is built for people who actually ship things. Whether you&apos;re 
              debugging at 2 AM, building your next startup, or looking for your next 
              opportunity, we&apos;re here to help you connect with the right people 
              at the right time.
            </p>
          </div>
        </section>

        {/* Who This Is For & What We're Building */}
        <section className="mb-16 grid gap-6 sm:grid-cols-2">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd447] mb-2">
              <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Who this is for
            </h2>
            <ul className="space-y-3 text-base text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Students and all‑nighters looking for real talk, not generic advice.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Engineers and designers who miss conference hallway chats.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Founders and PMs looking for signal outside their own bubble.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Talent partners, HR, and hiring managers who want to listen before they pitch.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffd447] mb-2">
              <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              What we&apos;re building toward
            </h2>
            <ul className="space-y-3 text-base text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Fast, relevant matches based on skills, interests, and intent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Lightweight "office hours" for founders, mentors, and hiring teams.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>A healthier default for "meeting people on the internet."</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ffd447] mt-1">•</span>
                <span>Controls so you decide what to share, and when to step away.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              What we stand for
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Our core principles guide everything we build
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Safety First
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Every user is verified through LinkedIn or GitHub. You can block or report anyone instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Privacy by Design
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Your conversations are private. We collect only what we need and you control your data.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Authentic Connections
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Real conversations between real people. No bots, no spam, just genuine connections.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy & Terms Section */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Privacy & Terms
          </h2>
          <div className="space-y-4 text-base text-slate-700 leading-relaxed">
            <p>
              We keep things simple: we collect only what we need to run sessions, keep people 
              safe, and improve matching. As we approach a broader launch, this page will grow 
              into a full privacy policy and terms of use written in plain language.
            </p>
            <p>
              You&apos;ll always have options to see what we know about you, request changes, 
              or delete your data entirely. Your privacy is not negotiable.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
              >
                Privacy Policy
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="/terms"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
              >
                Terms & Conditions
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

