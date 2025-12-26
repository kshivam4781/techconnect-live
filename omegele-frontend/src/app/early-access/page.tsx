export default function EarlyAccessPage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-3xl px-4 py-16">
        <section className="space-y-6 text-center sm:text-left">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            Early access
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Help set the tone for the first thousand conversations.
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            We&apos;re inviting a small mix of students, senior ICs, founders,
            and people‑leaders to shape TechConnect Live before we open the
            doors wider. If you care about how people meet and talk in tech,
            you&apos;re the right kind of early user.
          </p>
        </section>

        <section className="mt-10 space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6 text-sm text-[#d3dcec]">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#9aa2c2]">
            Coming soon
          </p>
          <p>
            This page will soon let you raise your hand with one click using
            your LinkedIn or GitHub account. For now, think of it as the lobby
            sign that says “we&apos;re setting up the room.”
          </p>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-[#d3dcec]">
              To join the early access waitlist, please{" "}
              <a
                href="/"
                className="text-[#ffd447] hover:underline font-medium"
              >
                sign in with LinkedIn or GitHub
              </a>
              {" "}from our homepage. Once signed in, you&apos;ll automatically be considered for early access.
            </p>
            <a
              href="/"
              className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#ffd447] px-4 text-xs font-semibold text-[#18120b] shadow-sm transition hover:bg-[#facc15]"
            >
              Go to Homepage to Sign In
            </a>
          </div>
          <p className="text-[11px] text-[#9aa2c2]">
            Early access is currently managed through our main platform. Sign in to get started.
          </p>
        </section>
      </main>
    </div>
  );
}

