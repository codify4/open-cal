import { Users, Copy, X } from 'lucide-react';
import { useState } from 'react';
import { useGoogleContacts } from '@/hooks/use-google-contacts';
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
import { toast } from 'sonner';

interface GoogleContact {
  name: string;
  email: string;
}

interface EventAttendeesProps {
  attendees: GoogleContact[];
  onAttendeesChange: (attendees: GoogleContact[]) => void;
}

export const EventAttendees = ({
  attendees,
  onAttendeesChange,
}: EventAttendeesProps) => {
  const [attendeeSearch, setAttendeeSearch] = useState('');
  
  const { contacts, loading } = useGoogleContacts();
  
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    contact.email.toLowerCase().includes(attendeeSearch.toLowerCase())
  );
  

  const handleAttendeeToggle = (contact: GoogleContact) => {
    onAttendeesChange(
      attendees.some(a => a.email === contact.email)
        ? attendees.filter((a) => a.email !== contact.email)
        : [...attendees, contact]
    );
  };

  const removeAttendee = (contact: GoogleContact) => {
    onAttendeesChange(attendees.filter((a) => a.email !== contact.email));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Email copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy email.');
    });
  };

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <div className="flex w-full flex-col gap-2">
        {attendees.length > 0 && (
          <div className="flex flex-1 flex-col w-full gap-2 border border-border rounded-md p-2">
            {attendees.map((contact) => (
              <div className="flex flex-row items-center justify-between gap-2 rounded-md bg-muted px-2 py-1" key={contact.email}>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      {contact.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">{contact.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 hover:bg-accent"
                    onClick={() => copyToClipboard(contact.email)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0 hover:bg-accent"
                    onClick={() => removeAttendee(contact)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex w-full flex-row items-center gap-2">
          <Users className="h-4 w-4" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="h-9 flex-1 justify-start border-border bg-background px-3 text-muted-foreground text-sm hover:bg-accent"
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Loading contacts...' : 'Add participants'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side='left'
              className="w-[300px] border-border bg-popover p-0 dark:bg-neutral-900"
            >
              <Command className="bg-popover dark:bg-neutral-900">
                <CommandInput
                  className="text-foreground"
                  onValueChange={setAttendeeSearch}
                  placeholder="Search contacts..."
                  value={attendeeSearch}
                />
                <CommandList className='custom-scrollbar'>
                  <CommandEmpty className="text-muted-foreground text-xs p-2">
                    No contacts found.
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredContacts.map((contact) => (
                      <CommandItem
                        className="flex items-center justify-between text-popover-foreground hover:bg-accent"
                        key={contact.email}
                        onSelect={() => handleAttendeeToggle(contact)}
                      >
                        <div className="flex flex-col">
                          <span>{contact.name}</span>
                          <span className="text-xs text-muted-foreground">{contact.email}</span>
                        </div>
                        {attendees.some(a => a.email === contact.email) && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};
