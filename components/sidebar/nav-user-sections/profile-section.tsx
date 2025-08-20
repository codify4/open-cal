'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface ProfileSectionProps {
  user: { name: string; email: string; avatar: string };
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { signOut } = useClerk();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-semibold text-neutral-900 text-xl dark:text-white">
          Profile
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Your account information and preferences.
        </p>
      </div>

      <Card className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <CardHeader>
          <CardTitle className="text-neutral-900 dark:text-white">
            Account Information
          </CardTitle>
          <CardDescription className="text-neutral-600 dark:text-neutral-400">
            Your profile details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="bg-neutral-100 text-lg dark:bg-neutral-800">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="mb-3 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-medium text-neutral-900 text-sm dark:text-white">
                    Name
                  </Label>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {user.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium text-neutral-900 text-sm dark:text-white">
                    Email
                  </Label>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-neutral-200 dark:border-neutral-800" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-neutral-900 dark:text-white">
                  Email Notifications
                </Label>
                <p className="text-neutral-600 text-sm dark:text-neutral-400">
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
          onClick={() =>
            signOut(() => {
              window.location.href = '/calendar';
            })
          }
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
