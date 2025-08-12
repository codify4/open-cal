import { notFound } from "next/navigation";
import TopNav from "@/components/landing/top-nav";
import { Footer } from "@/components/landing/footer";
import { UseCaseHero } from "./(components)/use-case-hero";
import { UseCaseBenefits } from "./(components)/use-case-benefits";
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
      alternates: {
        canonical: 'https://www.trycaly.cc/',
      },
      openGraph: {
        images: '/og-img.png',
        title: 'Use Case - Caly',
        description: 'Discover how Caly can help your specific use case.',
        url: 'https://www.trycaly.cc/',
        siteName: 'Caly',
        locale: 'en_US',
        type: 'website',
      },
    };
  }
  
  return {
    title: `${useCaseData.title} - Caly`,
    description: useCaseData.description,
    alternates: {
      canonical: `https://www.trycaly.cc/${useCase}`,
    },
    openGraph: {
      images: '/og-img.png',
      title: `${useCaseData.title} - Caly`,
      description: useCaseData.description,
      url: `https://www.trycaly.cc/${useCase}`,
      siteName: 'Caly',
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${useCaseData.title} - Caly`,
      description: useCaseData.description,
      images: '/og-img.png',
    },
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { "use-case": useCase } = await params;
  const useCaseData = getUseCase(useCase);
  
  if (!useCaseData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-foreground scrollbar-hide">
      <TopNav />
      <main className="bg-background">
        <UseCaseHero
          title={useCaseData.hero.title}
          subtitle={useCaseData.hero.subtitle}
          description={useCaseData.hero.description}
          cta={useCaseData.hero.cta}
          demo={useCaseData.hero.demo}
          icon={useCaseData.icon}
        />
        <UseCaseBenefits benefits={useCaseData.benefits} />
        {/* <UseCaseFeatures features={useCaseData.features} /> */}
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