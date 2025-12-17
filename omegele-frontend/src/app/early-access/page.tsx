export default function EarlyAccessPage() {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-16">
        <section className="space-y-6 text-center sm:text-left">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Early Access & Waitlist
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-300 sm:text-base">
            We&apos;re building TechConnect Live in public. In the first phase,
            we&apos;ll invite a small group of engineers, founders, and tech
            students to help shape the product.
          </p>
        </section>

        <section className="mt-10 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Coming soon
          </p>
          <p>
            This page will eventually collect sign-ups (email or OAuth-based) so
            we can invite people in waves. For now, think of it as a placeholder
            for your future waitlist flow.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-sky-500 px-4 text-xs font-medium text-slate-950 shadow-sm transition hover:bg-sky-400">
              I&apos;m interested (LinkedIn)
            </button>
            <button className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-4 text-xs font-medium text-slate-100 transition hover:border-slate-500 hover:bg-slate-800">
              I&apos;m interested (GitHub)
            </button>
          </div>
          <p className="text-[11px] text-slate-400">
            Once we hook this up to a backend, clicking these buttons could add
            you to a waitlist using your LinkedIn or GitHub identity.
          </p>
        </section>
      </main>
    </div>
  );
}


