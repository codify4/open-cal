'use client';

import { ChevronRight, Plus } from 'lucide-react';
import * as React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Checkbox } from '../ui/checkbox';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { SidebarGroupContent } from '@/components/ui/sidebar';
import { useCalendarStore } from '@/providers/calendar-store-provider';

export interface CalendarEntry {
	id: string;
	name: string;
	color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' ;
	isVisible: boolean;
	type: 'calendar' | 'class' | 'project';
}

export interface EmailAccount {
	email: string;
	isDefault: boolean;
	color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}

export interface NavCalendarsProps {
	emailAccounts: EmailAccount[];
	calendars: CalendarEntry[];
	selectedEmail: string;
	onEmailChange: (email: string) => void;
	onCalendarToggle: (calendarId: string) => void;
	onCalendarsFetched?: (calendars: any[]) => void;
	user?: { name: string; email: string; avatar: string };
}

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

export const getCalendarColor = (calendar: any) => {
	const colorMap: Record<string, string> = {
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
	
	return colorMap[calendar.colorId] || 'bg-blue-500';
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

export function NavCalendars({
	emailAccounts,
	calendars: propCalendars,
	selectedEmail,
	onEmailChange,
	onCalendarToggle,
	onCalendarsFetched,
	user,
}: NavCalendarsProps) {
	const { isMobile } = useSidebar();
	const selectedAccount = emailAccounts.find(
		(acc) => acc.email === selectedEmail
	);
	const canAddMoreAccounts = Boolean(emailAccounts.length === 0);

	const { data: session } = authClient.useSession();
	const [fetchedCalendars, setFetchedCalendars] = React.useState<any[]>([]);
	const [isLoadingCalendars, setIsLoadingCalendars] = React.useState(false);
	const [visibleCalendars, setVisibleCalendars] = React.useState<Set<string>>(new Set());

	// Sync with calendar store
	const { setVisibleCalendarIds } = useCalendarStore((state) => state);

	const fetchCalendars = React.useCallback(async () => {
		if (!session?.user?.id) return;
		
		setIsLoadingCalendars(true);
		try {
			const accessToken = await authClient.getAccessToken({
				providerId: 'google',
				userId: session.user.id,
			});
			
			if (!accessToken?.data?.accessToken) {
				throw new Error('No access token available');
			}
			
			const url = `https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250&key=${process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY}`;
			
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken.data.accessToken}`,
					Accept: 'application/json',
				},
			});

			if (response.status === 401) {
				toast.error('Access token expired. Please reconnect your Google account.');
				await authClient.linkSocial({
					provider: 'google',
					scopes: [
						'https://www.googleapis.com/auth/calendar.events',
						'https://www.googleapis.com/auth/calendar.readonly',
						'https://www.googleapis.com/auth/calendar',
						'https://www.googleapis.com/auth/calendar.calendarlist',
						'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
						'https://www.googleapis.com/auth/calendar.freebusy',
					],
					callbackURL: `${window.location.origin}/calendar`,
					errorCallbackURL: `${window.location.origin}/calendar`,
				});
				return;
			}

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Error response:', errorText);
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const calendarListData = await response.json();
			console.log('Calendars fetched:', calendarListData);
			
			if (calendarListData.items && Array.isArray(calendarListData.items)) {
				const calendars = calendarListData.items;
				console.log('Raw calendars:', calendars.map((c: any) => ({ id: c.id, summary: c.summary, accessRole: c.accessRole })));
				
				const sortedCalendars = calendars.sort((a: any, b: any) => {
					if (a.accessRole === 'owner') return -1;
					if (b.accessRole === 'owner') return 1;
					if (a.id === 'primary') return -1;
					if (b.id === 'primary') return 1;
					return 0;
				});
				
				console.log('Sorted calendars:', sortedCalendars.map((c: any) => ({ id: c.id, summary: c.summary, accessRole: c.accessRole })));
				
				setFetchedCalendars(sortedCalendars);
				setVisibleCalendars(new Set(sortedCalendars.map((cal: any) => cal.id)));
				
				// Sync with calendar store
				setVisibleCalendarIds(sortedCalendars.map((cal: any) => cal.id));
				
				if (onCalendarsFetched) {
					onCalendarsFetched(sortedCalendars);
				}
			}
		} catch (error) {
			console.error('Failed to fetch calendars:', error);
			toast.error('Failed to fetch calendars');
		} finally {
			setIsLoadingCalendars(false);
		}
	}, [session?.user?.id, onCalendarsFetched]);

	const handleCalendarToggle = (calendarId: string) => {
		setVisibleCalendars(prev => {
			const newSet = new Set(prev);
			if (newSet.has(calendarId)) {
				newSet.delete(calendarId);
			} else {
				newSet.add(calendarId);
			}
			return newSet;
		});
		
		// Sync with calendar store
		const newVisibleCalendars = Array.from(visibleCalendars);
		if (newVisibleCalendars.includes(calendarId)) {
			setVisibleCalendarIds(newVisibleCalendars.filter(id => id !== calendarId));
		} else {
			setVisibleCalendarIds([...newVisibleCalendars, calendarId]);
		}
		
		onCalendarToggle(calendarId);
	};

	React.useEffect(() => {
		if (session?.user?.id) {
			fetchCalendars();
		}
	}, [fetchCalendars]);

	if (!session) {
		return (
			<SidebarGroup className="mt-0 group-data-[collapsible=icon]:hidden">
				<SidebarGroupLabel>Account</SidebarGroupLabel>
				<SidebarGroupContent>
					<Button
						variant="outline"
						size="sm"
						className='w-full justify-start'
						onClick={() =>
							authClient.signIn.social({ provider: 'google', callbackURL: `${window.location.origin}/calendar` })
						}
					>
						<Plus className="h-4 w-4 mr-2" />
						Add account
					</Button>
				</SidebarGroupContent>
			</SidebarGroup>
		);
	}

	return (
		<SidebarGroup className="mt-0 group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Account</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton className="w-full cursor-pointer justify-between rounded-sm py-5 hover:bg-primary/10 hover:text-primary focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent">
								<div className="flex items-center gap-2">
									<div
										className={`h-3 w-3 rounded-full ${getColorClasses(
											(selectedAccount?.color ?? emailColorFromString(selectedAccount?.email || user?.email || ''))
										)}`}
									/>
									<div className="flex flex-col items-start">
										<span className="truncate font-medium text-sm">
											{selectedAccount?.email || user?.email || 'Select Account'}
										</span>
										{selectedAccount?.isDefault && (
											<span className="text-muted-foreground text-xs">
												Default
											</span>
										)}
									</div>
								</div>
								<ChevronRight className="h-4 w-4 text-muted-foreground" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align={isMobile ? 'end' : 'start'}
							className="w-64 bg-neutral-100 dark:bg-neutral-950"
							side={isMobile ? 'bottom' : 'right'}
						>
							{emailAccounts.length === 0 && (
								<div className="px-3 py-2 text-sm text-muted-foreground">
									No accounts connected
								</div>
							)}
							{emailAccounts.map((account) => (
								<DropdownMenuItem
									className="flex items-center gap-2 cursor-pointer"
									key={account.email}
									onClick={() => onEmailChange(account.email)}
								>
									<div
										className={`h-3 w-3 rounded-full ${getColorClasses(
										account.color ?? emailColorFromString(account.email)
										)}`}
									/>
									<div className="flex flex-col">
										<span className="text-sm">{account.email}</span>
										{account.isDefault && (
											<span className="text-muted-foreground text-xs">
												Default
											</span>
										)}
									</div>
								</DropdownMenuItem>
							))}
							<DropdownMenuItem
								className={`mt-1 flex items-center gap-2 ${canAddMoreAccounts ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
								onClick={async () => {
									if (!canAddMoreAccounts) {
										toast('Upgrade required', { description: 'Upgrade to add more calendar accounts.' })
										return
									}
									await authClient.linkSocial({
										provider: 'google',
										scopes: [
										'https://www.googleapis.com/auth/calendar.events',
										'https://www.googleapis.com/auth/calendar.readonly',
										'https://www.googleapis.com/auth/calendar',
										'https://www.googleapis.com/auth/calendar.calendarlist',
										'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
										'https://www.googleapis.com/auth/calendar.freebusy',
										],
										callbackURL: `${window.location.origin}/calendar`,
										errorCallbackURL: `${window.location.origin}/calendar`,
									})
								}}
							>
								<Plus className="h-4 w-4" />
								<span className="text-sm">{canAddMoreAccounts ? 'Add account' : 'Add account (Pro)'}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			<SidebarGroupLabel className="mt-2">Calendars</SidebarGroupLabel>
			<SidebarMenu>
				{isLoadingCalendars && (
					<SidebarMenuItem>
						<div className="px-2 py-1.5 text-sm text-muted-foreground">
							Loading calendars...
						</div>
					</SidebarMenuItem>
				)}
				
				{!isLoadingCalendars && fetchedCalendars.length === 0 && (
					<SidebarMenuItem>
						<div className="px-2 py-1.5 text-sm text-muted-foreground">
							No calendars found
						</div>
					</SidebarMenuItem>
				)}
				
				{fetchedCalendars.map((calendar: any) => (
					<SidebarMenuItem key={calendar.id}>
						<div
							className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 hover:bg-transparent hover:text-primary"
							onClick={() => handleCalendarToggle(calendar.id)}
						>
							<Checkbox
								checked={visibleCalendars.has(calendar.id)}
								className="cursor-pointer"
								color={calendar.accessRole === 'owner' ? 'bg-red-500' : getCalendarColor(calendar)}
								onCheckedChange={() => handleCalendarToggle(calendar.id)}
							/>
							<span className="flex-1 truncate text-sm">{calendar.summary || calendar.name}</span>
							{calendar.accessRole === 'owner' && (
								<span className="text-xs text-muted-foreground">Default</span>
							)}
						</div>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
