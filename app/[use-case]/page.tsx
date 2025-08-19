import { notFound } from 'next/navigation';
import { Footer } from '@/components/landing/footer';
import TopNav from '@/components/landing/top-nav';
import { UseCaseBenefits } from './(components)/use-case-benefits';
import { UseCaseCTA } from './(components)/use-case-cta';
import { UseCaseFAQ } from './(components)/use-case-faq';
import { UseCaseFeatures } from './(components)/use-case-features';
import { UseCaseHero } from './(components)/use-case-hero';
import { UseCaseTestimonials } from './(components)/use-case-testimonials';
import { getUseCase, getUseCaseIds } from './(components)/use-cases';

interface UseCasePageProps {
  params: Promise<{
    'use-case': string;
  }>;
}

export async function generateStaticParams() {
  const useCaseIds = getUseCaseIds();
  return useCaseIds.map((id: string) => ({ 'use-case': id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ 'use-case': string }>;
}) {
  const { 'use-case': useCase } = await params;
  const useCaseData = getUseCase(useCase);

  if (!useCaseData) {
    return {
      title: 'Use Case - OpenCal',
      description: 'Discover how OpenCal can help your specific use case.',
    };
  }

  return {
    title: `${useCaseData.title} - OpenCal`,
    description: useCaseData.description,
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { 'use-case': useCase } = await params;
  const useCaseData = getUseCase(useCase);

  if (!useCaseData) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-foreground">
      <TopNav />
      <main className="bg-background">
        <UseCaseHero
          cta={useCaseData.hero.cta}
          demo={useCaseData.hero.demo}
          description={useCaseData.hero.description}
          subtitle={useCaseData.hero.subtitle}
          title={useCaseData.hero.title}
        />
        <UseCaseBenefits benefits={useCaseData.benefits} />
        <UseCaseFeatures features={useCaseData.features} />
        <UseCaseTestimonials testimonials={useCaseData.testimonials} />
        <UseCaseFAQ faq={useCaseData.faq} />
        <UseCaseCTA
          button={useCaseData.cta.button}
          description={useCaseData.cta.description}
          title={useCaseData.cta.title}
        />
      </main>
      <Footer />
    </div>
  );
}
