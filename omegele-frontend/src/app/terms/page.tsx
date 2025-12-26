export default function TermsPage() {
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
            Legal Agreement
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[#f8f3e8] sm:text-5xl md:text-6xl mb-6">
            Terms and Conditions
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
              Acceptance of Terms
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              By accessing and using this website, you acknowledge that you have read, understood, 
              and agree to be bound by all terms and conditions contained herein. If you do not 
              agree to these terms, you must not use this website.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              Your use of this website constitutes your acceptance of these terms and conditions. 
              You are using this service at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Eligibility and Age Restrictions
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Minimum Age:</strong> You must be at least 18 years old to use this service. 
              By using this website, you represent and warrant that you are at least 18 years of age 
              and have the legal capacity to enter into these terms.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              If you are under 18, you are not permitted to use this service. We do not knowingly 
              collect information from individuals under 18 years of age. If we become aware that 
              we have collected information from someone under 18, we will take steps to delete 
              such information and terminate the account.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              <strong>Prohibited Users:</strong> You may not use this service if you are prohibited 
              from doing so under applicable laws or if you have been previously banned from the platform.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Purpose of Service
            </h2>
            <p className="text-base text-slate-700 leading-relaxed">
              This website is intended for the purpose of bringing people in the professional industry 
              together. It is designed to facilitate networking, professional connections, and meaningful 
              conversations between individuals in the tech and professional communities.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              User Responsibility and Liability
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              You are solely responsible for your own actions, conduct, and content while using this 
              service. We are not responsible for any wrongdoing, misconduct, or illegal activities 
              conducted by users on this platform.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              If you encounter any inappropriate behavior, harassment, or illegal activity from another 
              user, it is your responsibility to file a complaint or take appropriate legal action 
              against that individual. We are not liable for the actions of third-party users.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              If you engage in any wrongdoing or illegal activity while using this service, you are 
              solely responsible for the consequences of your actions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Recording and Photography
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Unauthorized Recording:</strong> If you take anyone&apos;s picture, video, or 
              audio recording without their explicit permission, the other person has the full right 
              to file a lawsuit against you. Recording or capturing media of another person without 
              consent may violate privacy laws and could result in legal action.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Your Protection:</strong> If anyone takes a picture, video, or recording of 
              you without your permission while using this website, we are not responsible for such 
              actions. While we have implemented security measures and safeguards to the best of our 
              ability, technology does not always work properly, and we cannot guarantee complete 
              protection against unauthorized recording.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              You are responsible for your own safety and privacy. We recommend being cautious about 
              what you share during video sessions and reporting any suspicious behavior immediately.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Technology Limitations
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We have implemented security measures and safeguards to protect users to the best of 
              our ability. However, technology is not infallible and may not always work properly. 
              We cannot guarantee that all security measures will be effective at all times.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              You acknowledge that you are using this service at your own risk and that we are not 
              responsible for any failures, bugs, security breaches, or technical issues that may occur.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Limitation of Liability
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              To the fullest extent permitted by law, we disclaim all liability for any damages, 
              losses, or harm arising from your use of this service, including but not limited to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Actions or conduct of other users</li>
              <li>Unauthorized recording or capture of your image, video, or audio</li>
              <li>Technical failures or security breaches</li>
              <li>Any illegal or inappropriate content shared by users</li>
              <li>Personal injury or property damage</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Account Termination
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We reserve the right to suspend or terminate your account at any time, with or without 
              cause or notice, for any reason including but not limited to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700 mb-3">
              <li>Violation of these Terms and Conditions or our Acceptable Use Policy</li>
              <li>Engaging in illegal activities or activities that harm other users</li>
              <li>Abuse of the platform or its features</li>
              <li>Fraudulent or deceptive behavior</li>
              <li>Repeated violations of community guidelines</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed">
              Upon termination, your right to use the service will immediately cease. We may delete 
              your account and all associated data at our discretion.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Dispute Resolution
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Governing Law:</strong> These terms shall be governed by and construed in 
              accordance with applicable laws, without regard to conflict of law provisions.
            </p>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              <strong>Disputes:</strong> Any disputes arising out of or relating to these terms 
              or the service shall be resolved through:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Good faith negotiation between the parties</li>
              <li>If negotiation fails, through binding arbitration in accordance with applicable arbitration rules</li>
              <li>You waive any right to a jury trial or to participate in a class action lawsuit</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Indemnification
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              You agree to indemnify, defend, and hold harmless Vinamah, its officers, directors, 
              employees, agents, and affiliates from and against any and all claims, damages, 
              obligations, losses, liabilities, costs, or debt, and expenses (including but not 
              limited to attorney&apos;s fees) arising from:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700">
              <li>Your use of the service</li>
              <li>Your violation of these terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you share or transmit through the service</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Service Availability
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We strive to provide continuous access to our service, but we do not guarantee that 
              the service will be available at all times. The service may be unavailable due to:
            </p>
            <ul className="ml-6 list-disc space-y-2 text-base text-slate-700 mb-3">
              <li>Scheduled maintenance or updates</li>
              <li>Technical failures or system errors</li>
              <li>Force majeure events beyond our control</li>
              <li>Security incidents or attacks</li>
            </ul>
            <p className="text-base text-slate-700 leading-relaxed">
              We are not liable for any damages or losses resulting from service unavailability.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-base text-slate-700 leading-relaxed mb-3">
              We reserve the right to modify these terms and conditions at any time. We will notify 
              users of significant changes by posting the updated terms on this page and updating 
              the &quot;Last updated&quot; date. Your continued use of the website after any changes 
              constitutes your acceptance of the modified terms.
            </p>
            <p className="text-base text-slate-700 leading-relaxed">
              If you do not agree to the modified terms, you must stop using the service and may 
              terminate your account.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
