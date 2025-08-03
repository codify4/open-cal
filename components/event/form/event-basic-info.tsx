import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';

interface EventBasicInfoProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
}

export const EventBasicInfo = ({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: EventBasicInfoProps) => {
  return (
    <div className="space-y-2">
      <Label className="sr-only">Event Title</Label>
      <Input
        className="h-9 border-border bg-background font-medium text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Title"
        value={title}
      />

      <Label className="sr-only">Event Description</Label>
      <Textarea
        className="min-h-[60px] resize-none border-border  text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="Add description..."
        value={description}
      />
    </div>
  );
};
