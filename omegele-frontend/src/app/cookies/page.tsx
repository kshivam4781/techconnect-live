export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-[#050710] text-[#f8f3e8]">
      <main className="mx-auto max-w-4xl px-4 py-16">
        <section className="space-y-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#9aa2c2]">
            Data & Tracking
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="max-w-2xl text-sm text-[#d3dcec] sm:text-base">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </section>

        <section className="mt-10 space-y-6 text-sm text-[#d3dcec] sm:text-base">
          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              What Are Cookies?
            </h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              How We Use Cookies
            </h2>
            <p>
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li><strong className="text-[#ffd447]">Essential Cookies:</strong> Required for the website to function properly, including authentication, session management, and security features.</li>
              <li><strong className="text-[#ffd447]">Functional Cookies:</strong> Remember your preferences and settings to improve your experience.</li>
              <li><strong className="text-[#ffd447]">Analytics Cookies:</strong> Help us understand how visitors use our website so we can improve it (anonymized data).</li>
              <li><strong className="text-[#ffd447]">Performance Cookies:</strong> Monitor website performance and help us identify issues.</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Types of Cookies We Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Session Cookies</h3>
                <p>
                  Temporary cookies that are deleted when you close your browser. These are essential for maintaining your login session and enabling core functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#f8f3e8] mb-2">Persistent Cookies</h3>
                <p>
                  Cookies that remain on your device for a set period or until you delete them. These help us remember your preferences and improve your experience across visits.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Third-Party Cookies
            </h2>
            <p>
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Authentication providers (LinkedIn, GitHub) for OAuth login</li>
              <li>Analytics services to understand usage patterns</li>
              <li>Content delivery networks for performance optimization</li>
            </ul>
            <p className="mt-4">
              These third parties have their own privacy policies and cookie practices. We are not responsible for their use of cookies.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Managing Cookies
            </h2>
            <p>
              You can control and manage cookies in various ways:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li><strong className="text-[#ffd447]">Browser Settings:</strong> Most browsers allow you to refuse or accept cookies, delete existing cookies, or set preferences for specific websites.</li>
              <li><strong className="text-[#ffd447]">Opt-Out Tools:</strong> You can use browser extensions or opt-out tools provided by third-party services.</li>
              <li><strong className="text-[#ffd447]">Essential Cookies:</strong> Note that disabling essential cookies may prevent the website from functioning properly, including authentication and session management.</li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Local Storage and Similar Technologies
            </h2>
            <p>
              In addition to cookies, we may use other local storage technologies such as:
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>LocalStorage for storing preferences and settings</li>
              <li>SessionStorage for temporary session data</li>
              <li>IndexedDB for client-side data storage</li>
            </ul>
            <p className="mt-4">
              These technologies are used to improve functionality and user experience. You can clear this data through your browser settings.
            </p>
          </div>

          <div className="space-y-4 rounded-2xl border border-[#272f45] bg-[#0c111c] p-6">
            <h2 className="text-lg font-semibold text-[#f8f3e8]">
              Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#ffd44733] bg-[#0c111c] p-6 text-xs text-[#9aa2c2]">
            <p className="font-medium text-[#ffd447]">
              Note: By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree, please adjust your browser settings or discontinue use of the website.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

