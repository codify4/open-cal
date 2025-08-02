import { format } from 'date-fns';
import { Clock, RefreshCw, Repeat, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Event } from '@/lib/store/calendar-store';
import { Button } from '../../ui/button';
import { Calendar as CalendarComponent } from '../../ui/calendar';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { EventReminders } from './event-reminders';

interface BirthdayFormProps {
  event?: Event | null;
  onSave?: (eventData: Partial<Event>) => void;
}

export const BirthdayForm = ({ event, onSave }: BirthdayFormProps) => {
  const [birthdayData, setBirthdayData] = useState({
    title: '',
    date: new Date(),
    recurrence: 'yearly',
    account: '',
    reminders: [] as Date[],
  });

  // Initialize form data when editing an event
  useEffect(() => {
    if (event) {
      setBirthdayData({
        title: event.title || '',
        date: event.startDate,
        recurrence: event.repeat || 'yearly',
        account: '',
        reminders: event.reminders || [],
      });
    }
  }, [event]);

  // Auto-save functionality
  const updateBirthdayData = (updates: Partial<typeof birthdayData>) => {
    const newData = { ...birthdayData, ...updates };
    setBirthdayData(newData);

    // Trigger auto-save
    if (onSave) {
      onSave({
        title: newData.title,
        startDate: newData.date,
        endDate: newData.date,
        isAllDay: true,
        type: 'birthday',
        color: 'pink',
        repeat: newData.recurrence as
          | 'yearly'
          | 'none'
          | 'daily'
          | 'weekly'
          | 'monthly',
        reminders: newData.reminders,
      });
    }
  };

  const formatDate = (date: Date) => {
    return format(date, 'EEE MMMM d');
  };

  const formatRecurrence = (recurrence: string) => {
    switch (recurrence) {
      case 'yearly':
        return `Every year on ${formatDate(birthdayData.date)}`;
      case 'monthly':
        return `Every month on ${format(birthdayData.date, 'dd')}`;
      default:
        return 'Never';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="sr-only">Birthday Title</Label>
        <Input
          className="h-9 border-border bg-background font-medium text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => updateBirthdayData({ title: e.target.value })}
          placeholder="Birthday"
          value={birthdayData.title}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-8 rounded-sm border-border bg-background text-sm text-foreground hover:bg-accent"
                variant="outline"
              >
                {formatDate(birthdayData.date)}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto border-border bg-popover p-0"
            >
              <div className="border-border border-b p-2">
                <CalendarComponent
                  className="bg-popover p-2"
                  initialFocus
                  mode="single"
                  onSelect={(date) => date && updateBirthdayData({ date })}
                  selected={birthdayData.date}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Repeat className="h-4 w-4" />
          <div className="flex h-8 items-center rounded-sm border border-border bg-background px-2 text-muted-foreground">
            {formatRecurrence(birthdayData.recurrence)}
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <User className="h-4 w-4" />
          <Select
            onValueChange={(value) => updateBirthdayData({ account: value })}
            value={birthdayData.account}
          >
            <SelectTrigger className="h-8 flex-1 border-border bg-background text-sm text-foreground hover:bg-accent">
              <SelectValue placeholder="Select account">
                {birthdayData.account && (
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        birthdayData.account === 'john.doe@gmail.com'
                          ? 'bg-red-500'
                          : birthdayData.account === 'jane.smith@outlook.com'
                            ? 'bg-blue-500'
                            : birthdayData.account === 'work@company.com'
                              ? 'bg-green-500'
                              : birthdayData.account === 'personal@icloud.com'
                                ? 'bg-purple-500'
                                : 'bg-muted'
                      }`}
                    />
                    {birthdayData.account}
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="border-border bg-popover">
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
      </div>

      <div className="space-y-2">
        <EventReminders
          onRemindersChange={(reminders) => updateBirthdayData({ reminders })}
          reminders={birthdayData.reminders}
        />
      </div>
    </div>
  );
};
