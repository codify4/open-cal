'use client';

import { Copy, RefreshCw, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MessageFooterProps {
  className?: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
  children?: React.ReactNode;
}

export function MessageFooter({
  className,
  onRegenerate,
  isRegenerating = false,
  onCopy,
  onRate,
  children,
}: MessageFooterProps) {
  return (
    <div className={cn('mt-2 flex items-center gap-2 rounded-md', className)}>
      <div className="flex items-center gap-2">
        {onCopy && (
          <Button
            className="h-6 w-6 p-0"
            onClick={onCopy}
            size="sm"
            variant="ghost"
          >
            <Copy className="h-2 w-2" />
          </Button>
        )}

        {onRate && (
          <>
            <Button
              className="h-6 w-6 p-0"
              onClick={() => onRate('thumbs-up')}
              size="sm"
              variant="ghost"
            >
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button
              className="h-6 w-6 p-0"
              onClick={() => onRate('thumbs-down')}
              size="sm"
              variant="ghost"
            >
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </>
        )}

        {children}
      </div>

      {onRegenerate && (
        <Button
          className="h-6 px-2 text-xs"
          disabled={isRegenerating}
          onClick={onRegenerate}
          size="sm"
          variant="ghost"
        >
          <RefreshCw
            className={cn('mr-1 h-2 w-2', isRegenerating && 'animate-spin')}
          />
        </Button>
      )}
    </div>
  );
}
