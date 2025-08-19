'use client';

interface PendingToolProps {
  toolName: string;
}

export function PendingTool({ toolName }: PendingToolProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-gray-50 p-4 dark:bg-gray-900">
      <div className="h-4 w-4 animate-spin rounded-full border-blue-600 border-b-2" />
      <span className="text-gray-600 text-sm dark:text-gray-400">
        Processing {toolName}...
      </span>
    </div>
  );
}
