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
import { authClient } from '@/lib/auth-client';
import { getColorClasses, emailColorFromString } from '@/lib/calendar-color-utils';
import { CopyButton } from '../../agent/copy-button';
import { ColorPicker } from './color-picker';

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
  const { data: session } = authClient.useSession();
  const sessionEmail = session?.user?.email || '';

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

      <ColorPicker color={color} onColorChange={onColorChange} />
    </div>
  );
};
