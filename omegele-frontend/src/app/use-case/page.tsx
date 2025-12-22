export default function UseCasePage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            How to get the most out of TechConnect Live
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Use Cases & Best Practices
          </h1>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            TechConnect Live connects you with real people in tech for meaningful
            conversations. Whether you&apos;re looking to network, find opportunities,
            or get advice, here&apos;s how to make the most of every connection.
          </p>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            How to Use This Website
          </h2>
          <div className="space-y-4 text-sm text-[#d3dcec] sm:text-base">
            <p>
              TechConnect Live is designed for spontaneous, authentic conversations
              between tech professionals. Here&apos;s how it works:
            </p>
            <ol className="ml-6 space-y-3 list-decimal">
              <li>
                <strong className="text-[#f8f3e8]">Sign in with your professional profile</strong>
                <span className="block mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  Authenticate using LinkedIn or GitHub to verify your identity and
                  build trust with other users.
                </span>
              </li>
              <li>
                <strong className="text-[#f8f3e8]">Set your conversation preferences</strong>
                <span className="block mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  Choose topics you want to discuss (backend, AI/ML, career advice,
                  startups, etc.) and your experience level to get better matches.
                </span>
              </li>
              <li>
                <strong className="text-[#f8f3e8]">Get matched with like-minded professionals</strong>
                <span className="block mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  Our algorithm pairs you with someone who shares your interests or
                  can provide valuable insights based on your selected preferences.
                </span>
              </li>
              <li>
                <strong className="text-[#f8f3e8]">Engage in meaningful conversations</strong>
                <span className="block mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  Have real-time 1:1 conversations via text or video. Be authentic,
                  respectful, and clear about your intentions.
                </span>
              </li>
              <li>
                <strong className="text-[#f8f3e8]">Take action when needed</strong>
                <span className="block mt-1 text-xs sm:text-sm text-[#9aa2c2]">
                  Exchange contact information if you want to continue the conversation,
                  or simply move on to the next match. You&apos;re in control.
                </span>
              </li>
            </ol>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            How to Make Sure It&apos;s Helpful
          </h2>
          <div className="grid gap-6 text-sm text-[#d3dcec] sm:grid-cols-2">
            <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
              <h3 className="text-base font-semibold text-[#f8f3e8]">
                Be Clear About Your Intentions
              </h3>
              <p className="text-xs sm:text-sm">
                Start conversations by sharing what you&apos;re looking for. Whether
                it&apos;s career advice, networking, or finding a co-founder, being
                upfront helps both parties make the most of the conversation.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
              <h3 className="text-base font-semibold text-[#f8f3e8]">
                Listen Actively
              </h3>
              <p className="text-xs sm:text-sm">
                Great conversations are a two-way street. Ask thoughtful questions,
                show genuine interest in the other person&apos;s experiences, and
                share your own insights when relevant.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
              <h3 className="text-base font-semibold text-[#f8f3e8]">
                Respect Boundaries
              </h3>
              <p className="text-xs sm:text-sm">
                Not every conversation needs to lead to a business opportunity. Some
                connections are just for learning, sharing experiences, or casual
                networking. Respect the other person&apos;s time and boundaries.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-[#272f45] bg-[#0c111c] p-5">
              <h3 className="text-base font-semibold text-[#f8f3e8]">
                Follow Up When Appropriate
              </h3>
              <p className="text-xs sm:text-sm">
                If you have a great conversation and both parties are interested,
                exchange contact information. But don&apos;t force it—let connections
                happen naturally.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Popular Use Cases
          </h2>
          <p className="text-sm text-[#d3dcec] sm:text-base">
            Here are some common ways people use TechConnect Live to advance their
            careers, build their networks, and grow their businesses:
          </p>

          <div className="mt-8 space-y-6">
            {/* Making New Connections */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  1
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Making New Connections
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Expand your professional network by connecting with engineers,
                    designers, founders, and other tech professionals from around
                    the world. Share experiences, learn about different industries,
                    and build relationships that can lead to future collaborations,
                    job opportunities, or simply valuable friendships in the tech
                    community.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Be genuine and
                    curious. Ask about their projects, challenges, and what they&apos;re
                    excited about. The best connections happen when both people are
                    genuinely interested in each other&apos;s work.
                  </p>
                </div>
              </div>
            </div>

            {/* Finding Your Co-Founder */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  2
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Finding Your Co-Founder
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Starting a company but need the right technical or business
                    partner? Use TechConnect Live to meet potential co-founders who
                    complement your skills. Discuss your vision, validate ideas, and
                    find someone who shares your passion and work ethic. Many
                    successful startups begin with a strong co-founder relationship
                    built on mutual respect and aligned goals.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Be clear about
                    your startup idea, what skills you&apos;re looking for, and what
                    you bring to the table. Look for complementary skills and shared
                    values, not just technical expertise.
                  </p>
                </div>
              </div>
            </div>

            {/* Finding Venture Capital */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  3
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Finding Venture Capital & Investors
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Connect with investors, VCs, and angel investors who are
                    interested in tech startups. Share your pitch, get feedback on
                    your business model, and potentially find the right investor for
                    your venture. Many investors use platforms like this to discover
                    promising founders and early-stage companies.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Have a clear
                    elevator pitch ready, but focus on building a relationship first.
                    Investors invest in people as much as they invest in ideas. Show
                    your passion, knowledge, and execution ability.
                  </p>
                </div>
              </div>
            </div>

            {/* Resume Review & Career Advice */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  4
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Resume Review & Career Advice
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Get personalized feedback on your resume, portfolio, or career
                    trajectory from experienced professionals. Whether you&apos;re
                    preparing for interviews, considering a career change, or looking
                    to level up, connect with senior engineers, hiring managers, and
                    career coaches who can provide actionable advice tailored to your
                    situation.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Be specific
                    about what you need help with. Share your resume or portfolio
                    link if comfortable, and ask targeted questions. The more context
                    you provide, the better the advice you&apos;ll receive.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Mentorship */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  5
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Technical Mentorship & Learning
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Learn from experienced engineers, architects, and technical
                    leaders. Get help with specific technologies, architecture
                    decisions, debugging challenges, or career progression. Many
                    senior engineers enjoy sharing their knowledge and helping the
                    next generation of developers grow.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Come prepared
                    with specific questions or problems. Show that you&apos;ve done
                    your research, and be ready to discuss your approach. Mentors
                    appreciate learners who are proactive and engaged.
                  </p>
                </div>
              </div>
            </div>

            {/* Hiring & Talent Acquisition */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  6
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Hiring & Talent Acquisition
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Recruiters and hiring managers can discover talented candidates
                    in a more authentic setting. Have genuine conversations about
                    career goals, technical interests, and company culture fit
                    before the formal interview process. This approach often leads to
                    better matches and more engaged candidates.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Focus on
                    building rapport first. Don&apos;t lead with a job pitch—learn
                    about the person, their interests, and what they&apos;re looking
                    for. If there&apos;s a fit, the opportunity will naturally come
                    up.
                  </p>
                </div>
              </div>
            </div>

            {/* Industry Insights & Market Research */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  7
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Industry Insights & Market Research
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Connect with professionals from different companies, industries,
                    and regions to understand market trends, technology adoption, and
                    industry best practices. Whether you&apos;re researching a new
                    market, evaluating a technology stack, or understanding
                    competitive landscapes, real conversations provide insights you
                    can&apos;t get from articles alone.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Be respectful
                    of people&apos;s time and company confidentiality. Ask open-ended
                    questions about trends and experiences rather than specific
                    proprietary information.
                  </p>
                </div>
              </div>
            </div>

            {/* Side Project Collaboration */}
            <div className="rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-[#18120b]">
                  8
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-[#f8f3e8]">
                    Side Project Collaboration
                  </h3>
                  <p className="text-sm text-[#d3dcec]">
                    Find collaborators for side projects, open-source contributions,
                    hackathons, or learning initiatives. Whether you need a designer,
                    a backend developer, a frontend specialist, or just someone to
                    bounce ideas off of, TechConnect Live helps you find people who
                    share your passion for building.
                  </p>
                  <p className="text-xs text-[#9aa2c2]">
                    <strong className="text-[#f8f3e8]">Tip:</strong> Clearly
                    describe your project, what stage it&apos;s in, and what kind of
                    help you&apos;re looking for. Be realistic about time commitments
                    and expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
          <h2 className="text-xl font-semibold text-[#f8f3e8] mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-sm text-[#d3dcec] mb-4">
            The best way to experience TechConnect Live is to jump in and start
            conversations. Remember: every connection is an opportunity to learn,
            grow, and build meaningful relationships in the tech community.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/match"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-5 text-sm font-semibold text-[#18120b] shadow-[0_0_26px_rgba(250,204,21,0.45)] transition hover:-translate-y-0.5 hover:bg-[#facc15] hover:shadow-[0_0_34px_rgba(250,204,21,0.7)]"
            >
              Start a Conversation
            </a>
            <a
              href="/guidelines"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#3b435a] bg-[#0f1729] px-5 text-sm font-medium text-[#f8f3e8] shadow-sm transition hover:-translate-y-0.5 hover:border-[#6471a3] hover:bg-[#151f35]"
            >
              Read Community Guidelines
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

