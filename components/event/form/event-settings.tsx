 'use client';

import * as React from 'react';
import { Calendar, Video } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Button } from '../../ui/button';
import { useUser } from '@clerk/nextjs';
import { getColorClasses, getCalendarColor } from '@/lib/calendar-utils/calendar-color-utils';
import { CopyButton } from '../../agent/copy-button';
import { ColorPicker } from './color-picker';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import type { GoogleCalendar } from '@/types/calendar';

interface EventSettingsProps {
  meetingType: string;
  calendar: string;
  color: string;
  onMeetingTypeChange: (meetingType: string) => void;
  onCalendarChange: (calendar: string) => void;
  onColorChange: (color: string) => void;
  meetingUrl?: string;
  meetingCode?: string;
  onGenerateMeeting?: () => void;
  isGeneratingMeeting?: boolean;
}

export const EventSettings = ({
  meetingType,
  calendar,
  color,
  onMeetingTypeChange,
  onCalendarChange,
  onColorChange,
  meetingUrl,
  meetingCode,
  onGenerateMeeting,
  isGeneratingMeeting,
}: EventSettingsProps) => {
  const { user: clerkUser } = useUser();
  const sessionEmail = clerkUser?.primaryEmailAddress?.emailAddress || '';
  const { fetchedCalendars } = useCalendarManagement();



  const groupedCalendars = React.useMemo(() => {
    const groups: Record<string, GoogleCalendar[]> = {};
    
    if (sessionEmail) {
      groups[sessionEmail] = [];
    }
    
    fetchedCalendars.forEach(cal => {
      if (sessionEmail) {
        if (!groups[sessionEmail]) {
          groups[sessionEmail] = [];
        }
        groups[sessionEmail].push(cal);
      }
    });
    
    return groups;
  }, [fetchedCalendars, sessionEmail]);

  const selectedCalendar = React.useMemo(() => {
    if (!calendar) return null;
    return fetchedCalendars.find(cal => cal.id === calendar) || null;
  }, [calendar, fetchedCalendars]);

  const COLORS = [
    { id: 'red', bg: 'bg-red-500' },
    { id: 'orange', bg: 'bg-orange-500' },
    { id: 'amber', bg: 'bg-amber-500' },
    { id: 'yellow', bg: 'bg-yellow-500' },
    { id: 'lime', bg: 'bg-lime-500' },
    { id: 'green', bg: 'bg-green-500' },
    { id: 'emerald', bg: 'bg-emerald-500' },
    { id: 'teal', bg: 'bg-teal-500' },
    { id: 'cyan', bg: 'bg-cyan-500' },
    { id: 'sky', bg: 'bg-sky-500' },
    { id: 'blue', bg: 'bg-blue-500' },
    { id: 'indigo', bg: 'bg-indigo-500' },
    { id: 'violet', bg: 'bg-violet-500' },
    { id: 'purple', bg: 'bg-purple-500' },
    { id: 'fuchsia', bg: 'bg-fuchsia-500' },
    { id: 'pink', bg: 'bg-pink-500' },
    { id: 'rose', bg: 'bg-rose-500' },
    { id: 'slate', bg: 'bg-slate-500' },
    { id: 'gray', bg: 'bg-gray-500' },
    { id: 'zinc', bg: 'bg-zinc-500' },
    { id: 'neutral', bg: 'bg-neutral-500' },
    { id: 'stone', bg: 'bg-stone-500' }
  ];

  return (
    <div className="flex flex-col gap-2 text-muted-foreground text-sm">
      <div className="flex items-center gap-2 ">
        <Video className="h-4 w-4" />
        <Select onValueChange={onMeetingTypeChange} value={meetingType} disabled={isGeneratingMeeting}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent cursor-pointer">
            <SelectValue placeholder="Add meeting" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
            <SelectItem
              className="text-popover-foreground hover:bg-accent cursor-pointer"
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
            <SelectItem className="text-muted-foreground cursor-pointer" disabled value="none">
              Zoom (Coming soon)
            </SelectItem>
            <SelectItem className="text-muted-foreground cursor-pointer" disabled value="none">
              Teams (Coming soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {meetingType === 'google-meet' && (
        <div className="rounded-md border border-border p-3 ml-6 text-foreground">
          <div className="flex flex-col gap-2">
            {meetingUrl ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener"
                    className="truncate hover:underline"
                  >
                    {meetingUrl}
                  </a>
                  <div className="flex items-center gap-1">
                    <CopyButton content={meetingUrl} />
                  </div>
                </div>
                {meetingCode ? (
                  <div className="text-xs text-muted-foreground">Code: {meetingCode}</div>
                ) : null}
                <div className='flex items-center gap-2'>
                  <Button size="sm" onClick={() => window.open(meetingUrl, '_blank', 'noopener')} className='bg-black hover:bg-black/80 dark:bg-white dark:hover:bg-white/80 text-white dark:text-black'>Join meeting</Button>
                  <Button size="sm" variant="outline" onClick={() => onGenerateMeeting?.()}>Regenerate</Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-2">
                  {isGeneratingMeeting ? 'Generating Google Meet link...' : 'Google Meet will be created when you save the event.'}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <Select onValueChange={onCalendarChange} value={calendar}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent">
            <SelectValue placeholder="Select calendar">
              {selectedCalendar ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getCalendarColor(selectedCalendar)}`}
                    style={{ backgroundColor: getCalendarColor(selectedCalendar) }}
                  />
                  {selectedCalendar.summary || selectedCalendar.name}
                </div>
              ) : (
                <span className="text-muted-foreground">Select calendar</span>
              )}
            </SelectValue>
          </SelectTrigger>
            <SelectContent align='start' side='left' className="border-border bg-popover dark:bg-neutral-900">
              {Object.entries(groupedCalendars).map(([accountEmail, calendars]) => (
               <div key={accountEmail}>
                 <span className='text-xs text-muted-foreground px-2'>{accountEmail}</span>
                 {calendars.map((cal) => (
                    <SelectItem
                      key={cal.id}
                      className="text-popover-foreground hover:bg-accent"
                      value={cal.id}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-xs ${getCalendarColor(cal)}`}
                          style={{ backgroundColor: getCalendarColor(cal) }}
                        />
                        {cal.summary || cal.name}
                      </div>
                    </SelectItem>
                  ))}
                </div>
              ))}
              {Object.keys(groupedCalendars).length === 0 && (
                <SelectItem className="text-muted-foreground" disabled value="none">
                  No accounts connected
                </SelectItem>
              )}
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2">Select Color</div>
              <div className="grid grid-cols-11 gap-2">
                {COLORS.map((colorOption) => (
                  <div
                    key={colorOption.id}
                    className="flex items-center justify-center"
                    onClick={() => onColorChange(colorOption.id)}
                  >
                    <div
                      className={`h-4 w-4 rounded-full cursor-pointer transition-all duration-150 hover:scale-110 ${colorOption.bg} ${
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
