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
