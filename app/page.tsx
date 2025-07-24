import TopNav from "@/components/landing/top-nav"
import { HeroSection } from "@/components/landing/hero"
// import { FeaturesSection } from "@/components/landing/features"
// import { PricingSection } from "@/components/landing/pricing"
// import { FAQSection } from "@/components/landing/faq"
// import { FinalCTASection } from "@/components/landing/final-cta"
// import { Footer } from "@/components/landing/footer"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <TopNav />
            <main className="bg-background">
                <HeroSection />
                {/* <FeaturesSection />
                <PricingSection />
                <FAQSection />
                <FinalCTASection /> */}
                <div className="h-[1000px]"></div>
            </main>
            {/* <Footer /> */}
        </div>
    )
}