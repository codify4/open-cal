import { Bell } from 'lucide-react';
import { useState } from 'react';
import { reminderOptions } from '@/constants/add-event';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';

interface EventRemindersProps {
  reminders: Date[];
  onRemindersChange: (reminders: Date[]) => void;
}

export const EventReminders = ({
  reminders,
  onRemindersChange,
}: EventRemindersProps) => {
  const [reminderSearch, setReminderSearch] = useState('');

  const filteredReminders = reminderOptions.filter((reminder) =>
    reminder.toLowerCase().includes(reminderSearch.toLowerCase())
  );

  const handleReminderToggle = (reminder: Date) => {
    onRemindersChange(
      reminders.includes(reminder)
        ? reminders.filter((r) => r !== reminder)
        : [...reminders, reminder]
    );
  };

  const removeReminder = (reminder: Date) => {
    onRemindersChange(reminders.filter((r) => r !== reminder));
  };

  return (
    <div className="flex items-center gap-2 text-neutral-300 text-sm">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <Bell className="h-4 w-4" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-9 w-full flex-1 justify-start border-neutral-700 bg-neutral-800/50 px-3 text-neutral-400 text-sm hover:bg-neutral-700"
                variant="outline"
              >
                Add reminder
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[300px] border-neutral-700 bg-neutral-900 p-0"
            >
              <Command className="bg-neutral-900">
                <CommandInput
                  className="text-white"
                  onValueChange={setReminderSearch}
                  placeholder="Search reminders..."
                  value={reminderSearch}
                />
                <CommandList>
                  <CommandEmpty className="text-neutral-400">
                    No reminders found.
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredReminders.map((reminder) => (
                      <CommandItem
                        className="flex items-center justify-between text-white hover:bg-neutral-800"
                        key={reminder.toString()}
                        onSelect={() =>
                          handleReminderToggle(new Date(reminder))
                        }
                      >
                        <span>{reminder.toLocaleString()}</span>
                        {reminders.includes(new Date(reminder)) && (
                          <div className="h-4 w-4 rounded-full bg-blue-500" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {reminders.length > 0 && (
          <div className="flex flex-1 flex-wrap gap-1">
            {reminders.map((reminder) => (
              <Badge
                className="cursor-pointer text-black text-xs"
                key={reminder.toString()}
                onClick={() => removeReminder(reminder)}
                variant="default"
              >
                {reminder.toLocaleString()} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
