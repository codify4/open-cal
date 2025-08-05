'use client';

interface PendingToolProps {
  toolName: string;
}

export function PendingTool({ toolName }: PendingToolProps) {
  return (
    <div className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        Processing {toolName}...
      </span>
    </div>
  );
} 