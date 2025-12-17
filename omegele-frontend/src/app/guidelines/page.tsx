export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            How we keep the room good
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Community Guidelines
          </h1>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            TechConnect Live is for real conversations between people who build,
            hire, and learn. These guidelines are written so that a student, a
            staff engineer, and a VP of People can all feel comfortable in the
            same session.
          </p>
        </section>

        <section className="mt-10 grid gap-6 text-sm text-[#d3dcec] sm:grid-cols-2">
          <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
            <h2 className="text-base font-semibold text-[#f8f3e8]">
              What&apos;s expected
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Show up as you would in a candid 1:1 at work.</li>
              <li>Be clear about why you joined the session.</li>
              <li>Listen more than you pitch; ask before giving advice.</li>
              <li>Respect time limits and the other person&apos;s boundaries.</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
            <h2 className="text-base font-semibold text-[#f8f3e8]">
              Not allowed
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>Harassment, hate, or discriminatory behavior of any kind.</li>
              <li>Sexual content, nudity, or explicit behavior.</li>
              <li>Spam, scams, or aggressive recruiting or selling.</li>
              <li>Sharing private information or recordings without consent.</li>
            </ul>
          </div>
        </section>

        <section className="mt-10 grid gap-6 text-xs text-[#d3dcec] sm:grid-cols-2 sm:text-sm">
          <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
            <h2 className="text-sm font-semibold text-[#f8f3e8]">
              Blocking & reporting
            </h2>
            <p>
              You can block or report another user in one tap. Blocked users
              won&apos;t be matched with you again. Reports are reviewed and help
              us detect patterns and remove repeat offenders.
            </p>
          </div>
          <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
            <h2 className="text-sm font-semibold text-[#f8f3e8]">
              Enforcement
            </h2>
            <p>
              Depending on severity, we may apply temporary suspensions,
              permanent bans, or follow up with platforms when abuse is tied to
              a verified LinkedIn or GitHub profile.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

