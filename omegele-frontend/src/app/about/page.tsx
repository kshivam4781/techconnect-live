export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            About TechConnect Live
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            TechConnect Live is a professional take on the &quot;Omegle for
            tech&quot; idea. It helps engineers, founders, students, and
            builders have real-time 1:1 conversations with other people who are
            serious about their work.
          </p>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            Unlike traditional anonymous chat platforms, every participant signs
            in with LinkedIn or GitHub. That simple change makes it much easier
            to keep conversations high-signal and cut down on trolls.
          </p>
        </section>

        <section className="mt-12 grid gap-6 text-sm text-slate-300 sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-base font-semibold text-slate-50">
              Who this is for
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Developers who want to talk shop beyond their current team.</li>
              <li>Students breaking into tech and looking for guidance.</li>
              <li>Founders and indie hackers looking for feedback or co-founders.</li>
              <li>Recruiters and hiring managers who actually understand tech.</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-base font-semibold text-slate-50">
              What we&apos;re building toward
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Fast, relevant matches based on skills and interests.</li>
              <li>Tools for mentors and communities to host office hours.</li>
              <li>A safer default for &quot;meeting people on the internet.&quot;</li>
              <li>Clear controls so you decide what to share and when.</li>
            </ul>
          </div>
        </section>

        <section className="mt-12 space-y-4 text-xs text-slate-400 sm:text-sm">
          <h2 className="text-sm font-semibold text-slate-100">
            Privacy & terms (early version)
          </h2>
          <p>
            In this early phase, we&apos;re focused on building the core
            product. As we get closer to a public launch, this page will expand
            into a full privacy policy and terms of use, written in plain
            language.
          </p>
          <p>
            The core principles are simple: collect the minimum data needed to
            make good matches, protect it carefully, and give you clear options
            to control or delete your information.
          </p>
        </section>
      </main>
    </div>
  );
}


