import {
  CalendarIcon,
  MessageCircleIcon,
  Sparkles,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
import type React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedList } from '@/components/magicui/animated-list';
import { DummyEventCard } from '@/components/ui/dummy-event-card';
import { SimpleChatMessage } from '@/components/ui/simple-chat-message';
import { sampleEvents } from './sample-events';

export interface Feature {
  Icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  cta: string;
  className: string;
  background: React.ReactNode;
}

export const features: Feature[] = [
  {
    Icon: CalendarIcon,
    name: 'Calendar Events',
    description:
      'Create, edit, and manage all your events with a beautiful, intuitive interface.',
    href: '#',
    cta: 'See events',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <div className="absolute inset-0 p-4 pt-16">
        <AnimatedList className="flex flex-col gap-2" delay={800}>
          {sampleEvents.map((event) => (
            <DummyEventCard key={event.id} event={event} minimized className="w-full max-w-[280px]" />
          ))}
        </AnimatedList>
      </div>
    ),
  },
  {
    Icon: UsersIcon,
    name: 'Google Calendar Integration',
    description:
      'Connect and manage multiple calendar accounts in one unified interface.',
    href: '#',
    cta: 'Connect accounts',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-secondary/10 to-secondary/5">
        <CardContent className="flex h-full items-center justify-center p-0">
          <div className="flex gap-1">
            <Badge className="text-xs" variant="outline">
              Gmail
            </Badge>
            <Badge className="text-xs" variant="outline">
              Outlook
            </Badge>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    Icon: Sparkles,
    name: 'Ask AI About Anything in Your Calendar',
    description:
      'Get intelligent insights and answers about your schedule with natural language queries.',
    href: '#',
    cta: 'Ask AI',
    className: 'col-span-3 lg:col-span-1',
    background: (
      <div className="absolute inset-0 p-4 pt-16">
        <AnimatedList className="flex flex-col gap-3" delay={1000}>
          <SimpleChatMessage 
            message="What's my schedule today?" 
            isUser 
            timestamp="2:30 PM"
          />
          <SimpleChatMessage 
            message="You have 3 meetings today: Team Meeting at 10 AM, Lunch with Sarah at 12:30 PM, and Project Review at 2 PM. Would you like me to help you prepare for any of these?" 
            timestamp="2:31 PM"
          />
          <SimpleChatMessage 
            message="Can you reschedule the project review?" 
            isUser 
            timestamp="2:32 PM"
          />
          <SimpleChatMessage 
            message="I found a free slot tomorrow at 3 PM. Should I reschedule the Project Review to tomorrow at 3 PM?" 
            timestamp="2:33 PM"
          />
        </AnimatedList>
      </div>
    ),
  },
  {
    Icon: ZapIcon,
    name: 'Calendar Actions Optimized with AI',
    description:
      'Let AI suggest optimal meeting times, detect conflicts, and automate scheduling tasks.',
    href: '#',
    cta: 'Optimize now',
    className: 'col-span-3 lg:col-span-2',
    background: (
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-muted/10 to-muted/5">
        <CardContent className="flex h-full items-center justify-center p-0">
          <div className="flex items-center gap-2">
            <Badge className="text-xs" variant="default">
              AI
            </Badge>
            <span className="text-muted-foreground text-xs">Optimized</span>
          </div>
        </CardContent>
      </Card>
    ),
  },
];
