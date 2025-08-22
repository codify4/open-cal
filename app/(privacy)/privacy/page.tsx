import TopNav from '@/components/landing/top-nav'
import { Footer } from '@/components/landing/footer'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Privacy Policy | Caly',
    description: 'The privacy policy for Caly, an open-source calendar app by Caly.',
}

function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-neutral-950 text-foreground scrollbar-hide">
            <TopNav />
            <main className="bg-background pt-24">
                <div className="container mx-auto px-6 lg:px-8 py-16">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-4">Caly Privacy Policy</h1>

                        <div className="prose prose-invert max-w-none">
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                                Caly, an open-source calendar app by Caly, respects your privacy. This Privacy Policy explains how we collect, use, and protect your data.
                            </p>
<<<<<<< HEAD
=======

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">1. Information We Collect</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Account Data:</span>
                                        <span>Email, name (optional) for account creation and Google Calendar sync.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Event Data:</span>
                                        <span>Event details (title, time, description) synced with Google Calendar or created via AI chat.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Usage Data:</span>
                                        <span>App interactions (e.g., clicks, AI queries) for analytics, stored anonymously.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">No Sensitive Data:</span>
                                        <span>We don't collect payment info (handled by Lemon Squeezy) or unnecessary personal data.</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">2. How We Use Your Data</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Service Delivery:</span>
                                        <span>Sync events with Google Calendar, enable AI chat, and manage team timelines (Pro plan).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Improvement:</span>
                                        <span>Analyze usage to enhance features, shared anonymously with open-source contributors.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Legal Compliance:</span>
                                        <span>Comply with GDPR, CCPA, and other laws.</span>
                                    </li>
                                </ul>
                            </section>
>>>>>>> 8a7b3164b40070cbbf4cc2ae66afab5970dc7254

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">3. Data Sharing</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Third Parties:</span>
                                        <span>Google Calendar API (OAuth) for sync, Lemon Squeezy for payments. Their privacy policies apply.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Open-Source Community:</span>
                                        <span>Anonymized usage data may be shared with contributors for app improvement.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">No Selling:</span>
                                        <span>We don't sell or share personal data for advertising.</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">4. Data Security</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Encryption:</span>
                                        <span>Event data encrypted at rest (Convex DB) and in transit (HTTPS).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Open-Source Transparency:</span>
                                        <span>Code is public on GitHub, audited by the community.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Access Control:</span>
                                        <span>Only necessary data accessed by our team, with strict internal policies.</span>
                                    </li>
                                </ul>
                            </section>

<<<<<<< HEAD
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
=======
>>>>>>> 8a7b3164b40070cbbf4cc2ae66afab5970dc7254
                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">5. Your Rights</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Access/Delete:</span>
                                        <span>Request access or deletion of your data via Caly.oss@gmail.com</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Opt-Out:</span>
                                        <span>Disable analytics in app settings.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">GDPR/CCPA:</span>
                                        <span>Rights to know, delete, or restrict data processing (where applicable).</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">6. Data Retention</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Account Data:</span>
                                        <span>Kept until account deletion or 1 year after inactivity.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Event Data:</span>
                                        <span>Synced with Google Calendar; local copies deleted upon request.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Usage Data:</span>
                                        <span>Anonymized and retained indefinitely for app improvement.</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">7. Third-Party Services</h2>
                                <ul className="space-y-3 text-muted-foreground">
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Google Calendar:</span>
                                        <span>Uses OAuth; we access only what's needed for sync.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Lemon Squeezy:</span>
                                        <span>Handles payments; see their privacy policy.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-white font-medium">Convex:</span>
                                        <span>Stores event and usage data securely.</span>
                                    </li>
                                </ul>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">8. Changes</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    We may update this policy. Changes posted on{' '}
                                    <Link href="/privacy" className="text-white hover:text-muted-foreground transition-colors">
                                        Caly Privacy Policy
                                    </Link>{' '}
                                    and effective upon your next app use.
                                </p>
                            </section>

                            <section className="mb-12">
                                <h2 className="text-2xl font-semibold text-white mb-6">9. Contact</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Questions? Email{' '}
                                    <Link href="mailto:Caly.oss@gmail.com" className="text-white hover:text-muted-foreground transition-colors">
                                        Caly.oss@gmail.com
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
    )
}

export default PrivacyPolicyPage