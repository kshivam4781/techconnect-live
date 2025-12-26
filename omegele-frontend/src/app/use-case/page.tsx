export default function UseCasePage() {
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
            Use Cases & Best Practices
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            How to get the most out of Vinamah
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-[#d3dcec] leading-relaxed">
            Vinamah connects you with real people in tech for meaningful conversations. 
            Whether you&apos;re looking to network, find opportunities, or get advice, 
            here&apos;s how to make the most of every connection.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* How to Use Section */}
        <section className="mb-16">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">
              How to Use This Website
            </h2>
            <p className="text-base leading-relaxed text-slate-700 mb-6">
              Vinamah is designed for spontaneous, authentic conversations between tech 
              professionals. Here&apos;s how it works:
            </p>
            <ol className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  1
                </div>
                <div className="flex-1">
                  <strong className="text-base font-semibold text-slate-900 block mb-1">
                    Sign in with your professional profile
                  </strong>
                  <p className="text-base text-slate-600">
                    Authenticate using LinkedIn or GitHub to verify your identity and 
                    build trust with other users.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  2
                </div>
                <div className="flex-1">
                  <strong className="text-base font-semibold text-slate-900 block mb-1">
                    Set your conversation preferences
                  </strong>
                  <p className="text-base text-slate-600">
                    Choose topics you want to discuss (backend, AI/ML, career advice, 
                    startups, etc.) and your experience level to get better matches.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  3
                </div>
                <div className="flex-1">
                  <strong className="text-base font-semibold text-slate-900 block mb-1">
                    Get matched with like-minded professionals
                  </strong>
                  <p className="text-base text-slate-600">
                    Our algorithm pairs you with someone who shares your interests or 
                    can provide valuable insights based on your selected preferences.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  4
                </div>
                <div className="flex-1">
                  <strong className="text-base font-semibold text-slate-900 block mb-1">
                    Engage in meaningful conversations
                  </strong>
                  <p className="text-base text-slate-600">
                    Have real-time 1:1 conversations via text or video. Be authentic, 
                    respectful, and clear about your intentions.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  5
                </div>
                <div className="flex-1">
                  <strong className="text-base font-semibold text-slate-900 block mb-1">
                    Take action when needed
                  </strong>
                  <p className="text-base text-slate-600">
                    Exchange contact information if you want to continue the conversation, 
                    or simply move on to the next match. You&apos;re in control.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Best Practices Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              How to Make Sure It&apos;s Helpful
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Follow these best practices to get the most value from every conversation
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Be Clear About Your Intentions
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Start conversations by sharing what you&apos;re looking for. Whether 
                it&apos;s career advice, networking, or finding a co-founder, being 
                upfront helps both parties make the most of the conversation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Listen Actively
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Great conversations are a two-way street. Ask thoughtful questions, 
                show genuine interest in the other person&apos;s experiences, and 
                share your own insights when relevant.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Respect Boundaries
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Not every conversation needs to lead to a business opportunity. Some 
                connections are just for learning, sharing experiences, or casual 
                networking. Respect the other person&apos;s time and boundaries.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ffd447] mb-4">
                <svg className="h-6 w-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Follow Up When Appropriate
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                If you have a great conversation and both parties are interested, 
                exchange contact information. But don&apos;t force it—let connections 
                happen naturally.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Use Cases Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Popular Use Cases
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Here are some common ways people use Vinamah to advance their careers, 
              build their networks, and grow their businesses:
            </p>
          </div>

          <div className="space-y-6">
            {/* Making New Connections */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  1
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Making New Connections
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Expand your professional network by connecting with engineers, 
                    designers, founders, and other tech professionals from around 
                    the world. Share experiences, learn about different industries, 
                    and build relationships that can lead to future collaborations, 
                    job opportunities, or simply valuable friendships in the tech 
                    community.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Be genuine and 
                      curious. Ask about their projects, challenges, and what they&apos;re 
                      excited about. The best connections happen when both people are 
                      genuinely interested in each other&apos;s work.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Finding Your Co-Founder */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  2
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Finding Your Co-Founder
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Starting a company but need the right technical or business 
                    partner? Use Vinamah to meet potential co-founders who complement 
                    your skills. Discuss your vision, validate ideas, and find someone 
                    who shares your passion and work ethic. Many successful startups 
                    begin with a strong co-founder relationship built on mutual 
                    respect and aligned goals.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Be clear about 
                      your startup idea, what skills you&apos;re looking for, and what 
                      you bring to the table. Look for complementary skills and shared 
                      values, not just technical expertise.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Finding Venture Capital */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  3
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Finding Venture Capital & Investors
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Connect with investors, VCs, and angel investors who are 
                    interested in tech startups. Share your pitch, get feedback on 
                    your business model, and potentially find the right investor for 
                    your venture. Many investors use platforms like this to discover 
                    promising founders and early-stage companies.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Have a clear 
                      elevator pitch ready, but focus on building a relationship first. 
                      Investors invest in people as much as they invest in ideas. Show 
                      your passion, knowledge, and execution ability.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Review & Career Advice */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  4
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Resume Review & Career Advice
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Get personalized feedback on your resume, portfolio, or career 
                    trajectory from experienced professionals. Whether you&apos;re 
                    preparing for interviews, considering a career change, or looking 
                    to level up, connect with senior engineers, hiring managers, and 
                    career coaches who can provide actionable advice tailored to your 
                    situation.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Be specific 
                      about what you need help with. Share your resume or portfolio 
                      link if comfortable, and ask targeted questions. The more context 
                      you provide, the better the advice you&apos;ll receive.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Mentorship */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  5
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Technical Mentorship & Learning
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Learn from experienced engineers, architects, and technical 
                    leaders. Get help with specific technologies, architecture 
                    decisions, debugging challenges, or career progression. Many 
                    senior engineers enjoy sharing their knowledge and helping the 
                    next generation of developers grow.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Come prepared 
                      with specific questions or problems. Show that you&apos;ve done 
                      your research, and be ready to discuss your approach. Mentors 
                      appreciate learners who are proactive and engaged.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hiring & Talent Acquisition */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  6
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Hiring & Talent Acquisition
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Recruiters and hiring managers can discover talented candidates 
                    in a more authentic setting. Have genuine conversations about 
                    career goals, technical interests, and company culture fit 
                    before the formal interview process. This approach often leads to 
                    better matches and more engaged candidates.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Focus on 
                      building rapport first. Don&apos;t lead with a job pitch—learn 
                      about the person, their interests, and what they&apos;re looking 
                      for. If there&apos;s a fit, the opportunity will naturally come 
                      up.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Insights & Market Research */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  7
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Industry Insights & Market Research
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Connect with professionals from different companies, industries, 
                    and regions to understand market trends, technology adoption, and 
                    industry best practices. Whether you&apos;re researching a new 
                    market, evaluating a technology stack, or understanding 
                    competitive landscapes, real conversations provide insights you 
                    can&apos;t get from articles alone.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Be respectful 
                      of people&apos;s time and company confidentiality. Ask open-ended 
                      questions about trends and experiences rather than specific 
                      proprietary information.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Side Project Collaboration */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#ffd447] text-sm font-semibold text-slate-900">
                  8
                </div>
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Side Project Collaboration
                  </h3>
                  <p className="text-base text-slate-700 leading-relaxed">
                    Find collaborators for side projects, open-source contributions, 
                    hackathons, or learning initiatives. Whether you need a designer, 
                    a backend developer, a frontend specialist, or just someone to 
                    bounce ideas off of, Vinamah helps you find people who share your 
                    passion for building.
                  </p>
                  <div className="rounded-lg bg-slate-50 p-3 border border-slate-200">
                    <p className="text-sm text-slate-700">
                      <strong className="text-slate-900">Tip:</strong> Clearly 
                      describe your project, what stage it&apos;s in, and what kind of 
                      help you&apos;re looking for. Be realistic about time commitments 
                      and expectations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 sm:p-10 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-base text-slate-700 leading-relaxed mb-6">
            The best way to experience Vinamah is to jump in and start conversations. 
            Remember: every connection is an opportunity to learn, grow, and build 
            meaningful relationships in the tech community.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/match"
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#ffd447] px-6 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-[#facc15] hover:shadow-md"
            >
              Start a Conversation
            </a>
            <a
              href="/guidelines"
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-300 bg-white px-6 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-400"
            >
              Read Community Guidelines
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
