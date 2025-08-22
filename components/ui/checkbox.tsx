'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const getColorClasses = (color?: string) => {
  if (!color) return '';
  if (color.startsWith('#')) {
    return 'bg-[var(--cb)] border-[var(--cb)] dark:bg-[var(--cb)] dark:border-[var(--cb)]';
  }

  const colorMap: Record<string, string> = {
    'bg-blue-500':
      'bg-blue-500 border-blue-500 dark:bg-blue-500 dark:border-blue-500',
    'bg-green-500':
      'bg-green-500 border-green-500 dark:bg-green-500 dark:border-green-500',
    'bg-red-500':
      'bg-red-500 border-red-500 dark:bg-red-500 dark:border-red-500',
    'bg-yellow-500':
      'bg-yellow-500 border-yellow-500 dark:bg-yellow-500 dark:border-yellow-500',
    'bg-purple-500':
      'bg-purple-500 border-purple-500 dark:bg-purple-500 dark:border-purple-500',
    'bg-orange-500':
      'bg-orange-500 border-orange-500 dark:bg-orange-500 dark:border-orange-500',
    'bg-pink-500':
      'bg-pink-500 border-pink-500 dark:bg-pink-500 dark:border-pink-500',
    'bg-indigo-500':
      'bg-indigo-500 border-indigo-500 dark:bg-indigo-500 dark:border-indigo-500',
    'bg-teal-500':
      'bg-teal-500 border-teal-500 dark:bg-teal-500 dark:border-teal-500',
    'bg-cyan-500':
      'bg-cyan-500 border-cyan-500 dark:bg-cyan-500 dark:border-cyan-500',
    'bg-lime-500':
      'bg-lime-500 border-lime-500 dark:bg-lime-500 dark:border-lime-500',
    'bg-amber-500':
      'bg-amber-500 border-amber-500 dark:bg-amber-500 dark:border-amber-500',
    'bg-emerald-500':
      'bg-emerald-500 border-emerald-500 dark:bg-emerald-500 dark:border-emerald-500',
    'bg-violet-500':
      'bg-violet-500 border-violet-500 dark:bg-violet-500 dark:border-violet-500',
    'bg-rose-500':
      'bg-rose-500 border-rose-500 dark:bg-rose-500 dark:border-rose-500',
    'bg-slate-500':
      'bg-slate-500 border-slate-500 dark:bg-slate-500 dark:border-slate-500',
    'bg-gray-500':
      'bg-gray-500 border-gray-500 dark:bg-gray-500 dark:border-gray-500',
    'bg-zinc-500':
      'bg-zinc-500 border-zinc-500 dark:bg-zinc-500 dark:border-zinc-500',
    'bg-neutral-500':
      'bg-neutral-500 border-neutral-500 dark:bg-neutral-500 dark:border-neutral-500',
  };

  return colorMap[color] || '';
};

function Checkbox({
  className,
  color,
  ref,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  color?: string;
  ref?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs outline-none transition-shadow focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        getColorClasses(color),
        className
      )}
      data-slot="checkbox"
      ref={ref}
      style={
        color && color.startsWith('#')
          ? ({ ['--cb' as any]: color } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          'flex items-center justify-center text-current transition-none'
        )}
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
