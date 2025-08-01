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
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Features</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Built for your specific needs
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const VisualIcon = visualMap[feature.visual];
            return (
              <Card key={feature.id} className="border-0 shadow-lg bg-background">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <VisualIcon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto">
                    Learn more →
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