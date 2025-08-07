import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShineBorder } from "@/components/magicui/shine-border";
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
          <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            Why choose OpenCal for your needs?
          </h2>
        </div>

        {/* Alternating split layout: icon+title left, description right on md+ */}
        <div className="flex flex-col gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Card key={benefit.id} className="group relative border border-border/60 shadow-lg bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-2xl hover:border-primary/30 transition-colors">
                <ShineBorder className="rounded-2xl" duration={14} shineColor={["#ffffff0a","#9999990a","#ffffff0a"]} />
                <div className={`grid md:grid-cols-3 gap-4 items-center p-6 md:p-8 ${idx % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
                  <div className="flex items-center gap-4 md:col-span-1 [direction:ltr]">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      {Icon && <Icon className="h-6 w-6 text-primary" aria-hidden="true" />}
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </div>
                  <CardContent className="md:col-span-2 [direction:ltr] p-0">
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