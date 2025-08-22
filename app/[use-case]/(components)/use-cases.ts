export interface UseCase {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
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
      subtitle: 'Manage your calendar with AI',
      description: 'Caly is a calendar with an AI agent that helps founders manage their busy schedules. Get summaries of your week, find free time slots, and let AI add events at optimal times.',
      icon: 'rocket',
      hero: {
        title: 'Manage your calendar with AI',
        subtitle: 'Stop juggling scheduling manually',
        description: 'Caly helps founders stay organized with AI that can edit your calendar, provide time summaries, find free slots, and add events when you need them most.',
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
          id: 'calendar-management',
          title: 'AI calendar management',
          description: 'Let AI handle your calendar edits, event scheduling, and time optimization.',
          icon: 'zap'
        },
        {
          id: 'time-insights',
          title: 'Time period summaries',
          description: 'Get clear overviews of your schedule for any time period you choose.',
          icon: 'users'
        },
        {
          id: 'free-time-finder',
          title: 'Find free time easily',
          description: 'AI quickly identifies available slots in your schedule for new meetings.',
          icon: 'brain'
        }
      ],
      features: [
        {
          id: 'ai-calendar-editing',
          title: 'AI Calendar Editing',
          description: 'Let AI add, modify, and organize events in your Google Calendar automatically.',
          visual: 'calendar'
        },
        {
          id: 'schedule-summaries',
          title: 'Schedule Summaries',
          description: 'Get concise overviews of your week, month, or any time period you specify.',
          visual: 'workflow'
        },
        {
          id: 'optimal-scheduling',
          title: 'Optimal Event Timing',
          description: 'AI suggests and places events at the best times based on your existing schedule.',
          visual: 'integration'
        }
      ],
      testimonials: [
        {
          quote: "Caly's AI makes managing my calendar effortless. I can focus on building my company.",
          author: "Sarah Chen",
          role: "CEO",
          company: "TechFlow"
        },
        {
          quote: "The AI finds free time and adds events exactly when I need them. Game changer.",
          author: "Marcus Rodriguez",
          role: "Founder",
          company: "DataSync"
        }
      ],
      faq: [
        {
          question: "How does Caly help with calendar management?",
          answer: "Caly's AI can edit your calendar, add events, and find optimal times based on your existing schedule."
        },
        {
          question: "Does Caly work with Google Calendar?",
          answer: "Yes. Caly integrates with Google Calendar so all changes are synced automatically."
        },
        {
          question: "What can the AI do with my calendar?",
          answer: "The AI can edit events, provide time period summaries, find free time slots, and add new events at optimal times."
        }
      ],
      cta: {
        title: "Ready to manage your calendar with AI?",
        description: "Try Caly and let AI handle your scheduling while you focus on building your startup.",
        button: "Get started"
      }
    },
    developers: {
      id: 'developers',
      title: 'For Developers',
      subtitle: 'Code more, schedule less',
      description: 'Focus on what matters most—building great software. Caly handles scheduling with smart automation and reliable Google Calendar sync.',
      icon: 'code',
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
           id: 'calendar-sync',
           title: 'Seamless calendar sync',
           description: 'All your events automatically sync with Google Calendar so you never miss a meeting.',
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
           question: "How does Caly help with code review scheduling?",
           answer: "Caly's AI can find optimal times for code reviews and automatically add them to your calendar when you're available."
         },
         {
           question: "Can I get summaries of my development schedule?",
           answer: "Yes. Ask Caly for summaries of your week, sprint, or any time period to see your development commitments at a glance."
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
      icon: 'target',
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
           question: "How does Caly help with productivity?",
           answer: "Caly's AI finds free time slots in your schedule and can add events at optimal times to help you stay organized and productive."
         },
         {
           question: "Can I organize my work by type?",
           answer: "Yes, you can use Google Calendar's color coding to categorize different types of work like meetings, deep work, and breaks."
         },
         {
           question: "Does this work with Google Calendar?",
           answer: "Yes. Caly keeps a two‑way sync with Google Calendar so changes are reflected immediately."
         },
         {
           question: "How does Caly find optimal times for events?",
           answer: "Caly analyzes your existing schedule to find available time slots and suggests the best times to add new events."
         }
      ],
      cta: {
        title: "Ready to optimize your time?",
        description: "Try Caly and let it handle everything in your calendar for you.",
        button: "Start optimizing"
      }
    },
    sales: {
      id: 'sales',
      title: 'For Sales Teams',
      subtitle: 'Manage your sales calendar with AI',
      description: 'Caly is a calendar with an AI agent that helps you stay organized. Get summaries of your week, find free time slots, and let AI add sales meetings at optimal times.',
      icon: 'trending-up',
      hero: {
        title: 'Manage your sales calendar with AI',
        subtitle: 'Stop juggling sales scheduling manually',
        description: 'Caly helps sales teams stay organized with AI that can edit your calendar, provide time summaries, find free slots, and add meetings when you need them most.',
        cta: 'Get started',
        demo: {
          type: 'calendar',
          props: {
            view: 'week',
            events: [
              { title: 'Prospect Demo', time: '10:00 AM', duration: 45, type: 'sales' },
              { title: 'Follow-up Call', time: '2:00 PM', duration: 30, type: 'sales' },
              { title: 'Team Pipeline Review', time: '4:00 PM', duration: 60, type: 'meeting' }
            ]
          }
        }
      },
      benefits: [
        {
          id: 'calendar-management',
          title: 'AI calendar management',
          description: 'Let AI handle your calendar edits, meeting scheduling, and time optimization.',
          icon: 'zap'
        },
        {
          id: 'time-insights',
          title: 'Time period summaries',
          description: 'Get clear overviews of your sales schedule for any time period you choose.',
          icon: 'check'
        },
        {
          id: 'free-time-finder',
          title: 'Find free time easily',
          description: 'AI quickly identifies available slots in your schedule for new sales meetings.',
          icon: 'arrow'
        }
      ],
      features: [
        {
          id: 'ai-calendar-editing',
          title: 'AI Calendar Editing',
          description: 'Let AI add, modify, and organize sales meetings in your Google Calendar automatically.',
          visual: 'calendar'
        },
        {
          id: 'schedule-summaries',
          title: 'Sales Schedule Summaries',
          description: 'Get concise overviews of your week, month, or any time period to see your sales commitments.',
          visual: 'workflow'
        },
        {
          id: 'optimal-scheduling',
          title: 'Optimal Meeting Timing',
          description: 'AI suggests and places sales meetings at the best times based on your existing schedule.',
          visual: 'ai'
        }
      ],
      testimonials: [
        {
          quote: "Caly's AI makes managing my sales calendar effortless. I can focus on selling.",
          author: "Mike Johnson",
          role: "Sales Director",
          company: "TechSales Pro"
        },
        {
          quote: "The AI finds free time and adds meetings exactly when I need them. Game changer.",
          author: "Sarah Williams",
          role: "Account Executive",
          company: "CloudScale"
        }
      ],
      faq: [
        {
          question: "How does Caly help with sales calendar management?",
          answer: "Caly's AI can edit your calendar, add sales meetings, and find optimal times based on your existing schedule."
        },
        {
          question: "Does Caly work with Google Calendar?",
          answer: "Yes. Caly integrates with Google Calendar so all changes are synced automatically."
        },
        {
          question: "What can the AI do with my sales calendar?",
          answer: "The AI can edit events, provide time period summaries, find free time slots, and add new sales meetings at optimal times."
        }
      ],
      cta: {
        title: "Ready to manage your sales calendar with AI?",
        description: "Try Caly and let AI handle your scheduling while you focus on selling.",
        button: "Get started"
      }
    },
    freelancers: {
      id: 'freelancers',
      title: 'For Freelancers',
      subtitle: 'Manage your freelance calendar with AI',
      description: 'Caly is a calendar with an AI agent that helps freelancers stay organized. Get summaries of your week, find free time slots, and let AI add client meetings at optimal times.',
      icon: 'users',
      hero: {
        title: 'Manage your freelance calendar with AI',
        subtitle: 'Stop juggling client scheduling manually',
        description: 'Caly helps freelancers stay organized with AI that can edit your calendar, provide time summaries, find free slots, and add client meetings when you need them most.',
        cta: 'Get started',
        demo: {
          type: 'calendar',
          props: {
            view: 'week',
            events: [
              { title: 'Client Project Review', time: '10:00 AM', duration: 60, type: 'meeting' },
              { title: 'Design Feedback Call', time: '2:00 PM', duration: 45, type: 'meeting' },
              { title: 'Project Planning', time: '4:00 PM', duration: 90, type: 'planning' }
            ]
          }
        }
      },
      benefits: [
        {
          id: 'client-coordination',
          title: 'Client coordination',
          description: 'Easily manage multiple clients and projects with AI calendar management.',
          icon: 'users'
        },
        {
          id: 'time-insights',
          title: 'Time period summaries',
          description: 'Get clear overviews of your freelance schedule for any time period you choose.',
          icon: 'clock'
        },
        {
          id: 'free-time-finder',
          title: 'Find free time easily',
          description: 'AI quickly identifies available slots in your schedule for new client meetings.',
          icon: 'folder'
        }
      ],
      features: [
        {
          id: 'ai-calendar-editing',
          title: 'AI Calendar Editing',
          description: 'Let AI add, modify, and organize client meetings in your Google Calendar automatically.',
          visual: 'calendar'
        },
        {
          id: 'schedule-summaries',
          title: 'Freelance Schedule Summaries',
          description: 'Get concise overviews of your week, month, or any time period to see your client commitments.',
          visual: 'workflow'
        },
        {
          id: 'optimal-scheduling',
          title: 'Optimal Meeting Timing',
          description: 'AI suggests and places client meetings at the best times based on your existing schedule.',
          visual: 'ai'
        }
      ],
      testimonials: [
        {
          quote: "Caly's AI makes managing my freelance calendar effortless. I can focus on my clients.",
          author: "Maria Garcia",
          role: "UX Designer",
          company: "Freelance"
        },
        {
          quote: "The AI finds free time and adds client meetings exactly when I need them. Game changer.",
          author: "Tom Wilson",
          role: "Web Developer",
          company: "Freelance"
        }
      ],
      faq: [
        {
          question: "How does Caly help with client scheduling?",
          answer: "Caly's AI can edit your calendar, add client meetings, and find optimal times based on your existing schedule."
        },
        {
          question: "Does Caly work with Google Calendar?",
          answer: "Yes. Caly integrates with Google Calendar so all changes are synced automatically."
        },
        {
          question: "What can the AI do with my freelance calendar?",
          answer: "The AI can edit events, provide time period summaries, find free time slots, and add new client meetings at optimal times."
        }
      ],
      cta: {
        title: "Ready to manage your freelance calendar with AI?",
        description: "Try Caly and let AI handle your scheduling while you focus on your clients.",
        button: "Get started"
      }
    },
    consultants: {
      id: 'consultants',
      title: 'For Consultants',
      subtitle: 'Manage your consulting calendar with AI',
      description: 'Caly is a calendar with an AI agent that helps consultants stay organized. Get summaries of your week, find free time slots, and let AI add client meetings at optimal times.',
      icon: 'briefcase',
      hero: {
        title: 'Manage your consulting calendar with AI',
        subtitle: 'Stop juggling client scheduling manually',
        description: 'Caly helps consultants stay organized with AI that can edit your calendar, provide time summaries, find free slots, and add client meetings when you need them most.',
        cta: 'Get started',
        demo: {
          type: 'calendar',
          props: {
            view: 'day',
            events: [
              { title: 'Client Strategy Session', time: '9:00 AM', duration: 90, type: 'consulting' },
              { title: 'Project Review', time: '11:30 AM', duration: 60, type: 'consulting' },
              { title: 'Client Onboarding', time: '2:00 PM', duration: 120, type: 'consulting' }
            ]
          }
        }
      },
      benefits: [
        {
          id: 'client-coordination',
          title: 'Client coordination',
          description: 'Easily manage multiple clients and stakeholders with AI calendar management.',
          icon: 'users'
        },
        {
          id: 'time-insights',
          title: 'Time period summaries',
          description: 'Get clear overviews of your consulting schedule for any time period you choose.',
          icon: 'clock'
        },
        {
          id: 'free-time-finder',
          title: 'Find free time easily',
          description: 'AI quickly identifies available slots in your schedule for new client meetings.',
          icon: 'folder'
        }
      ],
      features: [
        {
          id: 'ai-calendar-editing',
          title: 'AI Calendar Editing',
          description: 'Let AI add, modify, and organize client meetings in your Google Calendar automatically.',
          visual: 'calendar'
        },
        {
          id: 'schedule-summaries',
          title: 'Consulting Schedule Summaries',
          description: 'Get concise overviews of your week, month, or any time period to see your client commitments.',
          visual: 'workflow'
        },
        {
          id: 'optimal-scheduling',
          title: 'Optimal Meeting Timing',
          description: 'AI suggests and places client meetings at the best times based on your existing schedule.',
          visual: 'ai'
        }
      ],
      testimonials: [
        {
          quote: "Caly's AI makes managing my consulting calendar effortless. I can focus on my clients.",
          author: "Jennifer Lee",
          role: "Management Consultant",
          company: "Strategy Partners"
        },
        {
          quote: "The AI finds free time and adds client meetings exactly when I need them. Game changer.",
          author: "Robert Chen",
          role: "IT Consultant",
          company: "Tech Advisory Group"
        }
      ],
      faq: [
        {
          question: "How does Caly help with client scheduling?",
          answer: "Caly's AI can edit your calendar, add client meetings, and find optimal times based on your existing schedule."
        },
        {
          question: "Does Caly work with Google Calendar?",
          answer: "Yes. Caly integrates with Google Calendar so all changes are synced automatically."
        },
        {
          question: "What can the AI do with my consulting calendar?",
          answer: "The AI can edit events, provide time period summaries, find free time slots, and add new client meetings at optimal times."
        }
      ],
      cta: {
        title: "Ready to manage your consulting calendar with AI?",
        description: "Try Caly and let AI handle your scheduling while you focus on your clients.",
        button: "Get started"
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