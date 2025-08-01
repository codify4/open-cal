import { FeaturesSection } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero';
// import { PricingSection } from '@/components/landing/pricing';
import TopNav from '@/components/landing/top-nav';
// import { FinalCTASection } from '@/components/landing/final-cta';
import { FAQSection } from '@/components/landing/faq';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-foreground">
      <TopNav />
      <main className="bg-background">
        <HeroSection />
        <FeaturesSection />
        {/* <PricingSection /> */}
        <FAQSection />
        {/* <FinalCTASection /> */}
      </main>
      <Footer />
    </div>
  );
}
