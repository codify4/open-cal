import { MapPin } from 'lucide-react';
import { Input } from '../../ui/input';

interface EventLocationProps {
  location: string;
  onLocationChange: (location: string) => void;
}

export const EventLocation = ({
  location,
  onLocationChange,
}: EventLocationProps) => {
  return (
    <div className="flex items-center gap-2 text-neutral-300 text-sm">
      <MapPin className="h-4 w-4" />
      <Input
        className="h-9 flex-1 border-neutral-700 bg-neutral-800/50 px-3 text-sm text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Add location"
        value={location}
      />
    </div>
  );
};
