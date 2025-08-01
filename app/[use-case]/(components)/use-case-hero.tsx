import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap } from "lucide-react";

interface UseCaseHeroProps {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  demo?: {
    type: 'calendar' | 'form' | 'chat';
    props: Record<string, any>;
  };
}

export function UseCaseHero({ title, subtitle, description, cta, demo }: UseCaseHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="text-sm">
                {subtitle}
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                {description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                {cta}
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Watch demo
              </Button>
            </div>

            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Team ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>5 min setup</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {demo?.type === 'calendar' && (
              <Card className="border-2 shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Your Schedule</h3>
                      <Badge variant="outline">Live Demo</Badge>
                    </div>
                    <Calendar
                      mode="single"
                      className="rounded-md border"
                      disabled={(date) => date < new Date()}
                    />
                    <div className="space-y-2">
                      {demo.props.events?.map((event: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-sm font-medium">{event.title}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {event.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 