import { Users } from 'lucide-react';
import { useState } from 'react';
import { attendeeOptions } from '@/constants/add-event';
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

interface EventAttendeesProps {
  attendees: string[];
  onAttendeesChange: (attendees: string[]) => void;
}

export const EventAttendees = ({
  attendees,
  onAttendeesChange,
}: EventAttendeesProps) => {
  const [attendeeSearch, setAttendeeSearch] = useState('');

  const filteredAttendees = attendeeOptions.filter((attendee) =>
    attendee.toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const handleAttendeeToggle = (attendee: string) => {
    onAttendeesChange(
      attendees.includes(attendee)
        ? attendees.filter((a) => a !== attendee)
        : [...attendees, attendee]
    );
  };

  const removeAttendee = (attendee: string) => {
    onAttendeesChange(attendees.filter((a) => a !== attendee));
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <Users className="h-4 w-4" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-9 flex-1 justify-start border-border bg-background px-3 text-muted-foreground text-sm hover:bg-accent"
                variant="outline"
              >
                Add participants
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[300px] border-border bg-popover p-0 dark:bg-neutral-900"
            >
              <Command className="bg-popover dark:bg-neutral-900">
                <CommandInput
                  className="text-foreground"
                  onValueChange={setAttendeeSearch}
                  placeholder="Search attendees..."
                  value={attendeeSearch}
                />
                <CommandList>
                  <CommandEmpty className="text-muted-foreground">
                    No attendees found.
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredAttendees.map((attendee) => (
                      <CommandItem
                        className="flex items-center justify-between text-popover-foreground hover:bg-accent"
                        key={attendee}
                        onSelect={() => handleAttendeeToggle(attendee)}
                      >
                        <span>{attendee}</span>
                        {attendees.includes(attendee) && (
                          <div className="h-4 w-4 rounded-full bg-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {attendees.length > 0 && (
          <div className="flex flex-1 flex-wrap gap-1">
            {attendees.map((attendee) => (
              <Badge
                className="cursor-pointer text-xs"
                key={attendee}
                onClick={() => removeAttendee(attendee)}
                variant="default"
              >
                {attendee} ×
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
