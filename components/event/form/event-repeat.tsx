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
    <div className="flex items-center gap-2 text-neutral-300 text-sm">
      <Repeat className="h-4 w-4" />
      <Select onValueChange={onRepeatChange} value={repeat}>
        <SelectTrigger className="h-8 flex-1 border-neutral-700 bg-neutral-800/50 text-sm text-white hover:bg-neutral-700">
          <SelectValue placeholder="Does not repeat" />
        </SelectTrigger>
        <SelectContent className="border-neutral-700 bg-neutral-900">
          <SelectItem className="text-white hover:bg-neutral-800" value="none">
            Does not repeat
          </SelectItem>
          <SelectItem className="text-white hover:bg-neutral-800" value="daily">
            Daily
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="weekly"
          >
            Weekly
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="monthly"
          >
            Monthly
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="yearly"
          >
            Yearly
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="custom"
          >
            Custom
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
