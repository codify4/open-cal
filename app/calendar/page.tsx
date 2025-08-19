'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import CalendarView from '@/components/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import MobileDialog from '@/components/wrappers/mobile-dialog';
import { useCalendarStore } from '@/providers/calendar-store-provider';

function CalendarPage() {
  const { user, isLoaded } = useUser();
  const { theme } = useTheme();
  const { isChatSidebarOpen, toggleChatSidebar } = useCalendarStore(
    (state) => state
  );

  if (!isLoaded) {
    return (
      <div className="grid h-full place-items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-600 dark:border-t-neutral-100" />
          <div className="text-muted-foreground text-sm">Loading…</div>
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
          className="fixed right-4 bottom-4 z-50 h-10 w-10 rounded-full border bg-black text-white hover:bg-black dark:border-none dark:shadow-lg"
          onClick={toggleChatSidebar}
          size="icon"
        >
          <Image
            alt="Caly"
            className="rounded-full"
            height={40}
            src={theme === 'dark' ? '/caly.svg' : '/caly-light.svg'}
            width={40}
          />
        </Button>
      )}
    </div>
  );
}

export default CalendarPage;
