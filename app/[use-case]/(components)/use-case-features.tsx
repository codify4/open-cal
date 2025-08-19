import { Brain, Calendar, Workflow, Zap } from 'lucide-react';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Feature {
  id: string;
  title: string;
  description: string;
  visual: 'calendar' | 'ai' | 'integration' | 'workflow';
}

interface UseCaseFeaturesProps {
  features: Feature[];
}

const visualMap = {
  calendar: Calendar,
  ai: Brain,
  integration: Workflow,
  workflow: Zap,
};

export function UseCaseFeatures({ features }: UseCaseFeaturesProps) {
  // Two-column mosaic: left column has a tall feature, right column stacks two
  const [first, second, third] = features;
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 space-y-4 text-center">
          <Badge variant="secondary">Features</Badge>
          <h2 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-3xl text-transparent lg:text-4xl">
            Built for your specific needs
          </h2>
        </div>

        <div className="grid items-stretch gap-8 lg:grid-cols-2">
          {first && (
            <Card className="relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg transition-colors hover:border-primary/30">
              <BorderBeam
                borderWidth={1}
                className="opacity-25"
                delay={0.3}
                duration={8}
                size={140}
              />
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  {(() => {
                    const I = visualMap[first.visual];
                    return (
                      <I aria-hidden="true" className="h-6 w-6 text-primary" />
                    );
                  })()}
                </div>
                <CardTitle className="text-2xl">{first.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base lg:text-lg">
                <p className="text-muted-foreground leading-relaxed">
                  {first.description}
                </p>
                <Button
                  className="group w-fit rounded-full bg-white px-6 py-5 font-semibold text-black hover:bg-white/90"
                  type="button"
                >
                  Learn more
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8">
            {[second, third].filter(Boolean).map((feature, idx) => {
              const VisualIcon = visualMap[(feature as Feature).visual];
              return (
                <Card
                  className="relative rounded-2xl border border-border/60 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg transition-colors hover:border-primary/30"
                  key={(feature as Feature).id}
                >
                  <BorderBeam
                    borderWidth={1}
                    className="opacity-25"
                    delay={(idx + 1) * 0.6}
                    duration={8}
                    size={120}
                  />
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <VisualIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-primary"
                      />
                    </div>
                    <CardTitle className="text-xl">
                      {(feature as Feature).title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {(feature as Feature).description}
                    </p>
                    <Button
                      className="h-auto p-0"
                      type="button"
                      variant="ghost"
                    >
                      Learn more →
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
