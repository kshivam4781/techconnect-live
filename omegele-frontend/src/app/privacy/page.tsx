export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            Your Privacy Matters
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        <section className="mt-10 space-y-6 text-sm text-[#d3dcec] sm:text-base">
          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Acceptance of Privacy Policy
            </h2>
            <p>
              By accessing and using this website, you acknowledge that you have read, understood, and agree to this privacy policy. If you do not agree with this policy, you must not use this website.
            </p>
            <p>
              Your use of this website constitutes your acceptance of this privacy policy. You are using this service at your own risk.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Information We Collect
            </h2>
            <p>
              We collect information necessary to provide our service, including:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Authentication data from LinkedIn and GitHub (when you sign in)</li>
              <li>Profile information you provide</li>
              <li>Session data and matching preferences</li>
              <li>Usage data to improve our service</li>
              <li>Reports and flags submitted by users</li>
            </ul>
            <p className="mt-4">
              We collect only what is necessary to operate the platform and ensure user safety.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              How We Use Your Information
            </h2>
            <p>
              Your information is used to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Facilitate matching and connections between users</li>
              <li>Maintain account security and prevent abuse</li>
              <li>Improve our matching algorithms and service quality</li>
              <li>Respond to reports and enforce community guidelines</li>
              <li>Provide customer support when needed</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Video and Audio Privacy
            </h2>
            <p>
              <strong className="text-[#ffd447]">Important Notice:</strong> During video sessions, your video and audio are transmitted directly between you and the matched user. We do not record or store video or audio content from your sessions.
            </p>
            <p>
              However, we cannot control or prevent other users from recording, capturing screenshots, or otherwise saving your video or audio without your permission. While we have implemented security measures to the best of our ability, technology does not always work properly, and we cannot guarantee complete protection against unauthorized recording.
            </p>
            <p>
              <strong className="text-[#ffd447]">Your Responsibility:</strong> You are responsible for your own privacy and safety during video sessions. We are not responsible if another user records, screenshots, or captures your image, video, or audio without your consent.
            </p>
            <p>
              If someone records you without permission, you have the right to take legal action against that individual. We are not liable for such unauthorized recordings.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Data Sharing and Third Parties
            </h2>
            <p>
              We do not sell your personal information. We may share limited information with:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Service providers who help us operate the platform (hosting, authentication, etc.)</li>
              <li>Law enforcement if required by law or to prevent harm</li>
              <li>Other users only as necessary for the matching and connection features</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Security Measures
            </h2>
            <p>
              We have implemented security measures and safeguards to protect your data to the best of our ability. However, no system is completely secure, and technology does not always work properly.
            </p>
            <p>
              We cannot guarantee that your data will be completely secure at all times. You acknowledge that you are using this service at your own risk.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Your Rights
            </h2>
            <p>
              You have the right to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Access the information we have about you</li>
              <li>Request corrections to your information</li>
              <li>Request deletion of your account and data</li>
              <li>Opt out of certain data collection where possible</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us through the feedback or support channels available on the platform.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, we disclaim all liability for:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Unauthorized recording or capture of your image, video, or audio by other users</li>
              <li>Data breaches or security incidents</li>
              <li>Technical failures or system errors</li>
              <li>Any misuse of your information by third parties</li>
            </ul>
            <p className="mt-4">
              You are responsible for your own privacy and safety while using this service.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Changes to Privacy Policy
            </h2>
            <p>
              We reserve the right to modify this privacy policy at any time. Your continued use of the website after any changes constitutes your acceptance of the modified policy.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#ffd44733] bg-[#0c111c] p-6 text-xs text-[#9aa2c2]">
            <p className="font-medium text-[#ffd447]">
              Important: By using this service, you acknowledge that you have read and understood this privacy policy and agree to use this website at your own risk. We are not responsible for unauthorized recording or capture of your content by other users.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

