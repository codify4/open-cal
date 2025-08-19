'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuAction } from '@/components/ui/sidebar';
import type { ColorOption, GoogleCalendar } from '@/types/calendar';

interface CalendarDropdownProps {
  calendar: GoogleCalendar;
  colorOptions: ColorOption[];
  onColorChange: (calendarId: string, colorId: string) => void;
  onDelete: (calendarId: string) => void;
}

export function CalendarDropdown({
  calendar,
  colorOptions,
  onColorChange,
  onDelete,
}: CalendarDropdownProps) {
  const handleColorChange = (colorId: string) => {
    onColorChange(calendar.id, colorId);
  };

  const handleDelete = () => {
    onDelete(calendar.id);
  };

  const canModify =
    calendar.accessRole === 'owner' || calendar.accessRole === 'writer';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          className="ml-auto h-5 w-5 cursor-pointer p-0 hover:bg-transparent hover:text-primary"
          onClick={(e) => e.stopPropagation()}
          showOnHover
        >
          <MoreHorizontal className="h-3 w-3" />
          <span className="sr-only">Calendar actions</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-48 bg-white dark:bg-neutral-950"
        onClick={(e) => e.stopPropagation()}
        side="right"
      >
        {canModify && (
          <>
            <div className="px-2 py-1 text-muted-foreground text-xs">Color</div>
            <div className="grid grid-cols-6 gap-2 px-2 pb-2">
              {colorOptions.map((option) => (
                <button
                  aria-label={`Set color ${option.id}`}
                  className="h-4 w-4 cursor-pointer rounded border transition-transform duration-100 hover:scale-110"
                  key={option.id}
                  onClick={() => handleColorChange(option.id)}
                  style={{
                    backgroundColor: option.background,
                    borderColor: option.background,
                  }}
                  type="button"
                />
              ))}
            </div>
          </>
        )}
        {!calendar.primary && canModify && (
          <>
            {canModify && <DropdownMenuSeparator className="mx-1" />}
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 text-red-500 focus:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
              Delete
            </DropdownMenuItem>
          </>
        )}
        {!canModify && (
          <div className="px-2 py-1 text-muted-foreground text-xs">
            Read-only calendar
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
