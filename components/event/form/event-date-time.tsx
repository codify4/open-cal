import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Button } from '../../ui/button';
import { Calendar as CalendarComponent } from '../../ui/calendar';
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventDateTimeProps {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  timezone: string;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  onAllDayChange: (isAllDay: boolean) => void;
  onTimezoneChange: (timezone: string) => void;
}

const generateTimeOptions = (currentValue?: string) => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(timeString);
    }
  }

  // If we have a current value that's not in the standard 15-minute intervals, add it
  if (currentValue && !options.includes(currentValue)) {
    options.push(currentValue);
    options.sort(); // Keep the list sorted
  }

  return options;
};

const TimePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const timeOptions = generateTimeOptions(value);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        className="h-9 border-border bg-background text-foreground text-sm hover:bg-accent flex-shrink-0">
        <SelectValue>{formatTime(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[200px] border-border bg-popover dark:bg-neutral-900">
        {timeOptions.map((time) => (
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            key={time}
            value={time}
          >
            {formatTime(time)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = Number.parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm.toLowerCase()}`;
};

const formatDate = (date: Date) => {
  return format(date, 'EEE, MMMM d');
};

export const EventDateTime = ({
  startDate,
  startTime,
  endTime,
  isAllDay,
  onStartDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onAllDayChange,
}: EventDateTimeProps) => {
  const isMobile = useIsMobile();
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-9 w-11/12 text-start justify-start border-border bg-background text-foreground hover:bg-accent gap-4"
                variant="outline"
              >
                <span>{formatDate(startDate)}</span>
                {!isAllDay ? (
                  <div>
                    <span>{formatTime(startTime)}</span>
                    <span className='mx-1'>-</span>
                    <span>{formatTime(endTime)}</span>
                  </div>
                ) : (
                  <span className="ml-1">All day</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side={isMobile ? "bottom" : "left"}
              className="w-auto border-border bg-popover p-0 dark:bg-neutral-900"
            >
              <div className="space-y-4 p-2">
                <div className="space-y-2">
                  <CalendarComponent
                    className="bg-popover"
                    initialFocus
                    mode="single"
                    onSelect={(date) => date && onStartDateChange(date)}
                    selected={startDate}
                  />
                </div>
                
                {!isAllDay && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Time</Label>
                    <div className="flex items-center gap-2">
                      <TimePicker onChange={onStartTimeChange} value={startTime} />
                      <span className="text-muted-foreground text-sm">-</span>
                      <TimePicker onChange={onEndTimeChange} value={endTime} />
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllDay}
          className="border-border"
          id="all-day"
          onCheckedChange={onAllDayChange}
        />
        <Label className="text-muted-foreground text-sm" htmlFor="all-day">
          All day
        </Label>
      </div>
    </div>
  );
};
