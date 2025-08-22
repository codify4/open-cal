'use client';

import { useSession } from '@clerk/nextjs';
import { Calendar, Video } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import {
  getCalendarColor,
} from '@/lib/calendar-utils/calendar-color-utils';
import type { GoogleCalendar } from '@/types/calendar';
import { CopyButton } from '../../agent/copy-button';
import { Button } from '../../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { session: currentSession } = useSession();
  const sessionCalendars = useCalendarStore((state) => state.sessionCalendars);
  const isMobile = useIsMobile();

  const allCalendars = React.useMemo(() => {
    const calendars: GoogleCalendar[] = [];
    Object.values(sessionCalendars).forEach((sessionCals) => {
      if (Array.isArray(sessionCals)) {
        calendars.push(...sessionCals);
      }
    });
    return calendars;
  }, [sessionCalendars]);

  const groupedCalendars = React.useMemo(() => {
    if (!allCalendars.length) return {};
    
    const currentUserEmail = currentSession?.user?.primaryEmailAddress?.emailAddress;
    const groups: Record<string, GoogleCalendar[]> = {};

    allCalendars.forEach((calendar) => {
      const accountEmail = calendar.account || currentUserEmail || 'Unknown Account';
      if (!groups[accountEmail]) {
        groups[accountEmail] = [];
      }
      groups[accountEmail].push(calendar);
    });

    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
      if (a === currentUserEmail) return -1;
      if (b === currentUserEmail) return 1;
      return a.localeCompare(b);
    });

    sortedGroupKeys.forEach((email) => {
      groups[email].sort((a, b) => {
        if (a.primary && !b.primary) return -1;
        if (!a.primary && b.primary) return 1;
        return (a.summary || a.name || '').localeCompare(
          b.summary || b.name || ''
        );
      });
    });

    const sortedGroups: Record<string, GoogleCalendar[]> = {};
    sortedGroupKeys.forEach((email) => {
      sortedGroups[email] = groups[email];
    });

    return sortedGroups;
  }, [allCalendars, currentSession?.user?.primaryEmailAddress?.emailAddress]);

  const selectedCalendar = React.useMemo(() => {
    if (!calendar) return null;
    return allCalendars.find((cal) => cal.id === calendar) || null;
  }, [calendar, allCalendars]);

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
    { id: 'stone', bg: 'bg-stone-500' },
  ];

  return (
    <div className="flex flex-col gap-2 text-muted-foreground text-sm">
      <div className="flex items-center gap-2 ">
        <Video className="h-4 w-4" />
        <Select
          disabled={isGeneratingMeeting}
          onValueChange={onMeetingTypeChange}
          value={meetingType}
        >
          <SelectTrigger className="h-8 w-full cursor-pointer border-border bg-background text-foreground text-sm hover:bg-accent">
            <SelectValue placeholder="Add meeting">
              {meetingType === 'google-meet' && (
                <div className="flex items-center gap-2">
                  <Image
                    alt="Google Meet"
                    height={16}
                    src="/g-meet.svg"
                    width={16}
                  />
                  Google Meet
                </div>
              )}
              {meetingType === 'zoom' && (
                <div className="flex items-center gap-2">
                  <Image
                    alt="Zoom"
                    height={16}
                    src="/zoom.svg"
                    width={16}
                  />
                  Zoom
                </div>
              )}
              {meetingType === 'teams' && (
                <div className="flex items-center gap-2">
                  <Image
                    alt="Teams"
                    height={16}
                    src="/teams.svg"
                    width={16}
                  />
                  Teams
                </div>
              )}
              {meetingType === 'none' && <span>None</span>}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
            <SelectItem
              className="cursor-pointer text-popover-foreground hover:bg-accent"
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
            <SelectItem
              className="cursor-pointer text-muted-foreground"
              disabled
              value="zoom"
            >
              Zoom (Coming soon)
            </SelectItem>
            <SelectItem
              className="cursor-pointer text-muted-foreground"
              disabled
              value="teams"
            >
              Teams (Coming soon)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {meetingType === 'google-meet' && (
        <div className="ml-6 rounded-md border border-border p-3 text-foreground">
          <div className="flex flex-col gap-2">
            {meetingUrl ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <a
                    className="truncate hover:underline"
                    href={meetingUrl}
                    rel="noopener"
                    target="_blank"
                  >
                    {meetingUrl}
                  </a>
                  <div className="flex items-center gap-1">
                    <CopyButton content={meetingUrl} />
                  </div>
                </div>
                {meetingCode ? (
                  <div className="text-muted-foreground text-xs">
                    Code: {meetingCode}
                  </div>
                ) : null}
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
                    onClick={() =>
                      window.open(meetingUrl, '_blank', 'noopener')
                    }
                    size="sm"
                  >
                    Join meeting
                  </Button>
                  <Button
                    onClick={() => onGenerateMeeting?.()}
                    size="sm"
                    variant="outline"
                  >
                    Regenerate
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-2 text-muted-foreground text-sm">
                  {isGeneratingMeeting
                    ? 'Generating Google Meet link...'
                    : 'Google Meet will be created when you save the event.'}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <Select onValueChange={onCalendarChange} value={calendar}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-foreground text-sm hover:bg-accent">
            <SelectValue placeholder="Select calendar">
              {!allCalendars.length ? (
                <span className="text-muted-foreground">Loading calendars...</span>
              ) : selectedCalendar ? (
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${getCalendarColor(selectedCalendar)}`}
                    style={{
                      backgroundColor: getCalendarColor(selectedCalendar),
                    }}
                  />
                  {selectedCalendar.summary || selectedCalendar.name}
                </div>
              ) : (
                <span className="text-muted-foreground">Select calendar</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            align="start"
            className="border-border bg-popover dark:bg-neutral-900"
            side={isMobile ? "bottom" : "left"}
          >
            {!allCalendars.length ? (
              <SelectItem className="text-muted-foreground" disabled value="loading">
                Loading calendars...
              </SelectItem>
            ) : Object.keys(groupedCalendars).length === 0 ? (
              <SelectItem
                className="text-muted-foreground"
                disabled
                value="none"
              >
                No accounts connected
              </SelectItem>
            ) : (
              Object.entries(groupedCalendars).map(
                ([accountEmail, calendars]) => (
                  <div key={accountEmail}>
                    <div className="px-2 py-2 font-medium text-muted-foreground text-xs">
                      {accountEmail}
                    </div>
                    {calendars.map((cal) => (
                      <SelectItem
                        className="hover:bg-transparent hover:text-foreground"
                        key={cal.id}
                        value={cal.id}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-3 w-3 rounded-xs ${getCalendarColor(cal)}`}
                            style={{ backgroundColor: getCalendarColor(cal) }}
                          />
                          {cal.summary || cal.name}
                          {cal.primary && (
                            <span className="text-muted-foreground text-xs">
                              Default
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                )
              )
            )}
            <div className="p-2">
              <div className="mb-2 text-muted-foreground text-xs">
                Select Color
              </div>
              <div className="grid grid-cols-11 gap-2">
                {COLORS.map((colorOption) => (
                  <div
                    className="flex items-center justify-center"
                    key={colorOption.id}
                    onClick={() => onColorChange(colorOption.id)}
                  >
                    <div
                      className={`h-4 w-4 cursor-pointer rounded-full transition-all duration-150 hover:scale-110 ${colorOption.bg} ${
                        color === colorOption.id
                          ? 'ring-2 ring-black ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-neutral-950'
                          : 'ring-1 ring-neutral-300 hover:ring-neutral-400 dark:ring-neutral-600 dark:hover:ring-white/60'
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
