'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Zap, Heart, PenTool, Waves, Activity, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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
  icon: React.ReactNode;
}

export function UseCaseHero({ title, subtitle, description, cta, demo }: UseCaseHeroProps) {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // August 2025
  
  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'running',
      date: 15,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      icon: <Activity className="h-4 w-4 text-green-400" />
    },
    {
      id: '2',
      title: 'meeting',
      date: 18,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      icon: <Users className="h-4 w-4 text-blue-400" />
    },
    {
      id: '3',
      title: 'coding',
      date: 22,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
      icon: <PenTool className="h-4 w-4 text-purple-400" />
    },
    {
      id: '4',
      title: 'routine',
      date: 25,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      icon: <Waves className="h-4 w-4 text-orange-400" />
    }
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
    return calendarEvents.filter(event => event.date === day);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

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
              <Card className="border border-border/50 shadow-2xl bg-gradient-to-br from-neutral-950 to-neutral-900 overflow-hidden">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white text-lg">Your Schedule</h3>
                      <Badge variant="outline" className="text-xs">Live Demo</Badge>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                            className="p-2 hover:bg-neutral-800/50 rounded-lg transition-colors"
                          >
                            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                          </button>
                          <h4 className="text-lg font-semibold text-white min-w-[120px] text-center">
                            {monthName} {year}
                          </h4>
                          <button 
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                            className="p-2 hover:bg-neutral-800/50 rounded-lg transition-colors"
                          >
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <div key={day} className="text-xs text-muted-foreground text-center py-3 font-medium">
                            {day}
                          </div>
                        ))}
                        
                        {days.map((day, index) => (
                          <div
                            key={index}
                            className={`aspect-square p-2 ${
                              day ? 'hover:bg-neutral-800/30 cursor-pointer rounded-lg transition-colors' : ''
                            }`}
                          >
                            {day && (
                              <div className="h-full flex flex-col">
                                <div className="text-sm text-muted-foreground mb-2 font-medium">
                                  {day}
                                </div>
                                <div className="flex-1 space-y-2">
                                  {getEventsForDay(day).map(event => (
                                    <div
                                      key={event.id}
                                      className={`${event.bgColor} ${event.borderColor} border rounded-lg p-3 flex items-center gap-2 shadow-sm`}
                                    >
                                      {event.icon}
                                      <span className={`text-sm font-medium ${event.color} truncate`}>
                                        {event.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
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