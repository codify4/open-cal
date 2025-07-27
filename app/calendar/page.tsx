'use client'

import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useAtom } from "jotai"
import { isChatSidebarOpenAtom } from "@/lib/atoms/chat-atom"
import FullCalendar from "@/components/calendar/full-calendar"
import Image from "next/image"

function CalendarPage() {
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useAtom(isChatSidebarOpenAtom)
    
    const toggleChatSidebar = () => {
        const newState = !isChatSidebarOpen;
        setIsChatSidebarOpen(newState);
        localStorage.setItem('isChatSidebarOpen', JSON.stringify(newState));
    }
    
    return (
        <div>
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
export default CalendarPage