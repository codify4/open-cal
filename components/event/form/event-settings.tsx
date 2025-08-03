import { Calendar, Tag, Video } from 'lucide-react';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

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
                    className={`h-3 w-3 rounded-full ${
                      calendar === 'john.doe@gmail.com'
                        ? 'bg-red-500'
                        : calendar === 'jane.smith@outlook.com'
                          ? 'bg-blue-500'
                          : calendar === 'work@company.com'
                            ? 'bg-green-500'
                            : calendar === 'personal@icloud.com'
                              ? 'bg-purple-500'
                              : 'bg-muted'
                    }`}
                  />
                  {calendar}
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="john.doe@gmail.com"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                john.doe@gmail.com
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="jane.smith@outlook.com"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                jane.smith@outlook.com
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="work@company.com"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                work@company.com
              </div>
            </SelectItem>
            <SelectItem
              className="text-popover-foreground hover:bg-accent"
              value="personal@icloud.com"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500" />
                personal@icloud.com
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <Select onValueChange={onColorChange} value={color}>
          <SelectTrigger className="h-8 w-full border-border bg-background text-sm text-foreground hover:bg-accent">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent className="border-border bg-popover dark:bg-neutral-900">
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
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
