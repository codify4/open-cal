import { notFound } from "next/navigation";
import TopNav from "@/components/landing/top-nav";
import { Footer } from "@/components/landing/footer";
import { UseCaseHero } from "./(components)/use-case-hero";
import { UseCaseBenefits } from "./(components)/use-case-benefits";
import { UseCaseFeatures } from "./(components)/use-case-features";
import { UseCaseTestimonials } from "./(components)/use-case-testimonials";
import { UseCaseFAQ } from "./(components)/use-case-faq";
import { UseCaseCTA } from "./(components)/use-case-cta";
import { getUseCase, getUseCaseIds } from "./(components)/use-cases";

interface UseCasePageProps {
  params: Promise<{
    "use-case": string;
  }>;
}

export async function generateStaticParams() {
  const useCaseIds = getUseCaseIds();
  return useCaseIds.map((id: string) => ({ "use-case": id }));
}
  
export async function generateMetadata({ params }: { params: Promise<{ "use-case": string }> }) {
  const { "use-case": useCase } = await params;
  const useCaseData = getUseCase(useCase);
  
  if (!useCaseData) {
    return {
      title: "Use Case - Caly",
      description: "Discover how Caly can help your specific use case.",
    };
  }
  
  return {
    title: `${useCaseData.title} - Caly`,
    description: useCaseData.description,
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { "use-case": useCase } = await params;
  const useCaseData = getUseCase(useCase);
  
  if (!useCaseData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-foreground">
      <TopNav />
      <main className="bg-background">
        <UseCaseHero
          title={useCaseData.hero.title}
          subtitle={useCaseData.hero.subtitle}
          description={useCaseData.hero.description}
          cta={useCaseData.hero.cta}
          demo={useCaseData.hero.demo}
        />
        <UseCaseBenefits benefits={useCaseData.benefits} />
        <UseCaseFeatures features={useCaseData.features} />
        {/* <UseCaseTestimonials testimonials={useCaseData.testimonials} /> */}
        <UseCaseFAQ faq={useCaseData.faq} />
        <UseCaseCTA
          title={useCaseData.cta.title}
          description={useCaseData.cta.description}
          button={useCaseData.cta.button}
        />
      </main>
      <Footer />
    </div>
  );
}