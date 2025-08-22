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
import AddEventDrawer from '../event/add-event-drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateEventHeight } from '@/components/event/cards/utils/event-card-utils';
import { getActualColor } from '@/lib/calendar-utils/calendar-color-utils';

export function CalendarLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const { user } = useUser();
  const isMobile = useIsMobile();
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
      
      // Parse the drop zone ID to extract hour and minute information
      const dropZoneId = String(over.id);
      const dropData = over.data.current as {
        dayIndex?: number;
        hourIndex?: number;
        date: Date;
        minuteOffset?: number;
      };
      
      if (draggedEvent && dropData) {
        const originalStartDate = ensureDate(draggedEvent.startDate);
        const originalEndDate = ensureDate(draggedEvent.endDate);

        // Calculate the new start time with 15-minute precision
        const newStartDate = new Date(dropData.date);
        const hourToSet =
          typeof dropData.hourIndex === 'number'
            ? dropData.hourIndex
            : originalStartDate.getHours();
        
        // Use the minute offset from the drop zone data
        const minutesToSet = dropData.minuteOffset || 0;
        
        newStartDate.setHours(hourToSet);
        newStartDate.setMinutes(minutesToSet);
        newStartDate.setSeconds(0);
        newStartDate.setMilliseconds(0);

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
    <DndContext 
      onDragEnd={handleDragEnd} 
      onDragStart={handleDragStart}
    >
      <SidebarProvider className="scrollbar-hide">
        <AppSidebar
          className="border-none dark:bg-neutral-950"
          variant="inset"
        />
        <ResizablePanelGroup
          className="min-h-screen gap-1 bg-neutral-100 md:p-1.5 dark:bg-neutral-950"
          direction="horizontal"
          data-dragging={activeEvent ? "true" : "false"}
        >
          <ResizablePanel
            className="overflow-hidden p-0 shadow-2xs md:rounded-xl"
            defaultSize={isChatSidebarOpen ? 70 : 100}
            minSize={30}
          >
            <SidebarInset className="h-screen overflow-hidden border bg-white md:rounded-xl dark:bg-neutral-900">
              <div 
                className="scrollbar-hide h-full overflow-y-auto"
                data-dragging={activeEvent ? "true" : "false"}
              >
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
          {isEventSidebarOpen && !isMobile && (
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
          
          {isEventSidebarOpen && isMobile && (
            <AddEventDrawer 
              open={isEventSidebarOpen} 
              onOpenChange={(open) => {
                if (!open) closeEventSidebar();
              }} 
            />
          )}
        </ResizablePanelGroup>
        {chatMode === 'fullscreen' && (
          <div className="fixed inset-0 z-50 bg-white p-2 lg:p-5 dark:bg-neutral-900">
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
          <div 
            className="event-card group flex flex-row relative rounded-sm border-2 p-2 text-xs shadow-lg opacity-80"
            style={{
              height: `${calculateEventHeight(activeEvent.startDate, activeEvent.endDate)}px`,
              minHeight: `${calculateEventHeight(activeEvent.startDate, activeEvent.endDate)}px`,
              width: '200px',
              backgroundColor: getActualColor(activeEvent.color),
              borderColor: getActualColor(activeEvent.color)
            }}
          >
            <div
              className="w-[2px] rounded-sm min-h-[30px]"
              style={{ backgroundColor: getActualColor(activeEvent.color) }}
            />
            <div className="relative z-10 flex flex-col gap-2 ml-2">
              <div className="font-medium text-xs truncate text-white">
                {activeEvent.title}
              </div>
              <div className="text-xs text-white/80">
                {new Date(activeEvent.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(activeEvent.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
