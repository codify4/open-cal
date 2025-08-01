import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

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
  zap: require("lucide-react").Zap,
  users: require("lucide-react").Users,
  brain: require("lucide-react").Brain,
  code: require("lucide-react").Code,
  api: require("lucide-react").Api,
  workflow: require("lucide-react").Workflow,
  clock: require("lucide-react").Clock,
  shield: require("lucide-react").Shield,
  heart: require("lucide-react").Heart,
};

export function UseCaseBenefits({ benefits }: UseCaseBenefitsProps) {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="secondary">Key Benefits</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold">
            Why choose OpenCal for your needs?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Card key={benefit.id} className="border-0 shadow-lg bg-background">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {Icon && <Icon className="h-6 w-6 text-primary" />}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
} 