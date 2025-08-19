import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/landing/footer';
import TopNav from '@/components/landing/top-nav';

export const metadata: Metadata = {
  title: 'Privacy Policy | OpenCal',
  description:
    'The privacy policy for OpenCal, an open-source calendar app by OpenCal.',
};

function PrivacyPolicyPage() {
  return (
    <div className="scrollbar-hide min-h-screen bg-neutral-950 text-foreground">
      <TopNav />
      <main className="bg-background pt-24">
        <div className="container mx-auto px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 font-bold text-4xl text-white">
              OpenCal Privacy Policy
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                OpenCal, an open-source calendar app by OpenCal, respects your
                privacy. This Privacy Policy explains how we collect, use, and
                protect your data.
              </p>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  1. Information We Collect
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Account Data:
                    </span>
                    <span>
                      Email, name (optional) for account creation and Google
                      Calendar sync.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Event Data:</span>
                    <span>
                      Event details (title, time, description) synced with
                      Google Calendar or created via AI chat.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Usage Data:</span>
                    <span>
                      App interactions (e.g., clicks, AI queries) for analytics,
                      stored anonymously.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      No Sensitive Data:
                    </span>
                    <span>
                      We don't collect payment info (handled by Lemon Squeezy)
                      or unnecessary personal data.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  2. How We Use Your Data
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Service Delivery:
                    </span>
                    <span>
                      Sync events with Google Calendar, enable AI chat, and
                      manage team timelines (Pro plan).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Improvement:</span>
                    <span>
                      Analyze usage to enhance features, shared anonymously with
                      open-source contributors.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Legal Compliance:
                    </span>
                    <span>Comply with GDPR, CCPA, and other laws.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  3. Data Sharing
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Third Parties:
                    </span>
                    <span>
                      Google Calendar API (OAuth) for sync, Lemon Squeezy for
                      payments. Their privacy policies apply.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Open-Source Community:
                    </span>
                    <span>
                      Anonymized usage data may be shared with contributors for
                      app improvement.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">No Selling:</span>
                    <span>
                      We don't sell or share personal data for advertising.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  4. Data Security
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Encryption:</span>
                    <span>
                      Event data encrypted at rest (Convex DB) and in transit
                      (HTTPS).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Open-Source Transparency:
                    </span>
                    <span>
                      Code is public on GitHub, audited by the community.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Access Control:
                    </span>
                    <span>
                      Only necessary data accessed by our team, with strict
                      internal policies.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  5. Your Rights
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Access/Delete:
                    </span>
                    <span>
                      Request access or deletion of your data via
                      opencal.oss@gmail.com
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Opt-Out:</span>
                    <span>Disable analytics in app settings.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">GDPR/CCPA:</span>
                    <span>
                      Rights to know, delete, or restrict data processing (where
                      applicable).
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  6. Data Retention
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Account Data:
                    </span>
                    <span>
                      Kept until account deletion or 1 year after inactivity.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Event Data:</span>
                    <span>
                      Synced with Google Calendar; local copies deleted upon
                      request.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Usage Data:</span>
                    <span>
                      Anonymized and retained indefinitely for app improvement.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  7. Third-Party Services
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Google Calendar:
                    </span>
                    <span>
                      Uses OAuth; we access only what's needed for sync.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Lemon Squeezy:
                    </span>
                    <span>Handles payments; see their privacy policy.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Convex:</span>
                    <span>Stores event and usage data securely.</span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  8. Changes
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this policy. Changes posted on{' '}
                  <Link
                    className="text-white transition-colors hover:text-muted-foreground"
                    href="/privacy"
                  >
                    OpenCal Privacy Policy
                  </Link>{' '}
                  and effective upon your next app use.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  9. Contact
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Questions? Email{' '}
                  <Link
                    className="text-white transition-colors hover:text-muted-foreground"
                    href="mailto:opencal.oss@gmail.com"
                  >
                    opencal.oss@gmail.com
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicyPage;
