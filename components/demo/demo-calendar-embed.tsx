"use client"

import { DemoCalendarStoreProvider } from "@/components/demo/demo-calendar-store-provider"
import { DemoAppSidebar } from "@/components/demo/demo-app-sidebar"
import { DemoChatSidebar } from "@/components/demo/demo-chat-sidebar"
import DemoCalendar from "@/components/demo/demo-calendar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import type { CalendarState, Event } from "@/lib/store/calendar-store"
import { useState } from "react"

const demoEvents: Event[] = [
    {
        id: "demo-1",
        title: "Prospect Demo",
        startDate: new Date(new Date().setHours(10, 0, 0, 0)),
        endDate: new Date(new Date().setHours(11, 0, 0, 0)),
        color: "blue",
        type: "event",
    },
    {
        id: "demo-2",
        title: "Follow-up Call",
        startDate: new Date(new Date().setHours(14, 0, 0, 0)),
        endDate: new Date(new Date().setHours(14, 45, 0, 0)),
        color: "green",
        type: "event",
    },
]

const demoState: CalendarState = {
    isChatSidebarOpen: false,
    isChatFullscreen: false,
    isEventSidebarOpen: false,
    selectedEvent: null,
    eventCreationContext: null,
    hasUnsavedChanges: false,
    isNewEvent: false,
    currentDate: new Date(),
    selectedDate: new Date(),
    viewType: "week",
    navigationDirection: 0,
    eventColors: ["blue", "green", "red"],
    eventTypes: ["event", "birthday"],
    events: demoEvents,
    pendingActions: [],
    isProcessing: false,
}

export function DemoCalendarEmbed({ className = "" }: { className?: string }) {
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);
    const [isChatFullscreen, setIsChatFullscreen] = useState(false);

    const toggleChatSidebar = () => {
        setIsChatSidebarOpen(!isChatSidebarOpen);
    }

    const toggleChatFullscreen = () => {
        setIsChatFullscreen(!isChatFullscreen);
    }

    return (
        <div className={`${className} h-[700px] w-full rounded-2xl`}>
            <DemoCalendarStoreProvider initState={demoState}>
                <SidebarProvider className="min-h-0 h-full bg-neutral-950 rounded-2xl">
                    <div className="flex h-full rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
                        <DemoAppSidebar className="w-64 shrink-0 grow-0 basis-64 border-r border-neutral-800" />
                        <ResizablePanelGroup direction="horizontal" className="flex-1 min-w-0">
                            <ResizablePanel defaultSize={70} minSize={50}>
                                <SidebarInset className="h-full overflow-hidden bg-neutral-900 border-0">
                                    <div className="h-full overflow-y-auto scrollbar-hide">
                                        <DemoCalendar />
                                    </div>
                                </SidebarInset>
                            </ResizablePanel>
                            <ResizableHandle className="bg-white/10 w-px" />
                            <ResizablePanel defaultSize={30} minSize={25} maxSize={45}>
                                <DemoChatSidebar 
                                    className="h-full border-l border-white/10" 
                                />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </SidebarProvider>
            </DemoCalendarStoreProvider>
        </div>
    )
}


