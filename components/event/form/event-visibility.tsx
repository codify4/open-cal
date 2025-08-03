import { Lock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface EventVisibilityProps {
  visibility: string;
  onVisibilityChange: (visibility: string) => void;
}

export const EventVisibility = ({
  visibility,
  onVisibilityChange,
}: EventVisibilityProps) => {
  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Lock className="h-4 w-4" />
      <Select onValueChange={onVisibilityChange} value={visibility}>
        <SelectTrigger className="h-8 flex-1 border-border bg-background text-sm text-foreground hover:bg-accent">
          <SelectValue placeholder="Default visibility" />
        </SelectTrigger>
        <SelectContent className="border-border bg-popover dark:bg-neutral-900">
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="default"
          >
            Default visibility
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="public"
          >
            Public
          </SelectItem>
          <SelectItem
            className="text-popover-foreground hover:bg-accent"
            value="private"
          >
            Private
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
