import { FeaturesSection } from '@/components/landing/features';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero';
import { PricingSection } from '@/components/landing/pricing';
import TopNav from '@/components/landing/top-nav';
// import { FAQSection } from "@/components/landing/faq"
// import { FinalCTASection } from "@/components/landing/final-cta"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <main className="bg-background">
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        {/* <FAQSection />
        <FinalCTASection /> */}
      </main>
      <Footer />
    </div>
  );
}
