import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/landing/footer';
import TopNav from '@/components/landing/top-nav';

export const metadata: Metadata = {
  title: 'Terms of Use | OpenCal',
  description:
    'The terms of use for OpenCal, an open-source ai calendar app by OpenCal.',
};

function TermsOfUsePage() {
  return (
    <div className="scrollbar-hide min-h-screen bg-neutral-950 text-foreground">
      <TopNav />
      <main className="bg-background pt-24">
        <div className="container mx-auto px-6 py-16 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-4 font-bold text-4xl text-white">
              OpenCal Terms of Use
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
                By using OpenCal, an open-source calendar app by OpenCal, you
                agree to these Terms of Use. If you disagree, do not use the
                app.
              </p>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  1. Use of Service
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Eligibility:</span>
                    <span>You must be 13+ to use OpenCal.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">License:</span>
                    <span>
                      OpenCal is open-source under MIT License. You may use,
                      modify, and distribute the code per the license.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Account:</span>
                    <span>
                      You're responsible for your account security and activity.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  2. Acceptable Use
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Permitted:</span>
                    <span>
                      Use OpenCal for personal/team scheduling, AI chat, and
                      Google Calendar sync.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Prohibited:</span>
                    <span>
                      No illegal activity, reverse-engineering, or abusing the
                      app (e.g., spamming AI chat).
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  3. Subscription
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Free Tier:</span>
                    <span>
                      Basic features (Google Calendar sync, AI chat,
                      drag-and-drop).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Pro Plan:</span>
                    <span>
                      $20/month or $120/year for advanced AI, team timelines. $1
                      trial available.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Payments:</span>
                    <span>
                      Handled by Lemon Squeezy; subject to their terms.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Cancellation:
                    </span>
                    <span>
                      Cancel anytime via app or Lemon Squeezy. No refunds for
                      partial periods.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  4. Open-Source
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Code:</span>
                    <span>
                      Available on GitHub. Contributions welcome per MIT
                      License.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">No Warranty:</span>
                    <span>
                      Provided "as is." We're not liable for damages from use.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  5. Data and Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  See our{' '}
                  <Link
                    className="text-white transition-colors hover:text-muted-foreground"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>{' '}
                  for data handling details. You own your event data; we don't
                  claim ownership.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  6. Termination
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">By You:</span>
                    <span>Delete your account anytime.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">By Us:</span>
                    <span>
                      We may suspend/terminate accounts for violating these
                      terms.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  7. Liability
                </h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">Limitation:</span>
                    <span>
                      We're not liable for indirect damages (e.g., data loss,
                      lost profits).
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-medium text-white">
                      Open-Source Risks:
                    </span>
                    <span>
                      Use at your own risk; community contributions may affect
                      functionality.
                    </span>
                  </li>
                </ul>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  8. Governing Law
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Governed by applicable law. Disputes resolved via appropriate
                  legal channels.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  9. Changes
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update these terms. Changes posted on{' '}
                  <Link
                    className="text-white transition-colors hover:text-muted-foreground"
                    href="/terms"
                  >
                    OpenCal Terms of Use
                  </Link>{' '}
                  and effective upon next use.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="mb-6 font-semibold text-2xl text-white">
                  10. Contact
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Email{' '}
                  <Link
                    className="text-white transition-colors hover:text-muted-foreground"
                    href="mailto:opencal.oss@gmail.com"
                  >
                    opencal.oss@gmail.com
                  </Link>{' '}
                  for questions.
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

export default TermsOfUsePage;
