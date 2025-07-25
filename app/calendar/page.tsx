'use client'

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { useAtom } from "jotai"
import { isChatSidebarOpenAtom } from "@/lib/atoms/chat-atom"

function CalendarPage() {
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useAtom(isChatSidebarOpenAtom)

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <SidebarTrigger />
            </div>
            <h1>My calendar</h1>
            
            {!isChatSidebarOpen && (
                <Button
                    onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
                    className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 shadow-lg bg-neutral-800 hover:bg-neutral-700 text-white"
                    size="icon"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            )}
        </div>
    );
}
export default CalendarPage