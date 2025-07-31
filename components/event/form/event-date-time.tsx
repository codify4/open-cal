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
        className="h-8 w-25 border-neutral-700 bg-neutral-800/50 text-sm text-white hover:bg-neutral-700"
        size="sm"
      >
        <SelectValue>{formatTime(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[200px] border-neutral-700 bg-neutral-900">
        {timeOptions.map((time) => (
          <SelectItem
            className="text-white hover:bg-neutral-800"
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
  endDate,
  startTime,
  endTime,
  isAllDay,
  timezone,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onAllDayChange,
  onTimezoneChange,
}: EventDateTimeProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-neutral-300 text-sm">
        <Clock className="h-4 w-4" />
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-8 border-neutral-700 bg-neutral-800/50 text-sm text-white hover:bg-neutral-700"
                variant="outline"
              >
                {formatDate(startDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto border-neutral-700 bg-neutral-900 p-0"
            >
              <div className="border-neutral-700 border-b p-2">
                <CalendarComponent
                  className="bg-neutral-900 p-2"
                  initialFocus
                  mode="single"
                  onSelect={(date) => date && onStartDateChange(date)}
                  selected={startDate}
                />
              </div>
            </PopoverContent>
          </Popover>

          {!isAllDay && (
            <>
              <TimePicker onChange={onStartTimeChange} value={startTime} />

              <span className="text-neutral-500">-</span>

              <TimePicker onChange={onEndTimeChange} value={endTime} />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          checked={isAllDay}
          className="border-neutral-600"
          id="all-day"
          onCheckedChange={onAllDayChange}
        />
        <Label className="text-neutral-300 text-sm" htmlFor="all-day">
          All day
        </Label>
      </div>
    </div>
  );
};
