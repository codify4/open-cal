'use client'

import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core"
import { ChatSidebar } from "@/components/agent/chat-sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import AddEventSidebar from "../event/add-event-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useCalendarStore } from "@/providers/calendar-store-provider"
import { Event } from "@/lib/store/calendar-store"
import { ensureDate } from "@/lib/utils"
import { EventCard } from "@/components/event/cards/event-card"
import { useState } from "react"

export function CalendarLayoutClient({ children }: { children: React.ReactNode }) {
    const [activeEvent, setActiveEvent] = useState<Event | null>(null)
    const {
        isChatSidebarOpen,
        isEventSidebarOpen,
        isChatFullscreen,
        toggleChatSidebar,
        setChatFullscreen,
        closeEventSidebar,
        updateEventTime,
        setCurrentDate,
        currentDate
    } = useCalendarStore((state) => state)

    const closeChatSidebar = () => {
        toggleChatSidebar()
    }

    const toggleFullscreen = () => {
        setChatFullscreen(!isChatFullscreen)
    }

    const handleDragStart = (event: DragStartEvent) => {
        console.log('Drag started:', event)
        if (event.active.data.current) {
            setActiveEvent(event.active.data.current as Event)
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        console.log('Drag ended:', event)
        setActiveEvent(null)
        
        const { active, over } = event;
        
        if (over && active.data.current) {
            const draggedEvent = active.data.current as Event;
            const dropData = over.data.current as { dayIndex: number; hourIndex: number; date: Date };
            
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
                
                const duration = originalEndDate.getTime() - originalStartDate.getTime();
                const newEndDate = new Date(newStartDate.getTime() + duration);
                
                updateEventTime(draggedEvent.id, newStartDate, newEndDate);
                
                // Only navigate if the event was dropped in a different month
                const isDifferentMonth = newStartDate.getMonth() !== currentDate.getMonth() || 
                                       newStartDate.getFullYear() !== currentDate.getFullYear();
                
                if (isDifferentMonth) {
                    setCurrentDate(newStartDate);
                }
            }
        }
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <SidebarProvider>
                <AppSidebar className="bg-neutral-950 border-none" variant="inset" />
                <ResizablePanelGroup direction="horizontal" className="min-h-screen md:p-1.5 gap-1">
                    <ResizablePanel defaultSize={isChatSidebarOpen ? 70 : 100} minSize={30} className="md:rounded-xl overflow-hidden p-0">
                        <SidebarInset className="md:rounded-xl bg-neutral-900 h-screen overflow-hidden">
                            <div className="h-full overflow-y-auto scrollbar-hide">
                                {children}
                            </div>
                        </SidebarInset>
                    </ResizablePanel>
                    {isChatSidebarOpen && (
                        <>
                            <ResizableHandle withHandle className="opacity-0 hover:opacity-100 transition-opacity duration-300"/>
                            <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-neutral-900 rounded-lg p-2">
                                <div className="h-full rounded-xl shadow-sm overflow-hidden">
                                    <ChatSidebar 
                                        isFullscreen={isChatFullscreen} 
                                        onToggleSidebar={closeChatSidebar}
                                        onToggleFullscreen={toggleFullscreen}
                                    />
                                </div>
                            </ResizablePanel>
                        </>
                    )}
                    {isEventSidebarOpen && (
                        <>
                            <ResizableHandle withHandle className="opacity-0 hover:opacity-100 transition-opacity duration-300"/>
                            <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-neutral-900 rounded-lg p-2 min-w-[400px]">
                                <div className="h-full rounded-xl shadow-sm overflow-hidden">
                                    <AddEventSidebar 
                                        onClick={closeEventSidebar}
                                    />
                                </div>
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
                {isChatFullscreen && (
                    <div className="fixed inset-0 z-50 bg-neutral-900 p-5">
                        <ChatSidebar 
                            isFullscreen={true} 
                            onToggleSidebar={closeChatSidebar}
                            onToggleFullscreen={toggleFullscreen}
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
    )
} 