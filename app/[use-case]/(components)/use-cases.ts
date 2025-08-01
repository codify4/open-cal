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
      props: Record<string, any>;
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
    description: 'Stop losing deals to scheduling delays. OpenCal helps founders close deals faster with AI-powered scheduling that adapts to your team and your prospects.',
    hero: {
      title: 'Close deals faster with intelligent scheduling',
      subtitle: 'Stop losing deals to scheduling delays',
      description: 'OpenCal helps founders streamline investor meetings, customer demos, and team coordination with AI that understands your priorities.',
      cta: 'Start closing deals',
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
        description: 'Streamline investor calls with automated scheduling and follow-up reminders.',
        visual: 'calendar'
      },
      {
        id: 'customer-demos',
        title: 'Customer Demo Coordination',
        description: 'Schedule product demos with prospects and automatically include relevant team members.',
        visual: 'workflow'
      },
      {
        id: 'team-sync',
        title: 'Team Synchronization',
        description: 'Keep your entire team in sync with shared calendars and availability tracking.',
        visual: 'integration'
      }
    ],
    testimonials: [
      {
        quote: "OpenCal cut our scheduling time by 80%. We're closing deals faster than ever.",
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
        question: "How does OpenCal help with investor meetings?",
        answer: "OpenCal automatically finds optimal times for investor calls, sends professional scheduling links, and ensures all stakeholders are available."
      },
      {
        question: "Can I integrate with my existing CRM?",
        answer: "Yes, OpenCal integrates with popular CRMs like Salesforce and HubSpot to keep your deal pipeline updated."
      },
      {
        question: "How does the AI help with scheduling?",
        answer: "Our AI learns your team's patterns and suggests optimal meeting times, reducing back-and-forth emails by 90%."
      }
    ],
    cta: {
      title: "Ready to scale your startup?",
      description: "Join thousands of founders using OpenCal to close deals faster.",
      button: "Start free trial"
    }
  },
  developers: {
    id: 'developers',
    title: 'For Developers',
    subtitle: 'Code more, schedule less',
    description: 'Focus on what matters most - building great software. OpenCal handles all your scheduling needs with developer-friendly integrations and automation.',
    hero: {
      title: 'Code more, schedule less',
      subtitle: 'Developer-friendly scheduling automation',
      description: 'OpenCal integrates with your development workflow, from code reviews to client meetings, so you can focus on building amazing software.',
      cta: 'Start coding more',
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
        id: 'api-integration',
        title: 'API-first approach',
        description: 'Integrate OpenCal into your apps with our comprehensive API and webhooks.',
        icon: 'api'
      },
      {
        id: 'workflow-automation',
        title: 'Workflow automation',
        description: 'Connect scheduling to your development tools and automate routine tasks.',
        icon: 'workflow'
      }
    ],
    features: [
      {
        id: 'code-review-scheduling',
        title: 'Code Review Scheduling',
        description: 'Automatically schedule code reviews when PRs are ready, with team availability detection.',
        visual: 'workflow'
      },
      {
        id: 'client-meetings',
        title: 'Client Meeting Management',
        description: 'Streamline client calls with automated scheduling and project context integration.',
        visual: 'calendar'
      },
      {
        id: 'team-sync',
        title: 'Development Team Sync',
        description: 'Keep your dev team coordinated with sprint planning and standup scheduling.',
        visual: 'integration'
      }
    ],
    testimonials: [
      {
        quote: "OpenCal's API integration is seamless. I built our scheduling system in a weekend.",
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
        question: "Can I integrate OpenCal with my development tools?",
        answer: "Yes, OpenCal offers APIs and webhooks that integrate with GitHub, GitLab, Jira, and other development tools."
      },
      {
        question: "How does it handle different time zones for remote teams?",
        answer: "OpenCal automatically detects time zones and suggests optimal meeting times for distributed teams."
      },
      {
        question: "Can I customize the scheduling flow for my team?",
        answer: "Absolutely. Our API allows you to build custom scheduling experiences tailored to your development workflow."
      }
    ],
    cta: {
      title: "Ready to code more?",
      description: "Join developers worldwide using OpenCal to automate their scheduling.",
      button: "Start building"
    }
  },
  productivity: {
    id: 'productivity',
    title: 'For Productivity',
    subtitle: 'Optimize your time with AI-powered scheduling',
    description: 'Take control of your schedule with intelligent time management. OpenCal helps you optimize your day, reduce context switching, and achieve more.',
    hero: {
      title: 'Optimize your time with AI-powered scheduling',
      subtitle: 'Achieve more with intelligent time management',
      description: 'OpenCal analyzes your patterns and helps you schedule tasks, meetings, and breaks for maximum productivity.',
      cta: 'Optimize your time',
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
        quote: "OpenCal helped me reclaim 3 hours per day by optimizing my schedule.",
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
        question: "How does OpenCal optimize my schedule?",
        answer: "Our AI analyzes your work patterns, energy levels, and priorities to suggest optimal scheduling for maximum productivity."
      },
      {
        question: "Can I set boundaries for work-life balance?",
        answer: "Yes, OpenCal helps you schedule breaks, personal time, and maintain healthy work-life boundaries."
      },
      {
        question: "How does it handle different types of work?",
        answer: "OpenCal categorizes your work (deep work, meetings, breaks) and optimizes your schedule accordingly."
      }
    ],
    cta: {
      title: "Ready to optimize your time?",
      description: "Join productivity enthusiasts using OpenCal to achieve more.",
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