export interface UseCase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    demo?: {
      type: 'calendar' | 'form' | 'chat';
      props: Record<string, unknown>;
    };
  };
  benefits: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
  features: Array<{
    id: string;
    title: string;
    description: string;
    visual: 'calendar' | 'ai' | 'integration' | 'workflow';
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
  faq: Array<{
    question: string;
    answer: string;
  }>;
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

export const useCases: Record<string, UseCase> = {
  founders: {
    id: 'founders',
    title: 'For Founders',
    subtitle: 'Scale your startup with intelligent scheduling',
    description: 'Stop losing deals to scheduling delays. Caly helps founders close deals faster with AI‑powered scheduling that adapts to your team and your prospects, and keeps everything in sync with Google Calendar.',
    hero: {
      title: 'Close deals faster with intelligent scheduling',
      subtitle: 'Stop losing deals to scheduling delays',
      description: 'Caly streamlines investor meetings, customer demos, and team coordination with AI that understands your priorities and syncs seamlessly with Google Calendar.',
      cta: 'Get started',
      demo: {
        type: 'calendar',
        props: {
          view: 'week',
          events: [
            { title: 'Investor Demo', time: '10:00 AM', duration: 60, type: 'meeting' },
            { title: 'Customer Call', time: '2:00 PM', duration: 30, type: 'sales' },
            { title: 'Team Standup', time: '9:00 AM', duration: 15, type: 'internal' }
          ]
        }
      }
    },
    benefits: [
      {
        id: 'faster-deals',
        title: 'Close deals faster',
        description: 'Reduce scheduling friction and get meetings booked in minutes, not days.',
        icon: 'zap'
      },
      {
        id: 'team-coordination',
        title: 'Coordinate your team',
        description: 'Easily schedule meetings with multiple team members and external stakeholders.',
        icon: 'users'
      },
      {
        id: 'ai-insights',
        title: 'AI-powered insights',
        description: 'Get intelligent suggestions for optimal meeting times and follow-up scheduling.',
        icon: 'brain'
      }
    ],
    features: [
      {
        id: 'investor-scheduling',
        title: 'Investor Meeting Scheduling',
        description: 'Streamline investor calls with smart time suggestions, buffers, and follow‑ups—always in sync with Google Calendar.',
        visual: 'calendar'
      },
      {
        id: 'customer-demos',
        title: 'Customer Demo Coordination',
        description: 'Quickly schedule product demos with attendee suggestions and clear agendas that reduce back‑and‑forth.',
        visual: 'workflow'
      },
      {
        id: 'team-sync',
        title: 'Team Synchronization',
        description: 'Keep your team aligned with shared availability, time‑zone awareness, and conflict‑free events in Google Calendar.',
        visual: 'integration'
      }
    ],
    testimonials: [
      {
        quote: "Caly cut our scheduling time by 80%. We're closing deals faster than ever.",
        author: "Sarah Chen",
        role: "CEO",
        company: "TechFlow"
      },
      {
        quote: "The AI suggestions are game-changing. It knows when our team and prospects are available.",
        author: "Marcus Rodriguez",
        role: "Founder",
        company: "DataSync"
      }
    ],
    faq: [
      {
        question: "How does Caly help with investor meetings?",
        answer: "Caly automatically finds optimal times for investor calls, sends professional scheduling links, and ensures all stakeholders are available."
      },
      {
        question: "Does Caly work with Google Calendar?",
        answer: "Yes. Caly has a two‑way sync with Google Calendar so meetings, updates, and cancellations are reflected instantly."
      },
      {
        question: "How does the AI help with scheduling?",
        answer: "Our AI learns your team's patterns and suggests optimal meeting times, reducing back-and-forth emails by 90%."
      }
    ],
    cta: {
      title: "Ready to scale your startup?",
      description: "Try Caly and let it handle everything in your calendar for you.",
      button: "Get started"
    }
  },
  developers: {
    id: 'developers',
    title: 'For Developers',
    subtitle: 'Code more, schedule less',
    description: 'Focus on what matters most—building great software. Caly handles scheduling with smart automation and reliable Google Calendar sync.',
    hero: {
      title: 'Code more, schedule less',
      subtitle: 'Developer‑friendly scheduling automation',
      description: 'Caly fits your development routine—from code reviews to client calls—so you can stay in flow while your calendar stays organized.',
      cta: 'Get started',
      demo: {
        type: 'calendar',
        props: {
          view: 'day',
          events: [
            { title: 'Code Review', time: '10:00 AM', duration: 45, type: 'development' },
            { title: 'Client Meeting', time: '2:00 PM', duration: 60, type: 'meeting' },
            { title: 'Sprint Planning', time: '4:00 PM', duration: 90, type: 'planning' }
          ]
        }
      }
    },
    benefits: [
      {
        id: 'focus-coding',
        title: 'Focus on coding',
        description: 'Automate scheduling so you can spend more time writing code and less time managing calendars.',
        icon: 'code'
      },
      {
        id: 'smart-suggestions',
        title: 'Smart time suggestions',
        description: 'Caly recommends review and meeting slots that avoid conflicts and protect focus time.',
        icon: 'brain'
      },
      {
        id: 'workflow-automation',
        title: 'Workflow automation',
        description: 'Use templates, buffers, and defaults to automate routine scheduling tasks—no context switching.',
        icon: 'workflow'
      }
    ],
    features: [
      {
        id: 'code-review-scheduling',
        title: 'Code Review Scheduling',
        description: 'Plan code reviews at low‑interruption times based on your availability and team calendars in Google Calendar.',
        visual: 'workflow'
      },
      {
        id: 'client-meetings',
        title: 'Client Meeting Management',
        description: 'Streamline client calls with clear agendas, time‑zone handling, and instant Google Calendar updates.',
        visual: 'calendar'
      },
      {
        id: 'team-sync',
        title: 'Development Team Sync',
        description: 'Coordinate sprint planning and standups with shared availability and conflict detection in Google Calendar.',
        visual: 'integration'
      }
    ],
    testimonials: [
      {
        quote: "Caly helps me protect focus blocks and schedule reviews without endless back‑and‑forth.",
        author: "Alex Kumar",
        role: "Senior Developer",
        company: "DevFlow"
      },
      {
        quote: "Finally, a calendar that understands developer workflows. No more context switching.",
        author: "Emma Thompson",
        role: "Tech Lead",
        company: "CodeCraft"
      }
    ],
    faq: [
      {
        question: "Does Caly support Google Calendar?",
        answer: "Yes. Caly syncs both ways with Google Calendar so your schedule stays accurate across devices."
      },
      {
        question: "How does it handle different time zones for remote teams?",
        answer: "Caly automatically detects time zones and suggests optimal meeting times for distributed teams."
      },
      {
        question: "Can I customize the scheduling flow for my team?",
        answer: "Yes. Configure templates, default durations, buffers, and availability rules—no code required."
      }
    ],
    cta: {
      title: "Ready to code more?",
      description: "Try Caly and let it handle everything in your calendar for you.",
      button: "Get started"
    }
  },
  productivity: {
    id: 'productivity',
    title: 'For Productivity',
    subtitle: 'Optimize your time with AI-powered scheduling',
    description: 'Take control of your schedule with intelligent time management. Caly helps you optimize your day, reduce context switching, and achieve more—fully synced with Google Calendar.',
    hero: {
      title: 'Optimize your time with AI-powered scheduling',
      subtitle: 'Achieve more with intelligent time management',
      description: 'Caly analyzes your patterns and helps you schedule tasks, meetings, and breaks for maximum productivity—without leaving Google Calendar behind.',
      cta: 'Get started',
      demo: {
        type: 'calendar',
        props: {
          view: 'day',
          events: [
            { title: 'Deep Work Block', time: '9:00 AM', duration: 120, type: 'focus' },
            { title: 'Team Meeting', time: '11:30 AM', duration: 30, type: 'meeting' },
            { title: 'Lunch Break', time: '12:00 PM', duration: 60, type: 'break' },
            { title: 'Client Call', time: '2:00 PM', duration: 45, type: 'meeting' }
          ]
        }
      }
    },
    benefits: [
      {
        id: 'time-optimization',
        title: 'Optimize your time',
        description: 'AI analyzes your patterns and suggests optimal scheduling for maximum productivity.',
        icon: 'clock'
      },
      {
        id: 'focus-blocks',
        title: 'Protect focus time',
        description: 'Automatically block time for deep work and prevent unnecessary interruptions.',
        icon: 'shield'
      },
      {
        id: 'work-life-balance',
        title: 'Work-life balance',
        description: 'Schedule breaks, personal time, and maintain healthy boundaries.',
        icon: 'heart'
      }
    ],
    features: [
      {
        id: 'deep-work-scheduling',
        title: 'Deep Work Scheduling',
        description: 'Automatically block time for focused work and prevent meeting conflicts.',
        visual: 'calendar'
      },
      {
        id: 'smart-breaks',
        title: 'Smart Break Scheduling',
        description: 'AI suggests optimal break times based on your energy levels and schedule.',
        visual: 'ai'
      },
      {
        id: 'productivity-analytics',
        title: 'Productivity Analytics',
        description: 'Track your time usage and get insights to improve your scheduling habits.',
        visual: 'integration'
      }
    ],
    testimonials: [
      {
        quote: "Caly helped me reclaim 3 hours per day by optimizing my schedule.",
        author: "David Park",
        role: "Product Manager",
        company: "InnovateCorp"
      },
      {
        quote: "The AI suggestions are spot-on. I'm more productive than ever.",
        author: "Lisa Chen",
        role: "Consultant",
        company: "StrategyFlow"
      }
    ],
    faq: [
      {
        question: "How does Caly optimize my schedule?",
        answer: "Our AI analyzes your work patterns, energy levels, and priorities to suggest optimal scheduling for maximum productivity."
      },
      {
        question: "Can I set boundaries for work-life balance?",
        answer: "Yes, Caly helps you schedule breaks, personal time, and maintain healthy work-life boundaries."
      },
      {
        question: "Does this work with Google Calendar?",
        answer: "Yes. Caly keeps a two‑way sync with Google Calendar so changes are reflected immediately."
      },
      {
        question: "How does it handle different types of work?",
        answer: "Caly categorizes your work (deep work, meetings, breaks) and optimizes your schedule accordingly."
      }
    ],
    cta: {
      title: "Ready to optimize your time?",
      description: "Try Caly and let it handle everything in your calendar for you.",
      button: "Start optimizing"
    }
  }
};

export const getUseCase = (id: string): UseCase | null => {
  return useCases[id] || null;
};

export const getAllUseCases = (): UseCase[] => {
  return Object.values(useCases);
};

export const getUseCaseIds = (): string[] => {
  return Object.keys(useCases);
}; 