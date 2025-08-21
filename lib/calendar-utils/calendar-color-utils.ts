import type {
  CalendarEntry,
  ColorOption,
  EmailAccount,
} from '@/types/calendar';

export const getColorClasses = (
  color: CalendarEntry['color'] | EmailAccount['color']
) => {
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  return colorMap[color];
};

export const getCalendarColor = (
  calendar: any,
  googleColorMap?: Record<string, string>
) => {
  if (
    calendar.backgroundColor &&
    typeof calendar.backgroundColor === 'string'
  ) {
    return calendar.backgroundColor;
  }

  if (
    googleColorMap &&
    calendar.colorId &&
    googleColorMap[String(calendar.colorId)]
  ) {
    return googleColorMap[String(calendar.colorId)];
  }

  const tailwindFallback: Record<string, string> = {
    '1': 'bg-blue-500',
    '2': 'bg-green-500',
    '3': 'bg-red-500',
    '4': 'bg-yellow-500',
    '5': 'bg-purple-500',
    '6': 'bg-orange-500',
    '7': 'bg-pink-500',
    '8': 'bg-indigo-500',
    '9': 'bg-teal-500',
    '10': 'bg-cyan-500',
    '11': 'bg-lime-500',
    '12': 'bg-amber-500',
    '13': 'bg-emerald-500',
    '14': 'bg-violet-500',
    '15': 'bg-rose-500',
    '16': 'bg-slate-500',
    '17': 'bg-gray-500',
    '18': 'bg-zinc-500',
    '19': 'bg-neutral-500',
    '20': 'bg-stone-500',
  };

  return tailwindFallback[String(calendar.colorId)] || 'bg-blue-500';
};

export const emailColorFromString = (email: string): EmailAccount['color'] => {
  const palette: EmailAccount['color'][] = [
    'blue',
    'green',
    'red',
    'yellow',
    'purple',
    'orange',
  ];
  let hash = 0;
  for (let i = 0; i < email.length; i++)
    hash = (hash + email.charCodeAt(i)) % 2_147_483_647;
  return palette[hash % palette.length];
};

const hexToHsl = (hex: string) => {
  const n = hex.replace('#', '');
  const bigint = Number.parseInt(
    n.length === 3
      ? n
          .split('')
          .map((c) => c + c)
          .join('')
      : n,
    16
  );
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h, s, l };
};

export const arrangeWarmToCoolGrid = (options: ColorOption[]) => {
  const colorGroups: {
    [key: string]: {
      id: string;
      background: string;
      hue: number;
      saturation: number;
      lightness: number;
    }[];
  } = {
    red: [],
    orange: [],
    yellow: [],
    green: [],
    blue: [],
    purple: [],
    pink: [],
    neutral: [],
  };

  for (const option of options) {
    const { h, s, l } = hexToHsl(option.background);
    const hue = h * 360;

    if (s < 0.2) {
      colorGroups.neutral.push({ ...option, hue, saturation: s, lightness: l });
    } else if (hue >= 330 || hue < 15) {
      colorGroups.red.push({ ...option, hue, saturation: s, lightness: l });
    } else if (hue >= 15 && hue < 45) {
      colorGroups.orange.push({ ...option, hue, saturation: s, lightness: l });
    } else if (hue >= 45 && hue < 75) {
      colorGroups.yellow.push({ ...option, hue, saturation: s, lightness: l });
    } else if (hue >= 75 && hue < 150) {
      colorGroups.green.push({ ...option, hue, saturation: s, lightness: l });
    } else if (hue >= 150 && hue < 270) {
      colorGroups.blue.push({ ...option, hue, saturation: s, lightness: l });
    } else if (hue >= 270 && hue < 315) {
      colorGroups.purple.push({ ...option, hue, saturation: s, lightness: l });
    } else {
      colorGroups.pink.push({ ...option, hue, saturation: s, lightness: l });
    }
  }

  const sortGroup = (
    group: {
      id: string;
      background: string;
      hue: number;
      saturation: number;
      lightness: number;
    }[]
  ) => {
    return group.sort((a, b) => {
      if (Math.abs(a.saturation - b.saturation) > 0.15) {
        return b.saturation - a.saturation;
      }
      return a.lightness - b.lightness;
    });
  };

  Object.keys(colorGroups).forEach((key) => {
    colorGroups[key] = sortGroup(colorGroups[key]);
  });

  const orderedGroups = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'neutral',
  ];

  return orderedGroups.flatMap((groupName) =>
    colorGroups[groupName].map(
      ({ hue, saturation, lightness, ...rest }) => rest
    )
  );
};

export const getCardColor = (color: string, focused = false) => {
  const colorMap: Record<string, string> = {
    // Primary colors
    blue: focused
      ? 'bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:text-blue-50'
      : 'bg-blue-200 border-blue-500/30 text-blue-700 dark:bg-blue-500/50 dark:text-blue-100',
    green: focused
      ? 'bg-green-500 border-green-600 text-white dark:bg-green-600 dark:text-green-50'
      : 'bg-green-200 border-green-500/30 text-green-700 dark:bg-green-500/50 dark:text-green-100',
    red: focused
      ? 'bg-red-500 border-red-600 text-white dark:bg-red-600 dark:text-red-50'
      : 'bg-red-200 border-red-500/30 text-red-700 dark:bg-red-500/50 dark:text-red-100',
    yellow: focused
      ? 'bg-yellow-500 border-yellow-600 text-white dark:bg-yellow-600 dark:text-yellow-50'
      : 'bg-yellow-200 border-yellow-500/30 text-yellow-700 dark:bg-yellow-500/50 dark:text-yellow-100',
    purple: focused
      ? 'bg-purple-500 border-purple-600 text-white dark:bg-purple-600 dark:text-purple-50'
      : 'bg-purple-200 border-purple-500/30 text-purple-700 dark:bg-purple-500/50 dark:text-purple-100',
    orange: focused
      ? 'bg-orange-500 border-orange-600 text-white dark:bg-orange-600 dark:text-orange-50'
      : 'bg-orange-200 border-orange-500/30 text-orange-700 dark:bg-orange-500/50 dark:text-orange-100',
    pink: focused
      ? 'bg-pink-500 border-pink-600 text-white dark:bg-pink-600 dark:text-pink-50'
      : 'bg-pink-200 border-pink-500/30 text-pink-700 dark:bg-pink-500/50 dark:text-pink-100',
    gray: focused
      ? 'bg-gray-500 border-gray-600 text-white dark:bg-gray-600 dark:text-gray-50'
      : 'bg-gray-200 border-gray-500/30 text-gray-700 dark:bg-gray-500/50 dark:text-gray-100',

    // Extended colors
    indigo: focused
      ? 'bg-indigo-500 border-indigo-600 text-white dark:bg-indigo-600 dark:text-indigo-50'
      : 'bg-indigo-200 border-indigo-500/30 text-indigo-700 dark:bg-indigo-500/50 dark:text-indigo-100',
    teal: focused
      ? 'bg-teal-500 border-teal-600 text-white dark:bg-teal-600 dark:text-teal-50'
      : 'bg-teal-200 border-teal-500/30 text-teal-700 dark:bg-teal-500/50 dark:text-teal-100',
    cyan: focused
      ? 'bg-cyan-500 border-cyan-600 text-white dark:bg-cyan-600 dark:text-cyan-50'
      : 'bg-cyan-200 border-cyan-500/30 text-cyan-700 dark:bg-cyan-500/50 dark:text-cyan-100',
    lime: focused
      ? 'bg-lime-500 border-lime-600 text-white dark:bg-lime-600 dark:text-lime-50'
      : 'bg-lime-200 border-lime-500/30 text-lime-700 dark:bg-lime-500/50 dark:text-lime-100',
    amber: focused
      ? 'bg-amber-500 border-amber-600 text-white dark:bg-amber-600 dark:text-amber-50'
      : 'bg-amber-200 border-amber-500/30 text-amber-700 dark:bg-amber-500/50 dark:text-amber-100',
    emerald: focused
      ? 'bg-emerald-500 border-emerald-600 text-white dark:bg-emerald-600 dark:text-emerald-50'
      : 'bg-emerald-200 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/50 dark:text-emerald-100',
    violet: focused
      ? 'bg-violet-500 border-violet-600 text-white dark:bg-violet-600 dark:text-violet-50'
      : 'bg-violet-200 border-violet-500/30 text-violet-700 dark:bg-violet-500/50 dark:text-violet-100',
    rose: focused
      ? 'bg-rose-500 border-rose-600 text-white dark:bg-rose-600 dark:text-rose-50'
      : 'bg-rose-200 border-rose-500/30 text-rose-700 dark:bg-rose-500/50 dark:text-rose-100',
    slate: focused
      ? 'bg-slate-500 border-slate-600 text-white dark:bg-slate-600 dark:text-slate-50'
      : 'bg-slate-200 border-slate-500/30 text-slate-700 dark:bg-slate-500/50 dark:text-slate-100',
    zinc: focused
      ? 'bg-zinc-500 border-zinc-600 text-white dark:bg-zinc-600 dark:text-zinc-50'
      : 'bg-zinc-200 border-zinc-500/30 text-zinc-700 dark:bg-zinc-500/50 dark:text-zinc-100',
    neutral: focused
      ? 'bg-neutral-500 border-neutral-600 text-white dark:bg-neutral-600 dark:text-neutral-50'
      : 'bg-neutral-200 border-neutral-500/30 text-neutral-700 dark:bg-neutral-500/50 dark:text-neutral-100',
    sky: focused
      ? 'bg-sky-500 border-sky-600 text-white dark:bg-sky-600 dark:text-sky-50'
      : 'bg-sky-200 border-sky-500/30 text-sky-700 dark:bg-sky-500/50 dark:text-sky-100',
    fuchsia: focused
      ? 'bg-fuchsia-500 border-fuchsia-600 text-white dark:bg-fuchsia-600 dark:text-fuchsia-50'
      : 'bg-fuchsia-200 border-fuchsia-500/30 text-fuchsia-700 dark:bg-fuchsia-500/50 dark:text-fuchsia-100',
  };
  return colorMap[color] || colorMap.blue;
};

export const getActualColor = (colorValue: string) => {
    if (colorValue.startsWith('#')) {
      return colorValue;
    }
    if (colorValue.startsWith('rgb')) {
      return colorValue;
    }
    
    const tailwindToHex: Record<string, string> = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-red-500': '#ef4444',
      'bg-yellow-500': '#eab308',
      'bg-purple-500': '#8b5cf6',
      'bg-orange-500': '#f97316',
      'bg-pink-500': '#ec4899',
      'bg-indigo-500': '#6366f1',
      'bg-teal-500': '#14b8a6',
      'bg-cyan-500': '#06b6d4',
      'bg-lime-500': '#84cc16',
      'bg-amber-500': '#f59e0b',
      'bg-emerald-500': '#10b981',
      'bg-violet-500': '#8b5cf6',
      'bg-rose-500': '#f43f5e',
      'bg-slate-500': '#64748b',
      'bg-gray-500': '#6b7280',
      'bg-zinc-500': '#71717a',
      'bg-neutral-500': '#737373',
      'bg-stone-500': '#78716c',
    };
    
    return tailwindToHex[colorValue] || '#3b82f6';
  };
  
export const getEventReferenceChipColor = (color: string) => {
    const colorMap: Record<string, string> = {
      // Primary colors
      blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/50',
      green: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/50',
      red: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800/50',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800/50',
      purple: 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800/50',
      orange: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800/50',
      pink: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-800/50',
      gray: 'bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800/50',
  
      // Extended colors
      indigo: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800/50',
      teal: 'bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200 border-teal-200 dark:border-teal-800/50',
      cyan: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800/50',
      lime: 'bg-lime-100 dark:bg-lime-900/50 text-lime-800 dark:text-lime-200 border-lime-200 dark:border-lime-800/50',
      amber: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800/50',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/50',
      violet: 'bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 border-violet-200 dark:border-violet-800/50',
      rose: 'bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800/50',
      slate: 'bg-slate-100 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800/50',
      zinc: 'bg-zinc-100 dark:bg-zinc-900/50 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800/50',
      neutral: 'bg-neutral-100 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800/50',
      sky: 'bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-200 border-sky-200 dark:border-sky-800/50',
      fuchsia: 'bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-800 dark:text-fuchsia-200 border-fuchsia-200 dark:border-fuchsia-800/50',
    };
    
    return colorMap[color] || colorMap.blue;
};

export const getDotColor = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500', 
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      pink: 'bg-pink-500',
      gray: 'bg-gray-500',
      indigo: 'bg-indigo-500',
      teal: 'bg-teal-500',
      cyan: 'bg-cyan-500',
      lime: 'bg-lime-500',
      amber: 'bg-amber-500',
      emerald: 'bg-emerald-500',
      violet: 'bg-violet-500',
      rose: 'bg-rose-500',
      slate: 'bg-slate-500',
      zinc: 'bg-zinc-500',
      neutral: 'bg-neutral-500',
      sky: 'bg-sky-500',
      fuchsia: 'bg-fuchsia-500',
    };
    return colorMap[color] || 'bg-blue-500';
  };