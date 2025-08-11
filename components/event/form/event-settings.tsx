 'use client';

import * as React from 'react';
import { Calendar, Tag, Video } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { authClient } from '@/lib/auth-client';
import { getColorClasses, emailColorFromString } from '@/components/sidebar/cal-accounts';

interface EventSettingsProps {
  meetingType: string;
  calendar: string;
  color: string;
  onMeetingTypeChange: (meetingType: string) => void;
  onCalendarChange: (calendar: string) => void;
  onColorChange: (color: string) => void;
}

export const EventSettings = ({
  meetingType,
  calendar,
  color,
  onMeetingTypeChange,
  onCalendarChange,
  onColorChange,
}: EventSettingsProps) => {
  const { data: session } = authClient.useSession();
  const sessionEmail = session?.user?.email || '';

  return (
    <div className="flex flex-col gap-2 text-muted-foreground text-sm">
      <div className="flex items-center gap-2 ">
        <Video className="h-4 w-4" />
        <Select onValueChange={onMeetingTypeChange} value={meetingType}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent">
            <SelectValue placeholder="Add meeting" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="google-meet"
            >
              <div className="flex items-center gap-2">
                <Image
                  alt="Google Meet"
                  height={16}
                  src="/g-meet.svg"
                  width={16}
                />
                Google Meet
              </div>
            </SelectItem>
            <SelectItem className="text-muted-foreground" disabled value="none">
              Zoom (Coming soon)
            </SelectItem>
            <SelectItem className="text-muted-foreground" disabled value="none">
              Teams (Coming soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <Select onValueChange={onCalendarChange} value={calendar}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent">
            <SelectValue placeholder="Select email account">
              {calendar && (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClasses(
                      emailColorFromString(calendar)
                    )}`}
                  />
                  {calendar}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
            {sessionEmail ? (
              <SelectItem
                className="text-popover-foreground hover:bg-accent"
                value={sessionEmail}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getColorClasses(
                      emailColorFromString(sessionEmail)
                    )}`}
                  />
                  {sessionEmail}
                </div>
              </SelectItem>
            ) : (
              <SelectItem className="text-muted-foreground" disabled value="none">
                No accounts connected
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <Select onValueChange={onColorChange} value={color}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900 max-h-60 overflow-y-auto">
            {/* Primary colors */}
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="blue"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                Blue
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="green"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                Green
              </div>
            </SelectItem>
            <SelectItem className="text-popover-foreground hover:bg-accent" value="red">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                Red
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="yellow"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                Yellow
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="purple"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                Purple
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="orange"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                Orange
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="pink"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-pink-500" />
                Pink
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="gray"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gray-500" />
                Gray
              </div>
            </SelectItem>
            
            {/* Extended colors */}
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="indigo"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500" />
                Indigo
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="teal"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-teal-500" />
                Teal
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="cyan"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-cyan-500" />
                Cyan
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="lime"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-lime-500" />
                Lime
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="amber"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                Amber
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="emerald"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                Emerald
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="violet"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-violet-500" />
                Violet
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="rose"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                Rose
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="slate"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-500" />
                Slate
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="zinc"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-zinc-500" />
                Zinc
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="neutral"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-neutral-500" />
                Neutral
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="stone"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-stone-500" />
                Stone
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="sky"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-sky-500" />
                Sky
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="fuchsia"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-fuchsia-500" />
                Fuchsia
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
