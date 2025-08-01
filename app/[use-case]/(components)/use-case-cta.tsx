import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UseCaseCTAProps {
  title: string;
  description: string;
  button: string;
}

export function UseCaseCTA({ title, description, button }: UseCaseCTAProps) {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="container mx-auto px-4">
        <Card className="border-0 shadow-2xl bg-background max-w-4xl mx-auto">
          <CardContent className="p-12 text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary">Get Started</Badge>
              <h2 className="text-3xl lg:text-4xl font-bold">
                {title}
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8">
                {button}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Schedule a demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 