'use client';

import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import CalendarView from '@/components/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/providers/calendar-store-provider';

function CalendarPage() {
  const { isLoaded } = useUser();
  const { theme } = useTheme();
  const { isChatSidebarOpen, toggleChatSidebar } = useCalendarStore(
    (state) => state
  );

  return (
    <div className="h-full">
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
