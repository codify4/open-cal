'use client'

import { Button } from "@/components/ui/button"
import CalendarView from "@/components/calendar/calendar-view"
import Image from "next/image"
import { useCalendarStore } from "@/providers/calendar-store-provider"

function CalendarPage() {
    const { isChatSidebarOpen, toggleChatSidebar } = useCalendarStore((state) => state)
    
    return (
        <div className="h-full">
            <CalendarView />
            
            {!isChatSidebarOpen && (
                <Button
                    onClick={toggleChatSidebar}
                    className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg bg-black text-white"
                    size="icon"
                >
                    <Image src="/open-cal.svg" alt="OpenCal" width={30} height={30} />
                </Button>
            )}
        </div>
    );
}

export default CalendarPage;