'use client';

import Image from 'next/image';
import CalendarView from '@/components/calendar/calendar-view';
import { Button } from '@/components/ui/button';
import { useCalendarStore } from '@/providers/calendar-store-provider';

function CalendarPage() {
  const { isChatSidebarOpen, toggleChatSidebar } = useCalendarStore(
    (state) => state
  );

  return (
    <div className="h-full">
      <CalendarView />

      {!isChatSidebarOpen && (
        <Button
          className="fixed right-4 bottom-4 z-50 h-12 w-12 rounded-full bg-black text-white shadow-lg hover:bg-black"
          onClick={toggleChatSidebar}
          size="icon"
        >
          <Image alt="OpenCal" height={40} src="/open-cal.svg" width={40} className='rounded-full' />
        </Button>
      )}
    </div>
  );
}

export default CalendarPage;
