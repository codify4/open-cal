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
import { getColorClasses, emailColorFromString, getCalendarColor } from '@/lib/calendar-color-utils';

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
            <SelectValue placeholder="Color">
              {color && (
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : color === 'yellow' ? 'bg-yellow-500' : color === 'purple' ? 'bg-purple-500' : color === 'orange' ? 'bg-orange-500' : color === 'pink' ? 'bg-pink-500' : color === 'gray' ? 'bg-gray-500' : color === 'indigo' ? 'bg-indigo-500' : color === 'teal' ? 'bg-teal-500' : color === 'cyan' ? 'bg-cyan-500' : color === 'lime' ? 'bg-lime-500' : color === 'amber' ? 'bg-amber-500' : color === 'emerald' ? 'bg-emerald-500' : color === 'violet' ? 'bg-violet-500' : color === 'rose' ? 'bg-rose-500' : color === 'slate' ? 'bg-slate-500' : color === 'zinc' ? 'bg-zinc-500' : color === 'neutral' ? 'bg-neutral-500' : color === 'stone' ? 'bg-stone-500' : color === 'sky' ? 'bg-sky-500' : color === 'fuchsia' ? 'bg-fuchsia-500' : 'bg-gray-500'}`} />
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2">Select Color</div>
              <div className="grid grid-cols-9 gap-2">
                {[
                  { id: 'blue', bg: 'bg-blue-500' },
                  { id: 'green', bg: 'bg-green-500' },
                  { id: 'red', bg: 'bg-red-500' },
                  { id: 'yellow', bg: 'bg-yellow-500' },
                  { id: 'purple', bg: 'bg-purple-500' },
                  { id: 'orange', bg: 'bg-orange-500' },
                  { id: 'pink', bg: 'bg-pink-500' },
                  { id: 'gray', bg: 'bg-gray-500' },
                  { id: 'indigo', bg: 'bg-indigo-500' },
                  { id: 'teal', bg: 'bg-teal-500' },
                  { id: 'cyan', bg: 'bg-cyan-500' },
                  { id: 'lime', bg: 'bg-lime-500' },
                  { id: 'amber', bg: 'bg-amber-500' },
                  { id: 'emerald', bg: 'bg-emerald-500' },
                  { id: 'violet', bg: 'bg-violet-500' },
                  { id: 'rose', bg: 'bg-rose-500' },
                  { id: 'slate', bg: 'bg-slate-500' },
                  { id: 'zinc', bg: 'bg-zinc-500' },
                  { id: 'neutral', bg: 'bg-neutral-500' },
                  { id: 'stone', bg: 'bg-stone-500' },
                  { id: 'sky', bg: 'bg-sky-500' },
                  { id: 'fuchsia', bg: 'bg-fuchsia-500' }
                ].map((colorOption) => (
                  <div
                    key={colorOption.id}
                    className="flex items-center justify-center"
                    onClick={() => onColorChange(colorOption.id)}
                  >
                    <div
                      className={`h-5 w-5 rounded-full cursor-pointer transition-all duration-150 hover:scale-110 ${colorOption.bg} ${
                        color === colorOption.id 
                          ? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-neutral-950' 
                          : 'ring-1 ring-neutral-300 dark:ring-neutral-600 hover:ring-neutral-400 dark:hover:ring-white/60'
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
