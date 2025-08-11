'use client';

import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const getColorClasses = (color?: string) => {
  if (!color) return '';

  const colorMap: Record<string, string> = {
    'bg-blue-500':
      'data-[state=checked]:bg-blue-500 border-blue-500',
    'bg-green-500':
      'data-[state=checked]:bg-green-500 border-green-500',
    'bg-red-500': 
        'data-[state=checked]:bg-red-500 border-red-500',
    'bg-yellow-500':
      'data-[state=checked]:bg-yellow-500 border-yellow-500',
    'bg-purple-500':
      'data-[state=checked]:bg-purple-500 border-purple-500',
    'bg-orange-500':
      'data-[state=checked]:bg-orange-500 border-orange-500',
    'bg-pink-500':
      'data-[state=checked]:bg-pink-500 border-pink-500',
    'bg-indigo-500':
      'data-[state=checked]:bg-indigo-500 border-indigo-500',
    'bg-teal-500':
      'data-[state=checked]:bg-teal-500 border-teal-500',
    'bg-cyan-500':
      'data-[state=checked]:bg-cyan-500 border-cyan-500',
    'bg-lime-500':
      'data-[state=checked]:bg-lime-500 border-lime-500',
    'bg-amber-500':
      'data-[state=checked]:bg-amber-500 border-amber-500',
    'bg-emerald-500':
      'data-[state=checked]:bg-emerald-500 border-emerald-500',
    'bg-violet-500':
      'data-[state=checked]:bg-violet-500 border-violet-500',
    'bg-rose-500':
      'data-[state=checked]:bg-rose-500 border-rose-500',
    'bg-slate-500':
      'data-[state=checked]:bg-slate-500 border-slate-500',
    'bg-gray-500':
      'data-[state=checked]:bg-gray-500 border-gray-500',
    'bg-zinc-500':
      'data-[state=checked]:bg-zinc-500 border-zinc-500',
    'bg-neutral-500':
      'data-[state=checked]:bg-neutral-500 border-neutral-500',
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
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn(
          'flex items-center justify-center text-current transition-none',
          color
        )}
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
