import { Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface EventAvailabilityProps {
  availability: string;
  onAvailabilityChange: (availability: string) => void;
}

export const EventAvailability = ({
  availability,
  onAvailabilityChange,
}: EventAvailabilityProps) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Briefcase className="h-4 w-4" />
      <Select onValueChange={onAvailabilityChange} value={availability}>
        <SelectTrigger className="h-8 flex-1 border-border bg-background text-foreground text-sm hover:bg-accent">
          <SelectValue placeholder="Busy" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover dark:bg-neutral-900">
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="busy"
          >
            Busy
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="free"
          >
            Free
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="tentative"
          >
            Tentative
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="out-of-office"
          >
            Out of office
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
