import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LucideIcon } from "lucide-react";

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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 space-y-3 text-center">
          <Badge variant="secondary">Key Benefits</Badge>
          <h2 className="text-3xl font-bold lg:text-4xl">Why choose OpenCal?</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Clear advantages you can explain to your team and customers.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Card key={benefit.id} className="border-border/60">
                <CardHeader className="flex-row items-center gap-3 space-y-0">
                  <div className="grid h-10 w-10 place-items-center rounded-md bg-primary/10">
                    {Icon && <Icon className="h-5 w-5 text-primary" aria-hidden="true" />}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
} 