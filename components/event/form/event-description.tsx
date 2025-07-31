import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';

interface EventDescriptionProps {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export const EventDescription = ({
  description,
  onDescriptionChange,
}: EventDescriptionProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-neutral-300 text-sm">
        <div className="flex h-4 w-4 items-center justify-center">
          <div className="h-0.5 w-3 bg-neutral-400" />
        </div>
        <span className="font-medium text-sm">Description</span>
      </div>

      <div className="rounded-sm border border-neutral-700 bg-neutral-800/50">
        <div className="flex items-center gap-1 border-neutral-700 border-b p-2">
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <Bold className="h-3 w-3" />
          </Button>
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <Italic className="h-3 w-3" />
          </Button>
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <Underline className="h-3 w-3" />
          </Button>
          <div className="mx-1 h-4 w-px bg-neutral-600" />
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <List className="h-3 w-3" />
          </Button>
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <ListOrdered className="h-3 w-3" />
          </Button>
          <div className="mx-1 h-4 w-px bg-neutral-600" />
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <Link className="h-3 w-3" />
          </Button>
          <Button className="h-6 w-6 p-0" size="sm" variant="ghost">
            <Strikethrough className="h-3 w-3" />
          </Button>
        </div>
        <Textarea
          className="min-h-[80px] resize-none border-0 bg-transparent text-sm text-white placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Add description"
          value={description}
        />
      </div>
    </div>
  );
};
