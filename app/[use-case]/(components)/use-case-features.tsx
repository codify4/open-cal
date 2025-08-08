import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 space-y-3 text-center">
          <Badge variant="secondary">Features</Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">Built for your specific needs</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Practical capabilities you can use immediately.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = visualMap[feature.visual];
            return (
              <Card key={feature.id} className="border-border/60 h-full">
                <CardHeader>
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{feature.description}</p>
                  <Button type="button" variant="outline" className="h-9 w-fit px-4">
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
} 