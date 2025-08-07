import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShineBorder } from "@/components/magicui/shine-border";

interface UseCaseCTAProps {
  title: string;
  description: string;
  button: string;
}

export function UseCaseCTA({ title, description, button }: UseCaseCTAProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <Card className="relative border border-border/60 shadow-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 max-w-4xl mx-auto rounded-2xl">
          <ShineBorder className="rounded-2xl" duration={12} shineColor={["#ffffff10","#99999910","#ffffff10"]} />
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary">Get Started</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
                {title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button type="button" size="lg" className="group px-8 py-6 rounded-full font-semibold bg-white text-black hover:bg-white/90">
                {button}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 