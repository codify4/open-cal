'use client';

import { Terminal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageFooter } from '../message-footer';

interface DefaultToolProps {
  toolName: string;
  args: any;
  result?: any;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onCopy?: () => void;
  onRate?: (rating: 'thumbs-up' | 'thumbs-down') => void;
}

export function DefaultTool({
  toolName,
  args,
  result,
  onRegenerate,
  isRegenerating,
  onCopy,
  onRate,
}: DefaultToolProps) {
  return (
    <div>
      <Card className="bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            {toolName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Arguments:</span>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
            {result && (
              <div>
                <span className="font-medium">Result:</span>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-1">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <MessageFooter
        onRegenerate={onRegenerate}
        isRegenerating={isRegenerating}
        onCopy={onCopy}
        onRate={onRate}
      />
    </div>
  );
} 