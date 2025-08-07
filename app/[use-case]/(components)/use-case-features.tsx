import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Calendar, Brain, Workflow, Zap } from "lucide-react";

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
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Built for your specific needs
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {first && (
            <Card className="relative border border-border/60 shadow-lg bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-2xl hover:border-primary/30 transition-colors flex flex-col">
              <BorderBeam size={140} duration={8} delay={0.3} borderWidth={1} className="opacity-25" />
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {(() => { const I = visualMap[first.visual]; return <I className="h-6 w-6 text-primary" aria-hidden="true" />; })()}
                </div>
                <CardTitle className="text-2xl">{first.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-base lg:text-lg">
                <p className="text-muted-foreground leading-relaxed">
                  {first.description}
                </p>
                <Button type="button" className="group px-6 py-5 rounded-full font-semibold bg-white text-black hover:bg-white/90 w-fit">
                  Learn more
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-8">
            {[second, third].filter(Boolean).map((feature, idx) => {
              const VisualIcon = visualMap[(feature as Feature).visual];
              return (
                <Card key={(feature as Feature).id} className="relative border border-border/60 shadow-lg bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-2xl hover:border-primary/30 transition-colors">
                  <BorderBeam size={120} duration={8} delay={(idx + 1) * 0.6} borderWidth={1} className="opacity-25" />
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <VisualIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-xl">{(feature as Feature).title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {(feature as Feature).description}
                    </p>
                    <Button type="button" variant="ghost" className="p-0 h-auto">
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