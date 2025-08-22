'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCalendarManagement } from '@/hooks/use-calendar-management';
import { useIsMobile } from '@/hooks/use-mobile';

interface CreateCalendarDropdownProps {
  onCalendarCreated: () => void;
  targetAccount?: string;
}

export function CreateCalendarDropdown({
  onCalendarCreated,
  targetAccount,
}: CreateCalendarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const isMobile = useIsMobile();
  const [formData, setFormData] = useState({
    summary: '',
    description: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    colorId: '1', // Default to first color
  });

  const { createCalendarForAccount, colorOptions } = useCalendarManagement();

  useEffect(() => {
    if (colorOptions.length > 0 && !formData.colorId) {
      setFormData((prev) => ({ ...prev, colorId: colorOptions[0].id }));
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
      await createCalendarForAccount(formData, targetAccount);
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
    <DropdownMenu onOpenChange={setIsOpen} open={isOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-6 w-6 cursor-pointer p-0 hover:bg-primary/10 hover:text-primary"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-2 w-2 text-muted-foreground" />
          <span className="sr-only">Create new calendar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 bg-white p-3 dark:bg-neutral-950"
        side={isMobile ? "bottom" : "right"}
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <Label className="font-medium text-sm" htmlFor="calendar-name">
              Calendar Name *
            </Label>
            <Input
              className="mt-1 data-[state=active]:ring-0"
              id="calendar-name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, summary: e.target.value }))
              }
              placeholder="My Calendar"
              required
              type="text"
              value={formData.summary}
            />
          </div>

          <div>
            <Label
              className="font-medium text-sm"
              htmlFor="calendar-description"
            >
              Description
            </Label>
            <Input
              className="mt-1"
              id="calendar-description"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Optional description"
              type="text"
              value={formData.description}
            />
          </div>

          <div>
            <Label className="mb-2 block font-medium text-sm">Color</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {colorOptions.length > 0 ? (
                colorOptions.map((option) => (
                  <button
                    aria-label={`Select color ${option.id}`}
                    className={`h-5 w-5 cursor-pointer rounded-full transition-all duration-150 hover:scale-105 ${
                      formData.colorId === option.id
                        ? 'ring-2 ring-black ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-neutral-950'
                        : 'ring-1 ring-neutral-300 hover:ring-neutral-400 dark:ring-neutral-600 dark:hover:ring-white/60'
                    }`}
                    key={option.id}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, colorId: option.id }))
                    }
                    style={{ backgroundColor: option.background }}
                    type="button"
                  />
                ))
              ) : (
                <div className="col-span-6 py-2 text-center text-muted-foreground text-xs">
                  Loading...
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              disabled={isCreating}
              onClick={handleCancel}
              size="sm"
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={
                isCreating || !formData.summary.trim() || !formData.colorId
              }
              size="sm"
              type="submit"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
