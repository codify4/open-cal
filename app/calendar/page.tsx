'use client'

import { Button } from "@/components/ui/button"
import FullCalendar from "@/components/calendar/full-calendar"
import Image from "next/image"
import { useCalendarStore } from "@/providers/calendar-store-provider"

function CalendarPage() {
    const { isChatSidebarOpen, toggleChatSidebar } = useCalendarStore((state) => state)
    
    return (
        <div className="h-full">
            <FullCalendar />
            
            {!isChatSidebarOpen && (
                <Button
                    onClick={toggleChatSidebar}
                    className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg bg-neutral-800 hover:bg-neutral-700 text-white"
                    size="icon"
                >
                    <Image src="/open-cal.svg" alt="OpenCal" fill className="object-contain rounded-full" />
                </Button>
            )}
        </div>
    );
}

export default CalendarPage;