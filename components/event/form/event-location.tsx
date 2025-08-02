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
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <MapPin className="h-4 w-4" />
      <Input
        className="h-9 flex-1 border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Add location"
        value={location}
      />
    </div>
  );
};
