export default function PrivacyPage() {
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
            Your Privacy Matters
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            Privacy Policy
          </h1>
          <p className="max-w-2xl mx-auto text-base text-[#d3dcec]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Acceptance of Privacy Policy
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              By accessing and using this website, you acknowledge that you have read, understood, 
              and agree to this privacy policy. If you do not agree with this policy, you must not 
              use this website.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              Your use of this website constitutes your acceptance of this privacy policy. You are 
              using this service at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We collect information necessary to provide our service, including:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Authentication data from LinkedIn and GitHub (when you sign in)</li>
              <li>Profile information you provide</li>
              <li>Session data and matching preferences</li>
              <li>Usage data to improve our service</li>
              <li>Reports and flags submitted by users</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mt-4">
              We collect only what is necessary to operate the platform and ensure user safety.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              Your information is used to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Facilitate matching and connections between users</li>
              <li>Maintain account security and prevent abuse</li>
              <li>Improve our matching algorithms and service quality</li>
              <li>Respond to reports and enforce community guidelines</li>
              <li>Provide customer support when needed</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Video and Audio Privacy
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Important Notice:</strong> During video sessions, your video and audio are 
              transmitted directly between you and the matched user. We do not record or store 
              video or audio content from your sessions.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              However, we cannot control or prevent other users from recording, capturing screenshots, 
              or otherwise saving your video or audio without your permission. While we have 
              implemented security measures to the best of our ability, technology does not always 
              work properly, and we cannot guarantee complete protection against unauthorized recording.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Your Responsibility:</strong> You are responsible for your own privacy and 
              safety during video sessions. We are not responsible if another user records, 
              screenshots, or captures your image, video, or audio without your consent.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              If someone records you without permission, you have the right to take legal action 
              against that individual. We are not liable for such unauthorized recordings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Data Sharing and Third Parties
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share limited information with:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Service providers who help us operate the platform (hosting, authentication, etc.)</li>
              <li>Law enforcement if required by law or to prevent harm</li>
              <li>Other users only as necessary for the matching and connection features</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Security Measures
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We have implemented security measures and safeguards to protect your data to the best 
              of our ability. However, no system is completely secure, and technology does not always 
              work properly.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              We cannot guarantee that your data will be completely secure at all times. You 
              acknowledge that you are using this service at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Your Rights
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Access the information we have about you</li>
              <li>Request corrections to your information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of certain data collection where possible</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mt-4">
              To exercise these rights, please contact us through the feedback or support channels 
              available on the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              To the fullest extent permitted by law, we disclaim all liability for:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Unauthorized recording or capture of your image, video, or audio by other users</li>
              <li>Data breaches or security incidents</li>
              <li>Technical failures or system errors</li>
              <li>Any misuse of your information by third parties</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed mt-4">
              You are responsible for your own privacy and safety while using this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Changes to Privacy Policy
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              We reserve the right to modify this privacy policy at any time. Your continued use 
              of the website after any changes constitutes your acceptance of the modified policy.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
