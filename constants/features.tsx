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
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-primary/10 to-primary/5">
        <CardContent className="flex h-full items-center justify-center p-0">
          <Badge className="text-xs" variant="secondary">
            Events
          </Badge>
        </CardContent>
      </Card>
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
      <Card className="absolute inset-0 border-0 bg-gradient-to-br from-accent/10 to-accent/5">
        <CardContent className="flex h-full items-center justify-center p-0">
          <Button className="text-xs" size="sm" variant="ghost">
            "What's my schedule today?"
          </Button>
        </CardContent>
      </Card>
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
