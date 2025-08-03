'use client';

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';
import { ChatSidebar } from '@/components/agent/chat-sidebar';
import { EventCard } from '@/components/event/cards/event-card';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Event } from '@/lib/store/calendar-store';
import { ensureDate } from '@/lib/utils';
import { useCalendarStore } from '@/providers/calendar-store-provider';
import AddEventSidebar from '../event/add-event-sidebar';

export function CalendarLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const {
    isChatSidebarOpen,
    isEventSidebarOpen,
    isChatFullscreen,
    toggleChatSidebar,
    setChatFullscreen,
    closeEventSidebar,
    updateEventTime,
    setCurrentDate,
    currentDate,
  } = useCalendarStore((state) => state);

  const closeChatSidebar = () => {
    toggleChatSidebar();
  };

  const toggleFullscreen = () => {
    setChatFullscreen(!isChatFullscreen);
  };

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event);
    if (event.active.data.current) {
      setActiveEvent(event.active.data.current as Event);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('Drag ended:', event);
    setActiveEvent(null);

    const { active, over } = event;

    if (over && active.data.current) {
      const draggedEvent = active.data.current as Event;
      const dropData = over.data.current as {
        dayIndex: number;
        hourIndex: number;
        date: Date;
      };

      if (dropData) {
        const originalStartDate = ensureDate(draggedEvent.startDate);
        const originalEndDate = ensureDate(draggedEvent.endDate);

        // Preserve the original time components (minutes, seconds, milliseconds)
        const originalMinutes = originalStartDate.getMinutes();
        const originalSeconds = originalStartDate.getSeconds();
        const originalMilliseconds = originalStartDate.getMilliseconds();

        const newStartDate = new Date(dropData.date);
        newStartDate.setHours(dropData.hourIndex);
        newStartDate.setMinutes(originalMinutes);
        newStartDate.setSeconds(originalSeconds);
        newStartDate.setMilliseconds(originalMilliseconds);

        const duration =
          originalEndDate.getTime() - originalStartDate.getTime();
        const newEndDate = new Date(newStartDate.getTime() + duration);

        updateEventTime(draggedEvent.id, newStartDate, newEndDate);

        // Only navigate if the event was dropped in a different month
        const isDifferentMonth =
          newStartDate.getMonth() !== currentDate.getMonth() ||
          newStartDate.getFullYear() !== currentDate.getFullYear();

        if (isDifferentMonth) {
          setCurrentDate(newStartDate);
        }
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
      <SidebarProvider className="scrollbar-hide">
        <AppSidebar className="border-none dark:bg-neutral-950" variant="inset" />
        <ResizablePanelGroup
          className="bg-neutral-100 dark:bg-neutral-950 min-h-screen gap-1 md:p-1.5"
          direction="horizontal"
        >
          <ResizablePanel
            className="overflow-hidden p-0 md:rounded-xl shadow-2xs"
            defaultSize={isChatSidebarOpen ? 70 : 100}
            minSize={30}
          >
            <SidebarInset className="h-screen overflow-hidden border bg-white dark:bg-neutral-900 md:rounded-xl">
              <div className="scrollbar-hide h-full overflow-y-auto">
                {children}
              </div>
            </SidebarInset>
          </ResizablePanel>
          {isChatSidebarOpen && !isChatFullscreen && (
            <>
              <ResizableHandle
                className="opacity-0 transition-opacity duration-300 hover:opacity-100"
                withHandle
              />
              <ResizablePanel
                className="rounded-lg bg-white dark:bg-neutral-900 border p-2 max-h-svh"
                defaultSize={30}
                maxSize={50}
                minSize={20}
              >
                <div className="h-full rounded-xl shadow-sm">
                  <ChatSidebar
                    isFullscreen={false}
                    onToggleFullscreen={toggleFullscreen}
                    onToggleSidebar={closeChatSidebar}
                    className="bg-white dark:bg-neutral-900"
                  />
                </div>
              </ResizablePanel>
            </>
          )}
          {isEventSidebarOpen && (
            <>
              <ResizableHandle
                className="opacity-0 transition-opacity duration-300 hover:opacity-100"
                withHandle
              />
              <ResizablePanel
                className="min-w-[400px] rounded-lg border bg-white dark:bg-neutral-900 p-2"
                defaultSize={30}
                maxSize={50}
                minSize={20}
              >
                <div className="h-full overflow-hidden rounded-xl shadow-sm">
                  <AddEventSidebar onClick={closeEventSidebar} />
                </div>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
        {isChatFullscreen && (
          <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900 p-5">
            <ChatSidebar
              isFullscreen={true}
              onToggleFullscreen={toggleFullscreen}
              onToggleSidebar={closeChatSidebar}
            />
          </div>
        )}
      </SidebarProvider>
      <DragOverlay zIndex={9999}>
        {activeEvent ? (
          <div className="">
            <EventCard event={activeEvent} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
