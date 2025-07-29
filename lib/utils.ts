import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Ensures a value is a Date object, converting from string if necessary.
 *
 * @param date - The date value to ensure is a Date object.
 * @returns A Date object.
 */
export function ensureDate(date: Date | string): Date {
  return date instanceof Date ? date : new Date(date);
}
