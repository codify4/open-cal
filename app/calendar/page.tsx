'use client';

import Image from 'next/image';
import CalendarView from '@/components/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import MobileDialog from '@/components/wrappers/mobile-dialog';
import { authClient } from '@/lib/auth-client';

function CalendarPage() {
  const { data: session, isPending } = authClient.useSession();
  const { isChatSidebarOpen, toggleChatSidebar } = useCalendarStore(
    (state) => state
  );

  if (isPending) {
    return (
      <div className="h-full grid place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-600 dark:border-t-neutral-100" />
          <div className="text-sm text-muted-foreground">Loading…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <MobileDialog />
      <CalendarView />

      {!isChatSidebarOpen && (
        <Button
          className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-black text-white shadow-lg hover:bg-black"
          onClick={toggleChatSidebar}
          size="icon"
        >
          <Image alt="Caly" height={40} src="/caly.svg" width={40} className='rounded-full' />
        </Button>
      )}
    </div>
  );
}

export default CalendarPage;
