import type { LucideIcon } from 'lucide-react';
import { ShineBorder } from '@/components/magicui/shine-border';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface UseCaseBenefitsProps {
  benefits: Benefit[];
}

const iconMap: Record<string, LucideIcon> = {
  zap: require('lucide-react').Zap,
  users: require('lucide-react').Users,
  brain: require('lucide-react').Brain,
  code: require('lucide-react').Code,
  api: require('lucide-react').Api,
  workflow: require('lucide-react').Workflow,
  clock: require('lucide-react').Clock,
  shield: require('lucide-react').Shield,
  heart: require('lucide-react').Heart,
};

export function UseCaseBenefits({ benefits }: UseCaseBenefitsProps) {
  return (
    <section className="bg-muted/30 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="secondary">Key Benefits</Badge>
          <h2 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-3xl text-transparent lg:text-4xl">
            Why choose OpenCal for your needs?
          </h2>
        </div>

        {/* Alternating split layout: icon+title left, description right on md+ */}
        <div className="flex flex-col gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Card
                className="group relative rounded-2xl border border-border/60 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg transition-colors hover:border-primary/30"
                key={benefit.id}
              >
                <ShineBorder
                  className="rounded-2xl"
                  duration={14}
                  shineColor={['#ffffff0a', '#9999990a', '#ffffff0a']}
                />
                <div
                  className={`grid items-center gap-4 p-6 md:grid-cols-3 md:p-8 ${idx % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
                >
                  <div className="flex items-center gap-4 [direction:ltr] md:col-span-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          className="h-6 w-6 text-primary"
                        />
                      )}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                  <CardContent className="p-0 [direction:ltr] md:col-span-2">
                    <p className="text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
