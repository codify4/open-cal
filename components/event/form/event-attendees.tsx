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
    <div className="flex items-center gap-2 text-neutral-300 text-sm">
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <Users className="h-4 w-4" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-9 flex-1 justify-start border-neutral-700 bg-neutral-800/50 px-3 text-neutral-400 text-sm hover:bg-neutral-700"
                variant="outline"
              >
                Add participants
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-[300px] border-neutral-700 bg-neutral-900 p-0"
            >
              <Command className="bg-neutral-900">
                <CommandInput
                  className="text-white"
                  onValueChange={setAttendeeSearch}
                  placeholder="Search attendees..."
                  value={attendeeSearch}
                />
                <CommandList>
                  <CommandEmpty className="text-neutral-400">
                    No attendees found.
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredAttendees.map((attendee) => (
                      <CommandItem
                        className="flex items-center justify-between text-white hover:bg-neutral-800"
                        key={attendee}
                        onSelect={() => handleAttendeeToggle(attendee)}
                      >
                        <span>{attendee}</span>
                        {attendees.includes(attendee) && (
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
        {attendees.length > 0 && (
          <div className="flex flex-1 flex-wrap gap-1">
            {attendees.map((attendee) => (
              <Badge
                className="cursor-pointer text-black text-xs"
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
