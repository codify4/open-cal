'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface UseCaseHeroProps {
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  demo?: {
    type: 'calendar' | 'form' | 'chat';
    props: Record<string, unknown>;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  color: string;
  bgColor: string;
  borderColor: string;
    icon: ReactNode;
}

type CalendarDemoEvent = {
  title: string;
  time: string;
  duration?: number;
  type?: string;
};

type CalendarDemoProps = {
  events?: CalendarDemoEvent[];
};

function isCalendarDemo(
  demo: UseCaseHeroProps["demo"],
): demo is { type: "calendar"; props: CalendarDemoProps } {
  return demo?.type === "calendar";
}

export function UseCaseHero({ title, subtitle, description, cta, demo }: UseCaseHeroProps) {
  const defaultEvents: CalendarDemoEvent[] = [
    { title: "Investor Demo", time: "10:00 AM", duration: 60, type: "meeting" },
    { title: "Customer Call", time: "2:00 PM", duration: 30, type: "sales" },
    { title: "Team Standup", time: "9:00 AM", duration: 15, type: "internal" },
  ];

  const events: CalendarDemoEvent[] = isCalendarDemo(demo) && Array.isArray(demo.props.events)
    ? (demo.props.events as CalendarDemoEvent[])
    : defaultEvents;

  const typeToColor: Record<string, string> = {
    meeting: "bg-blue-500",
    sales: "bg-green-500",
    internal: "bg-purple-500",
    default: "bg-neutral-400",
  } as const;

  return (
    <section className="bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary">{subtitle}</Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
            </div>
            <Button type="button" size="lg" className="group w-fit px-7">
              {cta}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Button>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Zap className="h-4 w-4" aria-hidden="true" />AI-powered</span>
              <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" aria-hidden="true" />Team ready</span>
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />5 min setup</span>
            </div>
          </div>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Your schedule at a glance</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3" aria-label="Example events">
                {events.slice(0, 4).map((event, index) => (
                  <li key={`${event.title}-${index}`} className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className={`h-2.5 w-2.5 rounded-full ${typeToColor[event.type ?? "default"] ?? typeToColor.default}`} aria-hidden="true" />
                      <span className="truncate font-medium">{event.title}</span>
                    </div>
                    <time className="text-sm text-muted-foreground">{event.time}</time>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
} 