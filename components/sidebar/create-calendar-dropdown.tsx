'use client';

import { Plus } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useCalendarManagement } from '@/hooks/use-calendar-management';

interface CreateCalendarDropdownProps {
	onCalendarCreated: () => void;
}

export function CreateCalendarDropdown({ onCalendarCreated }: CreateCalendarDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [formData, setFormData] = useState({
		summary: '',
		description: '',
		timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		colorId: '1', // Default to first color
	});

	const { createCalendar, colorOptions } = useCalendarManagement();

	useEffect(() => {
		if (colorOptions.length > 0 && !formData.colorId) {
			setFormData(prev => ({ ...prev, colorId: colorOptions[0].id }));
		}
	}, [colorOptions, formData.colorId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.summary.trim()) {
			toast.error('Calendar name is required');
			return;
		}

		setIsCreating(true);
		try {
			await createCalendar(formData);
			toast.success('Calendar created successfully');
			setFormData({
				summary: '',
				description: '',
				timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				colorId: '1',
			});
			setIsOpen(false);
			onCalendarCreated();
		} catch (error) {
			console.error('Error creating calendar:', error);
			toast.error('Failed to create calendar');
		} finally {
			setIsCreating(false);
		}
	};

	const handleCancel = () => {
		setFormData({
			summary: '',
			description: '',
			timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
			colorId: '1',
		});
		setIsOpen(false);
	};

	return (
		<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary cursor-pointer"
				>
					<Plus className="h-2 w-2 text-muted-foreground" />
					<span className="sr-only">Create new calendar</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" side="right" className="w-64 p-3 bg-white dark:bg-neutral-950">
				<form onSubmit={handleSubmit} className="space-y-3">
					<div>
						<Label htmlFor="calendar-name" className="text-sm font-medium">
							Calendar Name *
						</Label>
						<Input
							id="calendar-name"
							type="text"
							placeholder="My Calendar"
							value={formData.summary}
							onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
							className="mt-1 data-[state=active]:ring-0"
							required
						/>
					</div>
					
					<div>
						<Label htmlFor="calendar-description" className="text-sm font-medium">
							Description
						</Label>
						<Input
							id="calendar-description"
							type="text"
							placeholder="Optional description"
							value={formData.description}
							onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
							className="mt-1"
						/>
					</div>

					<div>
						<Label className="text-sm font-medium mb-2 block">Color</Label>
						<div className="grid grid-cols-8 gap-1.5">
							{colorOptions.length > 0 ? (
								colorOptions.map((option) => (
									<button
										key={option.id}
										type="button"
										className={`h-5 w-5 rounded-full cursor-pointer transition-all duration-150 hover:scale-105 ${
											formData.colorId === option.id 
												? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-neutral-950' 
												: 'ring-1 ring-neutral-300 dark:ring-neutral-600 hover:ring-neutral-400 dark:hover:ring-white/60'
										}`}
										style={{ backgroundColor: option.background }}
										onClick={() => setFormData(prev => ({ ...prev, colorId: option.id }))}
										aria-label={`Select color ${option.id}`}
									/>
								))
							) : (
								<div className="col-span-6 text-xs text-muted-foreground py-2 text-center">Loading...</div>
							)}
						</div>
					</div>

					<div className="flex gap-2 pt-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={handleCancel}
							disabled={isCreating}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isCreating || !formData.summary.trim() || !formData.colorId}
							className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
						>
							{isCreating ? 'Creating...' : 'Create'}
						</Button>
					</div>
				</form>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
