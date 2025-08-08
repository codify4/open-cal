import { FeaturesSection } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero';
import { PricingSection } from '@/components/landing/pricing';
import TopNav from '@/components/landing/top-nav';
import { FAQSection } from '@/components/landing/faq';
import { CTASection } from '@/components/landing/cta';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white scrollbar-hide">
      <TopNav />
      <main className="bg-black scrollbar-hide w-full">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
