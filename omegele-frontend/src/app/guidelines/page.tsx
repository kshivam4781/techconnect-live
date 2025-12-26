export default function GuidelinesPage() {
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
            How we keep the room good
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            Community Guidelines
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#d3dcec] leading-relaxed">
            Vinamah is for real conversations between people who build, hire, and learn. 
            These guidelines are written so that a student, a staff engineer, and a VP of 
            People can all feel comfortable in the same session.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              What&apos;s expected
            </h2>
            <ul className="space-y-2 text-base text-slate-700 list-disc list-inside">
              <li>Show up as you would in a candid 1:1 at work.</li>
              <li>Be clear about why you joined the session.</li>
              <li>Listen more than you pitch; ask before giving advice.</li>
              <li>Respect time limits and the other person&apos;s boundaries.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Not allowed
            </h2>
            <ul className="space-y-2 text-base text-slate-700 list-disc list-inside">
              <li>Harassment, hate, or discriminatory behavior of any kind.</li>
              <li>Sexual content, nudity, or explicit behavior.</li>
              <li>Spam, scams, or aggressive recruiting or selling.</li>
              <li>Sharing private information or recordings without consent.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Blocking & reporting
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              You can block or report another user in one tap. Blocked users won&apos;t be 
              matched with you again. Reports are reviewed and help us detect patterns and 
              remove repeat offenders.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Enforcement
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              Depending on severity, we may apply temporary suspensions, permanent bans, 
              or follow up with platforms when abuse is tied to a verified LinkedIn or 
              GitHub profile.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
