export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            Product story
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Where hiring managers, builders, and learners all share the same room.
          </h1>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            TechConnect Live started as a late‑night idea between a recruiter, a
            staff engineer, and a founder who were tired of forced networking.
            We wanted a place where students, senior ICs, and execs could all
            drop in for honest 1:1 conversations without it feeling like a pitch
            or a panel.
          </p>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            Every session is grounded in identity&mdash;people sign in with
            LinkedIn or GitHub&mdash;but the vibe is closer to a good hallway
            track at a conference than a formal interview loop.
          </p>
        </section>

        <section className="mt-12 grid gap-6 text-sm text-[#d3dcec] sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
            <h2 className="text-base font-semibold text-[#f8f3e8]">
              Who this is for
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Students and all‑nighters looking for real talk, not generic advice.</li>
              <li>Engineers and designers who miss conference hallway chats.</li>
              <li>Founders and PMs looking for signal outside their own bubble.</li>
              <li>
                Talent partners, HR, and hiring managers who want to listen before
                they pitch.
              </li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
            <h2 className="text-base font-semibold text-[#f8f3e8]">
              What we&apos;re building toward
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Fast, relevant matches based on skills, interests, and intent.</li>
              <li>Lightweight “office hours” for founders, mentors, and hiring teams.</li>
              <li>A healthier default for “meeting people on the internet.”</li>
              <li>Controls so you decide what to share, and when to step away.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 space-y-4 text-xs text-[#9aa2c2] sm:text-sm">
          <h2 className="text-sm font-semibold text-[#f8f3e8]">
            Privacy & terms (early draft)
          </h2>
          <p>
            We keep things simple: we collect only what we need to run sessions,
            keep people safe, and improve matching. As we approach a broader
            launch, this page will grow into a full privacy policy and terms of
            use written in plain language.
          </p>
          <p>
            You&apos;ll always have options to see what we know about you,
            request changes, or delete your data entirely.
          </p>
        </section>
      </main>
    </div>
  );
}

