export default function GuidelinesPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Community Guidelines
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 sm:text-base">
            TechConnect Live is for professional, respectful conversations.
            These guidelines exist to keep the experience useful and safe for
            everyone.
          </p>
        </section>

        <section className="mt-10 grid gap-6 text-sm text-slate-300 sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-base font-semibold text-slate-50">
              What&apos;s expected
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Show up as you would in a professional setting.</li>
              <li>Be honest about your background and intentions.</li>
              <li>Listen actively and don&apos;t dominate the conversation.</li>
              <li>Respect time limits and the other person&apos;s boundaries.</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-base font-semibold text-slate-50">
              Not allowed
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Harassment, hate, or discriminatory behavior of any kind.</li>
              <li>Sexual content, nudity, or explicit behavior.</li>
              <li>Spam, scams, or aggressive pitching.</li>
              <li>Sharing private information without consent.</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 grid gap-6 text-xs text-slate-300 sm:grid-cols-2 sm:text-sm">
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold text-slate-50">
              Blocking & reporting
            </h2>
            <p>
              You can block or report another user in one tap. Blocked users
              won&apos;t be matched with you again. Reports help us detect and
              remove repeat offenders.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="text-sm font-semibold text-slate-50">
              Enforcement
            </h2>
            <p>
              Depending on severity, we may apply temporary suspensions,
              permanent bans, or contact relevant platforms when abuse is tied
              to a LinkedIn or GitHub profile.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}


