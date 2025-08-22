import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SimpleChatMessageProps {
  message: string;
  isUser?: boolean;
  timestamp?: string;
  className?: string;
}

export function SimpleChatMessage({
  message,
  isUser = false,
  timestamp,
  className,
}: SimpleChatMessageProps) {
  return (
    <div
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={isUser ? '/avatar-user.png' : '/avatar-ai.png'} />
        <AvatarFallback className="text-xs">
          {isUser ? 'U' : 'AI'}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'flex flex-col gap-1',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'max-w-xs rounded-lg px-3 py-2 text-sm',
            isUser ? 'bg-white text-black' : 'bg-muted text-foreground'
          )}
        >
          {message}
        </div>
        {timestamp && (
          <span className="text-muted-foreground text-xs">{timestamp}</span>
        )}
      </div>
    </div>
  );
}
