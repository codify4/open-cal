'use client';

import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  PenTool,
  Users,
  Waves,
  Zap,
} from 'lucide-react';
import { type KeyboardEvent, type ReactNode, useState } from 'react';
import { AnimatedShinyText } from '@/components/magicui/animated-shiny-text';
import { BorderBeam } from '@/components/magicui/border-beam';
import { ShineBorder } from '@/components/magicui/shine-border';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: ReactNode;
}

export function UseCaseHero({
  title,
  subtitle,
  description,
  cta,
  demo,
}: UseCaseHeroProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025

  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'running',
      date: 15,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: <Activity className="h-4 w-4 text-green-400" />,
    },
    {
      id: '2',
      title: 'meeting',
      date: 18,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      icon: <Users className="h-4 w-4 text-blue-400" />,
    },
    {
      id: '3',
      title: 'coding',
      date: 22,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      icon: <PenTool className="h-4 w-4 text-purple-400" />,
    },
    {
      id: '4',
      title: 'routine',
      date: 25,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      icon: <Waves className="h-4 w-4 text-orange-400" />,
    },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const getEventsForDay = (day: number) => {
    return calendarEvents.filter((event) => event.date === day);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();
  const now = new Date();
  const isSameMonthAsNow =
    now.getFullYear() === year && now.getMonth() === currentDate.getMonth();
  const todayDate = isSameMonthAsNow ? now.getDate() : null;

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const goToPrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const onNavKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    direction: 'prev' | 'next'
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (direction === 'prev') goToPrevMonth();
      else goToNextMonth();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="text-sm" variant="secondary">
                <AnimatedShinyText shimmerWidth={140}>
                  {subtitle}
                </AnimatedShinyText>
              </Badge>
              <h1 className="bg-gradient-to-b from-white to-neutral-400 bg-clip-text font-bold text-4xl text-transparent tracking-tight lg:text-6xl">
                {title}
              </h1>
              <p className="max-w-2xl text-muted-foreground text-xl">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                className="group rounded-full bg-white px-8 py-6 font-semibold text-black hover:bg-white/90"
                size="lg"
                type="button"
              >
                {cta}
                <ArrowRight
                  aria-hidden="true"
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                />
              </Button>
            </div>

            <div className="flex items-center gap-8 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <Zap aria-hidden="true" className="h-4 w-4" />
                <span>AI-powered</span>
              </div>
              <div className="flex items-center gap-2">
                <Users aria-hidden="true" className="h-4 w-4" />
                <span>Team ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock aria-hidden="true" className="h-4 w-4" />
                <span>5 min setup</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {demo?.type === 'calendar' && (
              <Card className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-neutral-950 to-neutral-900/90 shadow-2xl backdrop-blur">
                <ShineBorder
                  borderWidth={1}
                  className="rounded-2xl"
                  duration={12}
                  shineColor={['#ffffff10', '#99999910', '#ffffff10']}
                />
                <BorderBeam
                  borderWidth={1}
                  className="opacity-20"
                  delay={2}
                  duration={10}
                  size={140}
                />
                <CardContent className="relative p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'radial-gradient(1200px 500px at -10% -10%, rgba(255,255,255,0.05), transparent 60%), radial-gradient(800px 300px at 110% 110%, rgba(255,255,255,0.04), transparent 60%)',
                      maskImage:
                        'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    }}
                  />
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-white">
                        Your Schedule
                      </h3>
                      <Badge className="text-xs" variant="outline">
                        Live Demo
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-2 rounded-full bg-neutral-900/70 px-2 py-1 shadow-black/30 shadow-inner">
                          <button
                            aria-label="Previous month"
                            className="rounded-full p-2 transition-colors hover:bg-neutral-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            onClick={goToPrevMonth}
                            onKeyDown={(e) => onNavKeyDown(e, 'prev')}
                            type="button"
                          >
                            <ChevronLeft
                              aria-hidden="true"
                              className="h-5 w-5 text-muted-foreground"
                            />
                          </button>
                          <h4 className="min-w-[140px] text-center font-semibold text-base text-white sm:text-lg">
                            {monthName} {year}
                          </h4>
                          <button
                            aria-label="Next month"
                            className="rounded-full p-2 transition-colors hover:bg-neutral-800/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            onClick={goToNextMonth}
                            onKeyDown={(e) => onNavKeyDown(e, 'next')}
                            type="button"
                          >
                            <ChevronRight
                              aria-hidden="true"
                              className="h-5 w-5 text-muted-foreground"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 sm:gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                          (day, i) => (
                            <div
                              className={`py-2 text-center font-medium text-muted-foreground text-xs sm:py-3 ${i === 0 || i === 6 ? 'opacity-70' : ''}`}
                              key={day}
                            >
                              {day}
                            </div>
                          )
                        )}

                        {days.map((day, index) => {
                          const isToday = todayDate && day === todayDate;
                          const hasEvents = day
                            ? getEventsForDay(day).length > 0
                            : false;
                          return (
                            <div
                              className={'aspect-square p-1.5 sm:p-2'}
                              key={index}
                            >
                              {day ? (
                                <div
                                  className={`flex h-full flex-col rounded-xl border ${
                                    isToday
                                      ? 'border-primary/40 bg-primary/5'
                                      : 'border-white/5 bg-white/5'
                                  } backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10`}
                                >
                                  <div
                                    className={`text-[11px] sm:text-xs ${isToday ? 'text-white' : 'text-muted-foreground'} mb-1 px-2 pt-2 font-medium sm:mb-2`}
                                  >
                                    {day}
                                  </div>
                                  <div className="flex-1 space-y-1.5 px-2 pb-2 sm:space-y-2">
                                    {hasEvents ? (
                                      getEventsForDay(day).map((event) => (
                                        <div
                                          className={`${event.bgColor} ${event.borderColor} flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md sm:px-3 sm:py-2`}
                                          key={event.id}
                                          title={event.title}
                                        >
                                          {event.icon}
                                          <span
                                            className={`font-medium text-[11px] sm:text-sm ${event.color} truncate`}
                                          >
                                            {event.title}
                                          </span>
                                        </div>
                                      ))
                                    ) : (
                                      <div
                                        aria-hidden="true"
                                        className="h-full w-full rounded-md border border-white/5 border-dashed"
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  aria-hidden="true"
                                  className="h-full w-full rounded-xl bg-white/[0.02]"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2 text-muted-foreground text-xs">
                        {[
                          {
                            label: 'running',
                            color: 'text-green-400',
                            ring: 'ring-green-500/30',
                            bg: 'bg-green-500/10',
                          },
                          {
                            label: 'meeting',
                            color: 'text-blue-400',
                            ring: 'ring-blue-500/30',
                            bg: 'bg-blue-500/10',
                          },
                          {
                            label: 'coding',
                            color: 'text-purple-400',
                            ring: 'ring-purple-500/30',
                            bg: 'bg-purple-500/10',
                          },
                          {
                            label: 'routine',
                            color: 'text-orange-400',
                            ring: 'ring-orange-500/30',
                            bg: 'bg-orange-500/10',
                          },
                        ].map((l) => (
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${l.bg} ring-1 ${l.ring}`}
                            key={l.label}
                          >
                            <span
                              aria-hidden="true"
                              className={`h-1.5 w-1.5 rounded-full ${l.color.replace('text-', 'bg-')}`}
                            />
                            <span className={l.color}>{l.label}</span>
                          </span>
                        ))}
                      </div>
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
