'use client';

import { CreditCard, EllipsisVertical, Palette, User, Zap } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { CalendarEntry, EmailAccount } from '@/types/calendar';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { AppearanceSection } from './nav-user-sections/appearance-section';
import { BillingSection } from './nav-user-sections/billing-section';
import { IntegrationsSection } from './nav-user-sections/integrations-section';
import { ProfileSection } from './nav-user-sections/profile-section';

const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your account',
    icon: User,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    description: 'Manage your integrations',
    icon: Zap,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize your theme',
    icon: Palette,
  },
  {
    id: 'billing',
    title: 'Billing',
    description: 'Manage your subscription',
    icon: CreditCard,
  },
];

export function NavUser({
  user,
  accounts = [],
  calendars = [],
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  accounts?: EmailAccount[];
  calendars?: CalendarEntry[];
}) {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'billing':
        return <BillingSection />;
      default:
        return <ProfileSection user={user} />;
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenuButton
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="rounded-lg">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <EllipsisVertical className="h-4 w-4" />
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent className="h-[600px] w-[1000px] bg-white p-0 dark:bg-neutral-950">
            <DialogTitle className="sr-only">Settings</DialogTitle>
            <div className="flex h-full">
              <div className="w-48 border-neutral-200 border-r px-3 py-4 dark:border-neutral-800">
                <nav>
                  {SETTINGS_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        className={`flex w-full cursor-pointer items-center space-x-3 rounded-[10px] p-2 text-sm transition-colors hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 ${
                          activeSection === section.id
                            ? 'text-neutral-900 dark:text-white '
                            : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                        }`}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="font-medium">{section.title}</div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {renderSectionContent()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
