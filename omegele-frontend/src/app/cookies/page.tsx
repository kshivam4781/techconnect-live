export default function CookiesPage() {
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
            Data & Tracking
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            Cookie Policy
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
              What Are Cookies?
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              Cookies are small text files that are placed on your device when you visit a website. 
              They are widely used to make websites work more efficiently and provide information 
              to website owners.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              How We Use Cookies
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication, session management, and security features.</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings to improve your experience.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website so we can improve it (anonymized data).</li>
              <li><strong>Performance Cookies:</strong> Monitor website performance and help us identify issues.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Types of Cookies We Use
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Session Cookies</h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  Temporary cookies that are deleted when you close your browser. These are essential 
                  for maintaining your login session and enabling core functionality.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Persistent Cookies</h3>
                <p className="text-base text-slate-700 leading-relaxed">
                  Cookies that remain on your device for a set period or until you delete them. 
                  These help us remember your preferences and improve your experience across visits.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Third-Party Cookies
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700 mb-3">
              <li>Authentication providers (LinkedIn, GitHub) for OAuth login</li>
              <li>Analytics services to understand usage patterns</li>
              <li>Content delivery networks for performance optimization</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed">
              These third parties have their own privacy policies and cookie practices. We are not 
              responsible for their use of cookies.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Managing Cookies
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              You can control and manage cookies in various ways:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies, delete existing cookies, or set preferences for specific websites.</li>
              <li><strong>Opt-Out Tools:</strong> You can use browser extensions or opt-out tools provided by third-party services.</li>
              <li><strong>Essential Cookies:</strong> Note that disabling essential cookies may prevent the website from functioning properly, including authentication and session management.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Local Storage and Similar Technologies
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              In addition to cookies, we may use other local storage technologies such as:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700 mb-3">
              <li>LocalStorage for storing preferences and settings</li>
              <li>SessionStorage for temporary session data</li>
              <li>IndexedDB for client-side data storage</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed">
              These technologies are used to improve functionality and user experience. You can 
              clear this data through your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any changes 
              by posting the new policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
