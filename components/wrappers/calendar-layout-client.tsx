'use client'

import { ChatSidebar } from "@/components/agent/chat-sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { useAtom } from "jotai"
import { isChatSidebarOpenAtom } from "@/lib/atoms/chat-atom"
import { useEffect, useState } from "react"

export function CalendarLayoutClient({ children }: { children: React.ReactNode }) {
    const [isChatSidebarOpen, setIsChatSidebarOpen] = useAtom(isChatSidebarOpenAtom)
    const [isFullscreen, setIsFullscreen] = useState(false);

    const closeChatSidebar = () => {
        setIsChatSidebarOpen(false);
        localStorage.setItem('isChatSidebarOpen', 'false');
    }

    // Load localStorage value only on client side after hydration
    useEffect(() => {
        const storedChatSidebarState = localStorage.getItem('isChatSidebarOpen');
        if (storedChatSidebarState !== null) {
            setIsChatSidebarOpen(JSON.parse(storedChatSidebarState));
        }
    }, [setIsChatSidebarOpen]);

    // Save state changes to localStorage
    useEffect(() => {
        localStorage.setItem('isChatSidebarOpen', JSON.stringify(isChatSidebarOpen));
    }, [isChatSidebarOpen]);

    return (
        <SidebarProvider>
            <AppSidebar className="bg-neutral-950 border-none" variant="inset" />
            <ResizablePanelGroup direction="horizontal" className="min-h-screen p-2 gap-1">
                <ResizablePanel defaultSize={isChatSidebarOpen ? 70 : 100} minSize={30}>
                    <SidebarInset className="bg-neutral-900 h-full rounded-xl shadow-sm overflow-hidden">
                        {children}
                    </SidebarInset>
                </ResizablePanel>
                {isChatSidebarOpen && (
                    <>
                        <ResizableHandle withHandle className="opacity-0 hover:opacity-100 transition-opacity duration-300"/>
                        <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="bg-neutral-900 rounded-lg p-2">
                            <div className="bg-neutral-900 h-full rounded-xl shadow-sm overflow-hidden">
                                <ChatSidebar isFullscreen={isFullscreen} onToggleFullscreen={() => setIsFullscreen(!isFullscreen)} />
                            </div>
                        </ResizablePanel>
                    </>
                )}
            </ResizablePanelGroup>
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-neutral-900 p-5">
                    <ChatSidebar isFullscreen={true} onToggleFullscreen={() => setIsFullscreen(false)} />
                </div>
            )}
        </SidebarProvider>
    )
} 