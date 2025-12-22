export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            Platform Rules
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Acceptable Use Policy
          </h1>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        <section className="mt-10 space-y-6 text-sm text-[#d3dcec] sm:text-base">
          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Purpose
            </h2>
            <p>
              This Acceptable Use Policy outlines the rules and guidelines for using our platform. By using this service, you agree to comply with this policy. Violations may result in suspension or termination of your account.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Professional Conduct
            </h2>
            <p>
              This platform is designed for professional networking and meaningful conversations. You agree to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Maintain a professional and respectful demeanor at all times</li>
              <li>Use the platform for its intended purpose of professional networking</li>
              <li>Respect other users&apos; time, boundaries, and privacy</li>
              <li>Be honest about your identity, background, and intentions</li>
              <li>Follow all applicable laws and regulations</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#ffd44733] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#ffd447]">
              Prohibited Activities
            </h2>
            <p className="font-medium text-[#f8f3e8] mb-3">
              The following activities are strictly prohibited and may result in immediate account termination:
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Harassment and Abuse</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Harassing, bullying, threatening, or intimidating other users</li>
                  <li>Using hate speech, slurs, or discriminatory language</li>
                  <li>Stalking or repeatedly contacting users who have indicated they do not want to interact</li>
                  <li>Making threats of violence or harm</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Inappropriate Content</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Sharing sexual, explicit, or pornographic content</li>
                  <li>Displaying nudity or engaging in sexual behavior</li>
                  <li>Sharing graphic, violent, or disturbing content</li>
                  <li>Using profanity excessively or inappropriately</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Spam and Solicitation</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Sending unsolicited commercial messages or advertisements</li>
                  <li>Aggressively recruiting or selling products/services</li>
                  <li>Sharing referral links, affiliate links, or promotional codes without permission</li>
                  <li>Repeatedly sending the same message to multiple users</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Fraud and Scams</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Engaging in fraudulent activities or scams</li>
                  <li>Impersonating other individuals, companies, or organizations</li>
                  <li>Phishing or attempting to steal personal information</li>
                  <li>Requesting money, donations, or financial assistance</li>
                  <li>Promoting pyramid schemes, MLMs, or other suspicious business opportunities</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Privacy Violations</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Recording, screenshotting, or capturing video/audio without explicit consent</li>
                  <li>Sharing another user&apos;s personal information without permission</li>
                  <li>Doxxing or revealing private information about other users</li>
                  <li>Attempting to identify or locate users outside the platform without consent</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Technical Abuse</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Attempting to hack, exploit, or compromise the platform</li>
                  <li>Using automated tools, bots, or scripts to interact with the service</li>
                  <li>Circumventing security measures or access controls</li>
                  <li>Overloading or disrupting the service</li>
                  <li>Creating multiple accounts to evade bans or restrictions</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Illegal Activities</h3>
                <ul className="ml-6 list-disc space-y-1 text-sm">
                  <li>Engaging in any illegal activities or encouraging others to do so</li>
                  <li>Sharing content that violates intellectual property rights</li>
                  <li>Distributing malware, viruses, or harmful software</li>
                  <li>Violating any applicable local, state, national, or international laws</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Account Responsibilities
            </h2>
            <p>
              You are responsible for:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your account information is accurate and up-to-date</li>
              <li>Not sharing your account with others</li>
              <li>Reporting any unauthorized access to your account immediately</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Reporting Violations
            </h2>
            <p>
              If you encounter any violations of this policy, please report them immediately using the platform&apos;s reporting features. We take all reports seriously and will investigate promptly.
            </p>
            <p>
              When reporting, please provide:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Details of the violation</li>
              <li>User ID or identifying information (if available)</li>
              <li>Timestamp and relevant context</li>
              <li>Any evidence (screenshots, etc.) if applicable</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Enforcement
            </h2>
            <p>
              Violations of this policy may result in:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li><strong className="text-[#ffd447]">Warnings:</strong> For minor or first-time violations</li>
              <li><strong className="text-[#ffd447]">Temporary Suspension:</strong> For repeated violations or moderate offenses</li>
              <li><strong className="text-[#ffd447]">Permanent Ban:</strong> For severe violations, repeat offenses, or illegal activities</li>
              <li><strong className="text-[#ffd447]">Legal Action:</strong> For serious violations, we may report to law enforcement</li>
            </ul>
            <p className="mt-4">
              We reserve the right to take any action we deem appropriate, including immediate account termination without prior notice for severe violations.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              No Liability
            </h2>
            <p>
              We are not responsible for the content, conduct, or actions of users on this platform. You use this service at your own risk and are solely responsible for your interactions with other users.
            </p>
            <p>
              We do not monitor all content in real-time and rely on user reports and automated systems to identify violations. We cannot guarantee that all violations will be detected or prevented.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Changes to This Policy
            </h2>
            <p>
              We may update this Acceptable Use Policy from time to time. We will notify users of significant changes by posting the updated policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the service after changes constitutes acceptance of the updated policy.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#ffd44733] bg-[#0c111c] p-6 text-xs text-[#9aa2c2]">
            <p className="font-medium text-[#ffd447]">
              Important: Violations of this policy may result in immediate account termination and, in severe cases, legal action. Use this platform responsibly and professionally.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

