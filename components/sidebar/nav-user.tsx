'use client';

import {
  CreditCard,
  EllipsisVertical,
  ExternalLink,
  LogOut,
  Moon,
  Palette,
  Plus,
  Settings,
  Sun,
  Trash2,
  User,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from 'next-themes';
import { authClient } from '@/lib/auth-client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import type { EmailAccount, CalendarEntry } from '@/components/sidebar/cal-accounts';
import { getColorClasses, emailColorFromString } from '@/components/sidebar/cal-accounts';
import Image from 'next/image';

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
  accounts,
  calendars,
  onAddAccount,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  accounts: EmailAccount[];
  calendars: CalendarEntry[];
  onAddAccount: () => void;
}) {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} />;
      case 'integrations':
        return (
          <IntegrationsSection
            accounts={accounts}
            calendars={calendars}
            onAddAccount={onAddAccount}
          />
        );
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
                <AvatarFallback className="rounded-lg">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <EllipsisVertical className="h-4 w-4" />
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent className="h-[600px] w-[1000px] bg-white dark:bg-neutral-950 p-0">
            <div className="flex h-full">
              <div className="w-1/4 border-neutral-200 dark:border-neutral-800 border-r px-3 py-4">
                <div className="mb-6">
                  <DialogTitle className="font-semibold text-lg text-neutral-900 dark:text-white">
                    Settings
                  </DialogTitle>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Manage your account preferences
                  </p>
                </div>

                <nav className="space-y-2">
                  {SETTINGS_SECTIONS.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        className={`flex w-full cursor-pointer items-center space-x-3 rounded-lg p-2 text-sm transition-colors ${
                          activeSection === section.id
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon className="h-4 w-4" />
                        <div className="text-left">
                          <div className="font-medium">{section.title}</div>
                          <div className="text-neutral-500 dark:text-neutral-500 text-xs">
                            {section.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="w-3/4 overflow-y-auto p-6">
                {renderSectionContent()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ProfileSection({
  user,
}: {
  user: { name: string; email: string; avatar: string };
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">Profile</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Your account information and preferences.
        </p>
      </div>

      <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">Account Information</CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">
            Your profile details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="bg-neutral-100 dark:bg-neutral-800 text-lg">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="grid grid-cols-2">
              <div className="space-y-2">
                <Label className="font-medium text-sm text-neutral-900 dark:text-white">Name</Label>
                <p className="text-neutral-700 dark:text-neutral-300">{user.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="font-medium text-sm text-neutral-900 dark:text-white">Email</Label>
                <p className="text-neutral-700 dark:text-neutral-300">{user.email}</p>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-200 dark:bg-neutral-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-neutral-900 dark:text-white">Email Notifications</Label>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Receive email updates about your account
                </p>
              </div>
              <Switch className="cursor-pointer" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          className="rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500/20"
          onClick={() => authClient.signOut({ fetchOptions: { onError: () => {} } })}
          type="button"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme || 'system');

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">Appearance</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize how the application looks and feels.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Theme</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Choose your preferred color scheme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTheme === 'light'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
                onClick={() => handleThemeChange('light')}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Sun className="h-4 w-4" />
                  <span className="font-medium text-neutral-900 dark:text-white">Light</span>
                </div>
                <div className="h-8 rounded border-2 border-gray-200 bg-white" />
              </button>

              <button
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTheme === 'dark'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
                onClick={() => handleThemeChange('dark')}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Moon className="h-4 w-4" />
                  <span className="font-medium text-neutral-900 dark:text-white">Dark</span>
                </div>
                <div className="h-8 rounded border-2 border-neutral-700 bg-neutral-900" />
              </button>

              <button
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  selectedTheme === 'system'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                }`}
                onClick={() => handleThemeChange('system')}
              >
                <div className="mb-2 flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span className="font-medium text-neutral-900 dark:text-white">System</span>
                </div>
                <div className="h-8 rounded border-2 border-gray-200 bg-gradient-to-r from-white to-neutral-900" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">
          Billing & Subscription
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your subscription and payment methods.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Current Plan</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Your current subscription details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-neutral-100 dark:bg-neutral-800 p-4">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                  <span className="font-semibold text-white">P</span>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white">Pro Plan</h4>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">$29/month</p>
                </div>
              </div>
              <Badge
                className="bg-green-500/20 text-green-600 dark:text-green-400"
                variant="secondary"
              >
                Active
              </Badge>
            </div>
            <div className="text-neutral-600 dark:text-neutral-400 text-sm">
              <p>Next billing date: January 15, 2024</p>
              <p>Billed monthly • Auto-renewal enabled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Subscription Actions</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <CreditCard className="mr-2 h-4 w-4" />
              Change Plan
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Cancel Subscription
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function IntegrationsSection({
  accounts,
  calendars,
  onAddAccount,
}: {
  accounts: EmailAccount[];
  calendars: CalendarEntry[];
  onAddAccount: () => void;
}) {
  const colorMap: Record<EmailAccount['color'], string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  return (
    <div className="scrollbar-hide max-h-[560px] space-y-6 overflow-y-auto scroll-smooth pr-2">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 dark:text-white text-xl">Integrations</h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Connect your accounts and services to enhance your experience.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Google Calendar</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Connect your Google Calendar accounts to sync events and manage
              your schedule
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {accounts.length > 0 && (
              <div className="space-y-3">
                {accounts.map((account) => (
                  <div
                    className="flex items-center justify-between rounded-lg bg-neutral-100 dark:bg-neutral-800 p-3"
                    key={account.email}
                  >
                    <div className="flex items-center space-x-3">
                      <Image src={'g-cal.svg'} alt={account.email} width={32} height={32} />
                      <div>
                        <h4 className="font-semibold text-neutral-900 dark:text-white">
                          {account.email}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="w-full justify-start border-neutral-300 dark:border-neutral-600 border-dashed hover:border-neutral-400 dark:hover:border-neutral-500"
              onClick={onAddAccount}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Connect Another Google Calendar Account
            </Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-white">Google Meet</CardTitle>
            <CardDescription className="text-neutral-600 dark:text-neutral-400">
              Connect your Google Meet accounts to join meetings directly from
              your calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">Google Meet linking coming soon</div>

            <Button
              className="w-full justify-start border-neutral-300 dark:border-neutral-600 border-dashed hover:border-neutral-400 dark:hover:border-neutral-500"
              onClick={onAddAccount}
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Connect Another Google Meet Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
