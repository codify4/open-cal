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
    <div className="flex items-center gap-2 text-neutral-300 text-sm">
      <Lock className="h-4 w-4" />
      <Select onValueChange={onVisibilityChange} value={visibility}>
        <SelectTrigger className="h-8 flex-1 border-neutral-700 bg-neutral-800/50 text-sm hover:bg-neutral-700">
          <SelectValue placeholder="Default visibility" />
        </SelectTrigger>
        <SelectContent className="border-neutral-700 bg-neutral-900">
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="default"
          >
            Default visibility
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="public"
          >
            Public
          </SelectItem>
          <SelectItem
            className="text-white hover:bg-neutral-800"
            value="private"
          >
            Private
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
