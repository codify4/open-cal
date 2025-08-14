'use client';

import { ChevronRight, Plus } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';
import { getColorClasses, emailColorFromString } from '@/lib/calendar-color-utils';
import type { EmailAccount } from '@/types/calendar';

interface AccountDropdownProps {
	emailAccounts: EmailAccount[];
	selectedEmail: string;
	onEmailChange: (email: string) => void;
	userEmail?: string;
}

export function AccountDropdown({
	emailAccounts,
	selectedEmail,
	onEmailChange,
	userEmail,
}: AccountDropdownProps) {
	const { isMobile } = useSidebar();
	const selectedAccount = emailAccounts.find(
		(acc) => acc.email === selectedEmail
	);
	const canAddMoreAccounts = Boolean(emailAccounts.length === 0);

	const handleAddAccount = async () => {
		if (!canAddMoreAccounts) {
			toast('Upgrade required', { description: 'Upgrade to add more calendar accounts.' });
			return;
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
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton className="w-full cursor-pointer justify-between rounded-sm py-5 hover:bg-primary/10 hover:text-primary focus:bg-transparent focus:outline-none focus:ring-0 active:bg-transparent">
					<div className="flex items-center gap-2">
						<div
							className={`h-3 w-3 rounded-full ${getColorClasses(
								(selectedAccount?.color ?? emailColorFromString(selectedAccount?.email || userEmail || ''))
							)}`}
						/>
						<div className="flex flex-col items-start">
							<span className="truncate font-medium text-sm">
								{selectedAccount?.email || userEmail || 'Select Account'}
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
					onClick={handleAddAccount}
				>
					<Plus className="h-4 w-4" />
					<span className="text-sm">{canAddMoreAccounts ? 'Add account' : 'Add account (Pro)'}</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
