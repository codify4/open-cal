import type { CalendarEntry, EmailAccount, ColorOption } from '@/types/calendar';

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
	if (calendar.backgroundColor && typeof calendar.backgroundColor === 'string') {
		return calendar.backgroundColor;
	}

	if (googleColorMap && calendar.colorId && googleColorMap[String(calendar.colorId)]) {
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

export const emailColorFromString = (
	email: string
): EmailAccount['color'] => {
	const palette: EmailAccount['color'][] = [
		'blue',
		'green',
		'red',
		'yellow',
		'purple',
		'orange',
	];
	let hash = 0;
	for (let i = 0; i < email.length; i++) hash = (hash + email.charCodeAt(i)) % 2147483647;
	return palette[hash % palette.length];
};

const hexToHsl = (hex: string) => {
	const n = hex.replace('#', '');
	const bigint = parseInt(n.length === 3 ? n.split('').map((c) => c + c).join('') : n, 16);
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

export const arrangeWarmToCoolGrid = (
	options: ColorOption[]
) => {
	const colorGroups: { [key: string]: { id: string; background: string; hue: number; saturation: number; lightness: number }[] } = {
		red: [],
		orange: [],
		yellow: [],
		green: [],
		blue: [],
		purple: [],
		pink: [],
		neutral: []
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

	const sortGroup = (group: { id: string; background: string; hue: number; saturation: number; lightness: number }[]) => {
		return group.sort((a, b) => {
			if (Math.abs(a.saturation - b.saturation) > 0.15) {
				return b.saturation - a.saturation;
			}
			return a.lightness - b.lightness;
		});
	};

	Object.keys(colorGroups).forEach(key => {
		colorGroups[key] = sortGroup(colorGroups[key]);
	});

	const orderedGroups = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'neutral'];

	return orderedGroups.flatMap(groupName =>
		colorGroups[groupName].map(({ hue, saturation, lightness, ...rest }) => rest)
	);
};


export const getCardColor = (color: string, focused: boolean = false) => {
    const colorMap: Record<string, string> = {
      // Primary colors
      blue: focused ? 'bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:text-blue-50' : 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:bg-blue-500/40 dark:text-blue-100',
      green: focused ? 'bg-green-500 border-green-600 text-white dark:bg-green-600 dark:text-green-50' : 'bg-green-500/20 border-green-500/30 text-green-700 dark:bg-green-500/40 dark:text-green-100',
      red: focused ? 'bg-red-500 border-red-600 text-white dark:bg-red-600 dark:text-red-50' : 'bg-red-500/20 border-red-500/30 text-red-700 dark:bg-red-500/40 dark:text-red-100',
      yellow: focused ? 'bg-yellow-500 border-yellow-600 text-white dark:bg-yellow-600 dark:text-yellow-50' : 'bg-yellow-500/20 border-yellow-500/30 text-yellow-700 dark:bg-yellow-500/40 dark:text-yellow-100',
      purple: focused ? 'bg-purple-500 border-purple-600 text-white dark:bg-purple-600 dark:text-purple-50' : 'bg-purple-500/20 border-purple-500/30 text-purple-700 dark:bg-purple-500/40 dark:text-purple-100',
      orange: focused ? 'bg-orange-500 border-orange-600 text-white dark:bg-orange-600 dark:text-orange-50' : 'bg-orange-500/20 border-orange-500/30 text-orange-700 dark:bg-orange-500/40 dark:text-orange-100',
      pink: focused ? 'bg-pink-500 border-pink-600 text-white dark:bg-pink-600 dark:text-pink-50' : 'bg-pink-500/20 border-pink-500/30 text-pink-700 dark:bg-pink-500/40 dark:text-pink-100',
      gray: focused ? 'bg-gray-500 border-gray-600 text-white dark:bg-gray-600 dark:text-gray-50' : 'bg-gray-500/20 border-gray-500/30 text-gray-700 dark:bg-gray-500/40 dark:text-gray-100',
      
      // Extended colors
      indigo: focused ? 'bg-indigo-500 border-indigo-600 text-white dark:bg-indigo-600 dark:text-indigo-50' : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-700 dark:bg-indigo-500/40 dark:text-indigo-100',
      teal: focused ? 'bg-teal-500 border-teal-600 text-white dark:bg-teal-600 dark:text-teal-50' : 'bg-teal-500/20 border-teal-500/30 text-teal-700 dark:bg-teal-500/40 dark:text-teal-100',
      cyan: focused ? 'bg-cyan-500 border-cyan-600 text-white dark:bg-cyan-600 dark:text-cyan-50' : 'bg-cyan-500/20 border-cyan-500/30 text-cyan-700 dark:bg-cyan-500/40 dark:text-cyan-100',
      lime: focused ? 'bg-lime-500 border-lime-600 text-white dark:bg-lime-600 dark:text-lime-50' : 'bg-lime-500/20 border-lime-500/30 text-lime-700 dark:bg-lime-500/40 dark:text-lime-100',
      amber: focused ? 'bg-amber-500 border-amber-600 text-white dark:bg-amber-600 dark:text-amber-50' : 'bg-amber-500/20 border-amber-500/30 text-amber-700 dark:bg-amber-500/40 dark:text-amber-100',
      emerald: focused ? 'bg-emerald-500 border-emerald-600 text-white dark:bg-emerald-600 dark:text-emerald-50' : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/40 dark:text-emerald-100',
      violet: focused ? 'bg-violet-500 border-violet-600 text-white dark:bg-violet-600 dark:text-violet-50' : 'bg-violet-500/20 border-violet-500/30 text-violet-700 dark:bg-violet-500/40 dark:text-violet-100',
      rose: focused ? 'bg-rose-500 border-rose-600 text-white dark:bg-rose-600 dark:text-rose-50' : 'bg-rose-500/20 border-rose-500/30 text-rose-700 dark:bg-rose-500/40 dark:text-rose-100',
      slate: focused ? 'bg-slate-500 border-slate-600 text-white dark:bg-slate-600 dark:text-slate-50' : 'bg-slate-500/20 border-slate-500/30 text-slate-700 dark:bg-slate-500/40 dark:text-slate-100',
      zinc: focused ? 'bg-zinc-500 border-zinc-600 text-white dark:bg-zinc-600 dark:text-zinc-50' : 'bg-zinc-500/20 border-zinc-500/30 text-zinc-700 dark:bg-zinc-500/40 dark:text-zinc-100',
      neutral: focused ? 'bg-neutral-500 border-neutral-600 text-white dark:bg-neutral-600 dark:text-neutral-50' : 'bg-neutral-500/20 border-neutral-500/30 text-neutral-700 dark:bg-neutral-500/40 dark:text-neutral-100',
      stone: focused ? 'bg-stone-500 border-stone-600 text-white dark:bg-stone-600 dark:text-stone-50' : 'bg-stone-500/20 border-stone-500/30 text-stone-700 dark:bg-stone-500/40 dark:text-stone-100',
      sky: focused ? 'bg-sky-500 border-sky-600 text-white dark:bg-sky-600 dark:text-sky-50' : 'bg-sky-500/20 border-sky-500/30 text-sky-700 dark:bg-sky-500/40 dark:text-sky-100',
      fuchsia: focused ? 'bg-fuchsia-500 border-fuchsia-600 text-white dark:bg-fuchsia-600 dark:text-fuchsia-50' : 'bg-fuchsia-500/20 border-fuchsia-500/30 text-fuchsia-700 dark:bg-fuchsia-500/40 dark:text-fuchsia-100',
    };
    return colorMap[color] || colorMap.blue;
}