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
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
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

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuAction
					showOnHover
					className="h-5 w-5 p-0 hover:bg-transparent hover:text-primary cursor-pointer ml-auto"
					onClick={(e) => e.stopPropagation()}
				>
					<MoreHorizontal className="h-3 w-3" />
					<span className="sr-only">Calendar actions</span>
				</SidebarMenuAction>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="right" className="w-48 bg-neutral-950" onClick={(e) => e.stopPropagation()}>
				<div className="px-2 py-1 text-xs text-muted-foreground">Color</div>
				<div className="grid grid-cols-6 gap-2 px-2 pb-2">
					{colorOptions.map((option) => (
						<button
							key={option.id}
							type="button"
							className="h-4 w-4 rounded border cursor-pointer hover:scale-110 transition-transform duration-100"
							style={{ backgroundColor: option.background, borderColor: option.background }}
							onClick={() => handleColorChange(option.id)}
							aria-label={`Set color ${option.id}`}
						/>
					))}
				</div>
				{!calendar.primary && (
					<>
						<DropdownMenuSeparator className="mx-1" />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500 cursor-pointer flex items-center gap-2" onClick={handleDelete}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                            Delete
                        </DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
