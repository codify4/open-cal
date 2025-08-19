import { ShineBorder } from '@/components/magicui/shine-border';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface UseCaseCTAProps {
  title: string;
  description: string;
  button: string;
}

export function UseCaseCTA({ title, description, button }: UseCaseCTAProps) {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-24">
      <div className="container mx-auto px-4">
        <Card className="relative mx-auto max-w-4xl rounded-2xl border border-border/60 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-2xl">
          <ShineBorder
            className="rounded-2xl"
            duration={12}
            shineColor={['#ffffff10', '#99999910', '#ffffff10']}
          />
          <CardContent className="space-y-8 p-12 text-center">
            <div className="space-y-4">
              <Badge variant="secondary">Get Started</Badge>
              <h2 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-3xl text-transparent lg:text-4xl">
                {title}
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
                {description}
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                className="group rounded-full bg-white px-8 py-6 font-semibold text-black hover:bg-white/90"
                size="lg"
                type="button"
              >
                {button}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
