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
    <div className="flex items-center gap-2 text-neutral-300 text-sm">
      <Briefcase className="h-4 w-4" />
      <Select onValueChange={onAvailabilityChange} value={availability}>
        <SelectTrigger className="h-8 flex-1 border-neutral-700 bg-neutral-800/50 text-sm hover:bg-neutral-700">
          <SelectValue placeholder="Busy" />
        </SelectTrigger>
        <SelectContent className="border-neutral-700 bg-neutral-900">
          <SelectItem className="text-white hover:bg-neutral-800" value="busy">
            Busy
          </SelectItem>
          <SelectItem className="text-white hover:bg-neutral-800" value="free">
            Free
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="tentative"
          >
            Tentative
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="out-of-office"
          >
            Out of office
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
