import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid';
import { features } from '@/constants/features';

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 font-bold text-4xl tracking-tight sm:text-5xl">
          Powerful Features
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Everything you need to build, deploy, and scale your applications with
          confidence.
        </p>
      </div>

      <BentoGrid className="mx-auto max-w-7xl">
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    </section>
  );
}
