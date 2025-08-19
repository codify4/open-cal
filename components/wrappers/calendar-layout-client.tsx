'use client';

import { useUser } from '@clerk/nextjs';
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
import { useOptimisticEventSync } from '@/hooks/use-optimistic-event-sync';
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
  const { user } = useUser();
  const {
    isChatSidebarOpen,
    isEventSidebarOpen,
    chatMode,
    toggleChatSidebar,
    setChatMode,
    closeEventSidebar,
    setCurrentDate,
    currentDate,
    events,
    googleEvents,
    updateEventTime,
  } = useCalendarStore((state) => state);
  const { optimisticUpdate, commit } = useOptimisticEventSync();

  const closeChatSidebar = () => {
    toggleChatSidebar();
  };

  const toggleFullscreen = () => {
    if (chatMode === 'fullscreen') {
      setChatMode('popup');
    } else {
      setChatMode('fullscreen');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current) {
      setActiveEvent(event.active.data.current as Event);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveEvent(null);

    const { active, over } = event;

    if (over) {
      const eventId = String(active.id);
      const fromActive = (active.data.current as Event | null) || null;
      const fromLocal = events.find((e) => e.id === eventId) || null;
      const fromGoogle = googleEvents.find((e) => e.id === eventId) || null;
      const draggedEvent = fromActive || fromLocal || fromGoogle;
      const dropData = over.data.current as {
        dayIndex?: number;
        hourIndex?: number;
        date: Date;
      };
      if (draggedEvent && dropData) {
        const originalStartDate = ensureDate(draggedEvent.startDate);
        const originalEndDate = ensureDate(draggedEvent.endDate);

        // Preserve the original time components (minutes, seconds, milliseconds)
        const originalMinutes = originalStartDate.getMinutes();
        const originalSeconds = originalStartDate.getSeconds();
        const originalMilliseconds = originalStartDate.getMilliseconds();

        const newStartDate = new Date(dropData.date);
        const hourToSet =
          typeof dropData.hourIndex === 'number'
            ? dropData.hourIndex
            : originalStartDate.getHours();
        newStartDate.setHours(hourToSet);
        newStartDate.setMinutes(originalMinutes);
        newStartDate.setSeconds(originalSeconds);
        newStartDate.setMilliseconds(originalMilliseconds);

        const duration =
          originalEndDate.getTime() - originalStartDate.getTime();
        const newEndDate = new Date(newStartDate.getTime() + duration);
        // Use optimistic update + background sync
        const result = optimisticUpdate(
          draggedEvent.id,
          newStartDate,
          newEndDate
        );

        if (result) {
          const { updatedEvent, revert } = result;
          // Commit to Google Calendar in the background
          if (user?.id) {
            commit(
              updatedEvent,
              user.id,
              user.primaryEmailAddress?.emailAddress
            ).catch(() => {
              revert();
            });
          }
        } else {
          // Fallback: direct store update
          updateEventTime(draggedEvent.id, newStartDate, newEndDate);
        }

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
        <AppSidebar
          className="border-none dark:bg-neutral-950"
          variant="inset"
        />
        <ResizablePanelGroup
          className="min-h-screen gap-1 bg-neutral-100 md:p-1.5 dark:bg-neutral-950"
          direction="horizontal"
        >
          <ResizablePanel
            className="overflow-hidden p-0 shadow-2xs md:rounded-xl"
            defaultSize={isChatSidebarOpen ? 70 : 100}
            minSize={30}
          >
            <SidebarInset className="h-screen overflow-hidden border bg-white md:rounded-xl dark:bg-neutral-900">
              <div className="scrollbar-hide h-full overflow-y-auto">
                {children}
              </div>
            </SidebarInset>
          </ResizablePanel>
          {isChatSidebarOpen && chatMode === 'sidebar' && (
            <>
              <ResizableHandle
                className="opacity-0 transition-opacity duration-300 hover:opacity-100"
                withHandle
              />
              <ResizablePanel
                className="max-h-svh rounded-lg border bg-white p-2 dark:bg-neutral-900"
                defaultSize={30}
                maxSize={50}
                minSize={20}
              >
                <div className="h-full rounded-xl shadow-sm">
                  <ChatSidebar
                    className="bg-white dark:bg-neutral-900"
                    mode={chatMode}
                    onToggleFullscreen={toggleFullscreen}
                    onTogglePopup={() => setChatMode('popup')}
                    onToggleSidebar={closeChatSidebar}
                  />
                </div>
              </ResizablePanel>
            </>
          )}
          {isChatSidebarOpen && chatMode === 'popup' && (
            <div className="fixed right-4 bottom-4 z-50 h-[600px] w-96 rounded-xl border bg-white shadow-lg dark:bg-neutral-900">
              <ChatSidebar
                className="h-full"
                mode="popup"
                onToggleFullscreen={toggleFullscreen}
                onTogglePopup={() => setChatMode('sidebar')}
                onToggleSidebar={closeChatSidebar}
              />
            </div>
          )}
          {isEventSidebarOpen && (
            <>
              <ResizableHandle
                className="opacity-0 transition-opacity duration-300 hover:opacity-100"
                withHandle
              />
              <ResizablePanel
                className="min-w-[400px] rounded-lg border bg-white p-2 dark:bg-neutral-900"
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
        {chatMode === 'fullscreen' && (
          <div className="fixed inset-0 z-50 bg-white p-5 dark:bg-neutral-900">
            <ChatSidebar
              mode="fullscreen"
              onToggleFullscreen={toggleFullscreen}
              onTogglePopup={() => setChatMode('sidebar')}
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
