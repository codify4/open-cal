import { Repeat } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface EventRepeatProps {
  repeat: string;
  onRepeatChange: (repeat: string) => void;
}

export const EventRepeat = ({ repeat, onRepeatChange }: EventRepeatProps) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Repeat className="h-4 w-4" />
      <Select onValueChange={onRepeatChange} value={repeat}>
        <SelectTrigger className="h-8 flex-1 border-border bg-background text-sm text-foreground hover:bg-accent">
          <SelectValue placeholder="Does not repeat" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover">
          <SelectItem className="text-popover-foreground hover:bg-accent" value="none">
            Does not repeat
          </SelectItem>
          <SelectItem className="text-popover-foreground hover:bg-accent" value="daily">
            Daily
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="weekly"
          >
            Weekly
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="monthly"
          >
            Monthly
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="yearly"
          >
            Yearly
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="custom"
          >
            Custom
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
